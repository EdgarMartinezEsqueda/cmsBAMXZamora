# Despliegue de BAMX Zamora en el VPS (sitio + Strapi)

Plan paso a paso para llevar el sitio y el CMS al VPS de Hostinger. Se ejecuta a mano, en orden.
Mientras no se llegue al paso C7, el sitio actual sigue en línea sin cambios.

**No mergear `feat/strapi-cms` a `master` antes del paso C9:** el workflow actual publica el
sitio en cada push a `master`, y el sitio nuevo no funciona sin Strapi.

## Cómo queda

```
Internet ── HTTPS ── Nginx
  bamxzamora.org            → dist/ del sitio (SPA)
      /api/content/*        → Strapi 127.0.0.1:1337   (contenido publicado, solo lectura)
      /api/contact          → Strapi                   (formulario, con límite por IP)
      /api/*  (lo demás)    → 404
      /uploads/*            → imágenes y PDF (Nginx los sirve directo desde cms/public/uploads)
  cms.bamxzamora.org        → Strapi: panel en /gestion-bamx
      /admin/login y afines → límite 5/min por IP + fail2ban
      /api/*                → 404
Strapi: servicio systemd `bamx-cms`, usuario `bamxcms` (sin privilegios), MySQL local.
```

- **El cliente nunca despliega.** Publica en el panel y el cambio se ve al instante.
- **Los cambios de código** se despliegan con un push a `master` (workflow de GitHub). Si agregas
  un tipo de contenido, Strapi crea sus tablas al arrancar; para que el editor lo vea, agrégalo
  a `EDITORIAL_TYPES` en `cms/src/setup/editorial.js`.

## Archivos de esta carpeta

| Archivo del repo | Va en el VPS |
|---|---|
| `nginx/limits.conf` | `/etc/nginx/conf.d/bamx-limits.conf` |
| `nginx/snippets/bamx-proxy.conf` | `/etc/nginx/snippets/bamx-proxy.conf` |
| `nginx/snippets/bamx-security-headers.conf` | `/etc/nginx/snippets/bamx-security-headers.conf` |
| `nginx/site-locations.conf` | `/etc/nginx/snippets/bamx-site-locations.conf` (se incluye en el server del sitio) |
| `nginx/cms.bamxzamora.org.conf` | `/etc/nginx/sites-available/cms.bamxzamora.org` |
| `systemd/bamx-cms.service` | `/etc/systemd/system/bamx-cms.service` |
| `fail2ban/strapi-admin.conf` | `/etc/fail2ban/filter.d/strapi-admin.conf` |
| `fail2ban/strapi-admin.local` | `/etc/fail2ban/jail.d/strapi-admin.local` |
| `backup/bamx-cms-backup.sh` | `/usr/local/sbin/bamx-cms-backup.sh` |
| `github/deploy.yml` | `.github/workflows/deploy.yml` del repo (paso C10) |

Varios archivos traen marcadores que hay que reemplazar:
- `__RUTA_REPO__`: ruta del repo en el VPS (la de `secrets.ROUTE`).
- `__RUTA_RESPALDOS__`: carpeta donde ya se guarda el volcado diario de MySQL.

---

## Fase A — Cambios de código (en tu máquina, rama `feat/strapi-cms`)

### A1. URL pública del panel — `cms/config/server.js` — **ya aplicado en el código**

Para que el panel genere bien sus enlaces detrás del subdominio (p. ej. en el correo de
recuperación de contraseña):

```js
module.exports = ({ env }) => ({
  host: env('HOST', '127.0.0.1'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', ''),   // ← agregar
  // ...lo demás igual
```

### A2. Correo del panel por Resend — `cms/config/plugins.js` — **ya aplicado en el código**

Hoy el panel usa `sendmail` (aparece un aviso en el log) y en el VPS la recuperación de
contraseña no llegaría. Se usa el SMTP de Resend, la misma cuenta del formulario:

```bash
cd cms && pnpm add @strapi/provider-email-nodemailer@5.53.0
```

```js
module.exports = ({ env }) => ({          // ← antes: () => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp.resend.com',
        port: 465,
        secure: true,
        auth: { user: 'resend', pass: env('RESEND_API_KEY') },
      },
      settings: { defaultFrom: env('CONTACT_FROM'), defaultReplyTo: env('CONTACT_FROM') },
    },
  },
  // ...'users-permissions' y upload igual
```

### A3. Carga inicial en producción — `cms/scripts/seed.cjs` — **ya aplicado en el código**

Hoy se niega con `NODE_ENV=production`. Se permite solo con una bandera explícita (línea 24):

```js
const allowProduction = process.argv.includes('--allow-production');
if (process.env.NODE_ENV === 'production' && !allowProduction) {
  throw new Error('Ejecuta la importación inicial en desarrollo (o usa --allow-production una sola vez).');
}
```

### A4. Probar y hacer commit

```bash
pnpm test && pnpm run lint && pnpm run build
cd cms && pnpm test && pnpm run test:integration
cd .. && pnpm run smoke       # con Strapi local corriendo
git add -A && git commit      # en feat/strapi-cms; NO en master
git push origin feat/strapi-cms
```

---

## Fase B — Preparar el VPS (el sitio actual sigue igual)

Todo como `root` por SSH.

### B1. Revisión previa (anota los resultados)

```bash
cat /etc/os-release                # se asume Ubuntu/Debian
nginx -v ; mysql --version ; free -h ; df -h
ss -ltnp                           # el puerto 1337 debe estar libre; ver qué usa la otra plataforma
ls /etc/nginx/sites-enabled/       # cuál es el server block del sitio
ufw status                         # si ya hay firewall
crontab -l                         # dónde está el volcado diario de MySQL que ya existe
```

Si el repo está dentro de `/root` o `/home`, muévelo a `/var/www/bamxzamora` y actualiza
`secrets.ROUTE` y el `root` del server block. El usuario `bamxcms` no puede leer `/root`.

### B2. DNS

En el panel DNS de Hostinger, un registro **A** `cms` → IP del VPS. Espera a que resuelva
(`dig +short cms.bamxzamora.org`).

**Dominio canónico:** si el sitio responde en `www` y en `bamxzamora.org`, redirige uno al otro
(`return 301 https://bamxzamora.org$request_uri;` en el server de `www`). Turnstile, CORS y los
medios usan un solo dominio (`bamxzamora.org`).

### B3. Node 22 del sistema (para el servicio)

El workflow sigue usando el nvm de root para el sitio. El servicio de Strapi usa Node del sistema:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x -o /tmp/nodesource_setup.sh
less /tmp/nodesource_setup.sh      # revísalo antes de ejecutarlo
bash /tmp/nodesource_setup.sh && apt-get install -y nodejs
/usr/bin/node --version            # v22.x
```

### B3b. pnpm con Corepack (en los dos Node)

El proyecto usa pnpm; la versión exacta está en `packageManager` de `package.json` y
`cms/package.json`. Corepack (viene con Node 22) la descarga y la usa sola. Actívalo una vez en
el Node del sistema (Strapi) y en el de nvm (sitio):

```bash
corepack enable                                  # Node del sistema
export NVM_DIR=/root/.nvm && . "$NVM_DIR/nvm.sh" && nvm use v22.19.0
corepack enable                                  # Node de nvm
```

Comprueba con `pnpm --version` desde la carpeta del repo (debe coincidir con `packageManager`).
Si el usuario `bamxcms` no tiene acceso a la caché de Corepack, la primera instalación de C1 la
descarga en su propio `~/.cache`.

### B4. Usuario del servicio

```bash
useradd --system --create-home --home-dir /var/lib/bamxcms --shell /usr/sbin/nologin bamxcms
cd __RUTA_REPO__ && git fetch && git checkout feat/strapi-cms
chown -R bamxcms:bamxcms cms shared
mkdir -p cms/public/uploads && chown bamxcms:bamxcms cms/public/uploads
```

Nginx (`www-data`) sirve `/uploads` directo del disco: necesita poder recorrer la ruta del repo
y leer esa carpeta. Compruébalo con `sudo -u www-data ls __RUTA_REPO__/cms/public/uploads`.

### B5. MySQL: base y usuario dedicados

```sql
CREATE DATABASE bamx_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bamx_cms'@'localhost' IDENTIFIED BY '<contraseña larga: openssl rand -base64 24>';
GRANT ALL PRIVILEGES ON bamx_cms.* TO 'bamx_cms'@'localhost';
FLUSH PRIVILEGES;
```

No se toca ninguna base de la otra plataforma. Verifica que MySQL escuche solo en localhost
(`ss -ltnp | grep 3306` → `127.0.0.1`).

### B6. `cms/.env` de producción

Archivo **nuevo**; no copies el de desarrollo. Genera cada secreto con `openssl rand -base64 32`
(`APP_KEYS` lleva cuatro separados por comas).

```ini
NODE_ENV=production
HOST=127.0.0.1
PORT=1337
PUBLIC_URL=https://cms.bamxzamora.org
APP_KEYS=<4 secretos separados por comas>
API_TOKEN_SALT=<secreto>
ADMIN_JWT_SECRET=<secreto>
TRANSFER_TOKEN_SALT=<secreto>
JWT_SECRET=<secreto>
ENCRYPTION_KEY=<secreto>
DATABASE_CLIENT=mysql
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_NAME=bamx_cms
DATABASE_USERNAME=bamx_cms
DATABASE_PASSWORD=<la de B5>
DATABASE_SSL=false
STRAPI_TELEMETRY_DISABLED=true
MEDIA_PUBLIC_ORIGIN=https://bamxzamora.org
SITE_URL=https://bamxzamora.org
CORS_ORIGINS=https://bamxzamora.org
PDF_EMBED_ORIGINS=https://bamxzamora.org
TRUST_NGINX_PROXY=true
RESEND_API_KEY=<clave de Resend>
CONTACT_FROM=BAMX Zamora <no-responder@bamxzamora.org>   # dominio verificado en Resend
TURNSTILE_SECRET_KEY=<clave secreta del widget>
TURNSTILE_HOSTNAME=bamxzamora.org
SEED_BANK_NAME=BANBAJÍO
SEED_BANK_CLABE=<18 dígitos>
SEED_BANK_ACCOUNT=<cuenta>
```

```bash
chown bamxcms:bamxcms cms/.env && chmod 600 cms/.env
```

**`.env` raíz** (el sitio lo lee al compilar):

```ini
VITE_CMS_URL=
VITE_TURNSTILE_SITE_KEY=<clave pública del MISMO widget de Turnstile>
VITE_InstagramApp=<la actual>
```

`VITE_CMS_URL` vacío = mismo dominio (Nginx lleva `/api` a Strapi). En Cloudflare → Turnstile,
agrega `bamxzamora.org` a los dominios del widget. Puedes borrar del `.env` raíz las variables
que ya no se usan: `VITE_CONTENT_SOURCE`, `VITE_clabe`, `VITE_cuenta`, `VITE_EnlaceBoletin`,
`VITE_BAMX*`, `VITE_SERVICE_ID`, `VITE_TEMPLATE_ID`, `VITE_PUBLIC_KEY`, `VITE_STRAPI_URL`.

### B7. Nginx del panel + certificado

```bash
cp deploy/nginx/limits.conf /etc/nginx/conf.d/bamx-limits.conf
mkdir -p /etc/nginx/snippets
cp deploy/nginx/snippets/*.conf /etc/nginx/snippets/
cp deploy/nginx/cms.bamxzamora.org.conf /etc/nginx/sites-available/cms.bamxzamora.org
ln -s /etc/nginx/sites-available/cms.bamxzamora.org /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d cms.bamxzamora.org      # agrega HTTPS y la redirección
nginx -t && systemctl reload nginx
```

Todavía **no** incluyas `bamx-site-locations.conf` en el sitio (eso es el paso C7).

### B8. fail2ban y firewall

```bash
apt-get install -y fail2ban
cp deploy/fail2ban/strapi-admin.conf  /etc/fail2ban/filter.d/strapi-admin.conf
cp deploy/fail2ban/strapi-admin.local /etc/fail2ban/jail.d/strapi-admin.local
systemctl restart fail2ban && fail2ban-client status strapi-admin
```

Firewall: si `ufw` ya está activo, solo confirma que permite 22, 80 y 443. Si no lo está,
**antes de activarlo** revisa en `ss -ltnp` que la otra plataforma no dependa de otro puerto
público; luego `ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw enable`.

### B9. Respaldos

```bash
sed -e 's#__RUTA_REPO__#/ruta/real#' -e 's#__RUTA_RESPALDOS__#/ruta/respaldos#' \
  deploy/backup/bamx-cms-backup.sh > /usr/local/sbin/bamx-cms-backup.sh
chmod 700 /usr/local/sbin/bamx-cms-backup.sh
# /root/.bamx-cms-backup.cnf con [client] user/password/host (ver cabecera del script); chmod 600
crontab -e    # 30 3 * * * /usr/local/sbin/bamx-cms-backup.sh >> /var/log/bamx-cms-backup.log 2>&1
```

Se suma al volcado diario que ya existe; Hostinger respalda el VPS completo cada semana.
**Riesgo aceptado:** si falla el VPS se puede perder hasta una semana de cambios.

---

## Fase C — Primer despliegue (manual)

### C1. Dependencias y panel de Strapi

```bash
cd __RUTA_REPO__
sudo -u bamxcms -H bash -c 'cd cms && pnpm install --frozen-lockfile && NODE_ENV=production pnpm run build'
```

`--frozen-lockfile` instala exactamente lo de `cms/pnpm-lock.yaml` y falla si no coincide con
`package.json` (el equivalente de `npm ci`).

### C2. Primer administrador por consola — ANTES de abrir el panel

Mientras no exista un administrador, el registro del primero queda abierto a quien llegue.
Créalo por consola (pide los datos de forma interactiva; la contraseña no queda en el historial):

```bash
sudo -u bamxcms -H bash -c 'cd cms && NODE_ENV=production pnpm exec strapi admin:create-user'
```

### C3. Carga inicial

Crea las tablas y carga el contenido real del sitio (textos, programas, fotos, aliados,
preguntas, datos bancarios desde `SEED_BANK_*`). Los casos de apadrinamiento quedan como
borradores sin consentimiento. No trae nada de la base de pruebas.

```bash
sudo -u bamxcms -H bash -c 'cd cms && NODE_ENV=production node scripts/seed.cjs all --publish --allow-production'
```

Después, quita `SEED_BANK_*` de `cms/.env`: ya no hacen falta.

### C4. Servicio

```bash
sed 's#__RUTA_REPO__#/ruta/real#' deploy/systemd/bamx-cms.service > /etc/systemd/system/bamx-cms.service
systemctl daemon-reload && systemctl enable --now bamx-cms
journalctl -u bamx-cms -n 50 --no-pager
curl -fsS http://127.0.0.1:1337/api/content/site | head -c 200
```

### C5. En el panel (`https://cms.bamxzamora.org/gestion-bamx`)

1. Revisa **Datos bancarios** (CLABE y cuenta).
2. **Configuración de contacto**: destinatarios reales y *Recibir mensajes* activado.
3. Crea una cuenta **individual** por persona del banco con el rol **Editor BAMX**. Que cada
   quien cambie su contraseña en el primer acceso.

### C6. Sitio: preparar el cambio

```bash
sed 's#__RUTA_REPO__#/ruta/real#' deploy/nginx/site-locations.conf > /etc/nginx/snippets/bamx-site-locations.conf
```

En el server block HTTPS del sitio (el que viste en B1), agrega **antes** de otras
`location ~* ...`:

```nginx
include snippets/bamx-security-headers.conf;
include snippets/bamx-site-locations.conf;
```

y confirma que exista el fallback de la SPA:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### C7. Cambio visible

```bash
nginx -t && systemctl reload nginx
export NVM_DIR=/root/.nvm && . "$NVM_DIR/nvm.sh" && nvm use v22.19.0
pnpm install --frozen-lockfile && pnpm run build
```

A partir de aquí el sitio público lee de Strapi.

### C8. Verificación completa

Ver la sección **Verificación**. Si algo falla y no se resuelve rápido, **revertir**:

```bash
# quitar los dos include de C6 del server del sitio
nginx -t && systemctl reload nginx
# master todavía es el sitio anterior, que se instala con npm (aún tiene package-lock.json):
git checkout master && npm ci && npm run build      # vuelve el sitio anterior (no necesita Strapi)
```

### C9. Merge a `master`

Con todo verificado: merge de `feat/strapi-cms` a `master` y push. El workflow actual solo hace
`git pull` + build del sitio, así que no rompe nada.

### C10. Workflow nuevo

Reemplaza `.github/workflows/deploy.yml` por `deploy/github/deploy.yml` y haz push. El workflow
nuevo compila y reinicia Strapi, espera a que responda y solo entonces compila el sitio. Si
Strapi no arranca, el job falla y el sitio anterior sigue en línea.

---

## Verificación

Desde fuera del VPS:

| Prueba | Esperado |
|---|---|
| `https://bamxzamora.org/`, `/nosotros`, `/programas`, `/boletines`, una página creada en el panel (recargando directo en cada una) | Cargan (el fallback de la SPA funciona) |
| Una ruta inexistente, p. ej. `/no-existe` | Página 404 del sitio |
| `curl -I https://bamxzamora.org/api/content/site` | 200, `Cache-Control: no-store` |
| `/api/content/nope`, `/api/home`, `/api/auth/local`, `/api/users` | 404 |
| `curl -I https://bamxzamora.org/uploads/<archivo>.pdf` | 200, `application/pdf`, `nosniff` |
| Un boletín en `/boletines/<slug>` | El PDF se ve dentro de la página |
| `https://cms.bamxzamora.org/gestion-bamx` | Carga el login |
| `https://cms.bamxzamora.org/api/content/site` | 404 |
| 6+ logins fallidos seguidos | Nginx responde 429; luego fail2ban bloquea la IP (`fail2ban-client status strapi-admin`). Desbloquea tu IP al terminar |
| Formulario de contacto (con Turnstile) | **Llega el correo** a los destinatarios. Muchos envíos seguidos → 429 |
| "¿Olvidaste tu contraseña?" en el panel | Llega el correo (valida el SMTP de Resend) |
| Con una cuenta Editor BAMX: editar → Publicar | Se ve al recargar el sitio. No ve Datos bancarios ni ajustes |
| `systemctl restart bamx-cms` o reiniciar el VPS | Strapi vuelve solo |
| Día siguiente | Existen `bamx_cms-*.sql.gz` y `uploads-*.tar.gz` |

**Simulacro de restauración (una vez):** restaura el último respaldo en una base
`bamx_cms_restauracion` (comandos en la cabecera del script) y confirma que tiene las tablas y
el contenido.

## Después del lanzamiento (desde el panel)

- Subir los boletines reales.
- Confirmar consentimiento y fecha de vigencia de cada caso de apadrinamiento.
- Nombres reales de los aliados; textos alternativos de la galería.
- Revisar si "Servicio Social" debe publicarse.
- Guía para el cliente: `docs/GUIA-CLIENTE.md`.

## Mantenimiento

- `journalctl -u bamx-cms -f`: log de Strapi. `/var/log/nginx/cms.bamxzamora.org.*.log`: panel.
- Actualizar Strapi: en tu máquina `cd cms && pnpm run upgrade:dry` → `pnpm run upgrade` → pruebas
  → push a `master`. Revisa `pnpm audit` en cada actualización.
- Certificados: certbot los renueva solo (`certbot renew --dry-run` para comprobar).
