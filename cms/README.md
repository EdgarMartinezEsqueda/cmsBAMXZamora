# Backend único BAMX — Strapi 5.53.0

Plan y avance: [PLAN-MIGRACION-STRAPI.md](../docs/PLAN-MIGRACION-STRAPI.md).
Inventario y respaldo: [INVENTARIO-MIGRACION.md](../docs/INVENTARIO-MIGRACION.md).

Strapi ahora ofrece el panel, la lectura de Inicio y contacto/Resend. Express ya no
interviene en estos flujos. `/server` se conserva para exportar/verificar sus 10
páginas y retirar el código anterior después de completar la migración.

## Arranque

Desde `cms`: `npm ci`, `npm run build` y `npm start`. Para desarrollo de esquemas,
`npm run develop`. En PowerShell con scripts restringidos, usar `npm.cmd`.

Panel: `http://127.0.0.1:1337/gestion-bamx`. La cuenta existente se conserva.
En un entorno nuevo, el administrador técnico crea las cuentas antes de entregar.
No hay contraseñas prefijadas ni registro público de clientes. Las cuentas pertenecen
a esta base de datos, no a Strapi Cloud.

Español habilitado en `src/admin/app.js`. En un navegador nuevo es la preferencia
inicial; si ya eligió inglés, cambiar Perfil → Interface language → Español y guardar.
El bootstrap aplica las etiquetas editoriales una vez y crea el rol **Editor BAMX**.
No reasigna usuarios existentes ni sobrescribe posteriormente etiquetas modificadas.
Asignar ese rol a las cuentas del cliente. Tiene acceso a Inicio, configuración de
contacto y medios; no tiene administración de usuarios, roles, tokens o esquemas.
Falta comprobar la experiencia visual con una cuenta editorial real antes de entregar.

## Frontend y contenido

En el `.env` de la raíz, conservar las variables existentes y añadir:

```dotenv
VITE_CONTENT_SOURCE=strapi
VITE_CMS_URL=http://127.0.0.1:1337
VITE_TURNSTILE_SITE_KEY=CLAVE_PUBLICA_DEL_WIDGET
```

Reiniciar Vite o recompilar. En producción dejar `VITE_CMS_URL` vacío si Nginx expone
`/api` en el mismo origen. Las variables `STRAPI_API_TOKEN` y `STRAPI_URL` de Express
ya no son necesarias para estos flujos. No se incluyen tokens privados en React.

La bandera `VITE_CONTENT_SOURCE=static` (valor por defecto si falta) conserva el Hero
inicial solo durante la migración; contacto siempre utiliza Strapi. Solo el Hero
está migrado en Inicio; las demás secciones permanecen estáticas.

`GET /api/content/:key` consulta internamente el documento publicado y devuelve solo
props, sin metadatos privados. Las claves válidas están en
`src/api/public-site/content-registry.js` (hoy: `home`); cualquier otra responde 404.
Cada clave declara su tipo, su `populate` y el mapper de `shared/content/` que filtra
la salida. No usa caché inicialmente: una publicación o retirada
se refleja en la siguiente petición. `GET /api/home` permanece restringido.
Configurar `MEDIA_PUBLIC_ORIGIN` en `cms/.env`: localmente `http://127.0.0.1:1337`;
en producción el origen independiente donde Nginx sirva los medios.

En un clon nuevo, `npm run seed` importa el contenido inicial de `src/content/*.initial.js`
y sus imágenes, y lo publica si aún no existe (`npm run seed home` para una sola clave).
Nunca sobrescribe un tipo que ya tiene borrador. Los sembradores están en
`scripts/seeders/`; solo suben archivos de `public/`.

El rol `Editor BAMX` y las etiquetas en español se sincronizan en cada arranque desde
`src/setup/editorial.js`. Un tipo nuevo no es editable por el cliente hasta que se agrega
a `EDITORIAL_TYPES`; los tipos que no están ahí (p. ej. datos bancarios) son solo de
administrador.

## Contacto y Resend

En `cms/.env`, configurar:

```dotenv
RESEND_API_KEY=CLAVE_PRIVADA
CONTACT_FROM=BAMX Zamora <no-reply@dominio-verificado.org>
TURNSTILE_SECRET_KEY=CLAVE_PRIVADA_TURNSTILE
TURNSTILE_HOSTNAME=dominio-del-formulario.org
```

No copiar estas claves al frontend ni al repositorio. Las claves antiguas de
`server/.env` no se copian automáticamente; tampoco se imprimen ni se mandan correos
reales durante las pruebas. El remitente debe estar autorizado por Resend.

En Content Manager → Configuración de contacto, agregar entre 1 y 10 destinatarios
y activar **Recibir mensajes**. No hay API pública para este tipo. Si no existe,
está desactivado o contiene datos inválidos, el endpoint devuelve 503 sin enviar.
El navegador no puede elegir destinatarios ni remitente. Las modificaciones se leen
en cada envío, sin caché de destinatarios obsoletos.

`POST /api/contact` recibe `nombre`, `correo`, `mensaje`, `website` (honeypot) y
`captchaToken`. Valida campos con Zod, CAPTCHA en servidor (action `contact`, hostname
si está configurado), límite de 5 solicitudes/IP/10 minutos y resultado de Resend.
JSON general limitado a 1 MB por el parser de Strapi; contacto restringe el cuerpo
a 16 KB antes del controlador. Añadir el límite temprano equivalente en Nginx.
El contador de IP es acotado y por proceso; reiniciar Node reinicia el contador.
En producción se exige CAPTCHA configurado tanto en servidor como en frontend.

El frontend reemplazó EmailJS por fetch y un widget Turnstile explícito para React.
Reinicia el token después de cada intento. La prueba de entrega real requiere claves
válidas, destinatarios configurados y autorización para enviar el mensaje de prueba.
El correo de recuperación del panel es un flujo distinto: falta configurar su
proveedor; no queda resuelto automáticamente por el servicio del formulario.

## Proxy y seguridad

`HOST=127.0.0.1` por defecto. `TRUST_NGINX_PROXY=false` ignora cabeceras de IP del
cliente. Activarlo solo detrás de Nginx controlado, con un único salto, que sobrescriba
`X-Forwarded-For`, y con el puerto Node inaccesible desde Internet. CORS debe enumerar
los orígenes reales en `CORS_ORIGINS`; no constituye un control de autenticación.

El cambio de nombre del panel no lo protege. En el VPS, Nginx deberá permitir los
endpoints públicos concretos y reservar el panel/APIs administrativas al acceso privado.
No se ha cambiado ni desplegado la configuración Nginx de producción.

## Verificación

```text
npm test
npm run test:integration
```

Las pruebas unitarias simulan Resend y Turnstile. La integración levanta solo Strapi
en loopback y comprueba contenido, imagen, restricciones, límites, etiquetas y rol.
No usa Express ni crea tokens ni envía correos. No despublica contenido del usuario.

La instalación local utiliza SQLite `.tmp/data.db` y medios `public/uploads`.
Respaldarlos juntos. Sigue pendiente restaurar MySQL en una base de prueba antes de
retirar los datos antiguos. Desplegar `shared/` junto a `cms/`, pues el contrato se
comparte con React. El driver MySQL para Strapi aún no está instalado.

Sharp está fijado en 0.35.4. npm informa 23 avisos (21 moderados, 2 altos); revisar
actualizaciones compatibles antes del despliegue, sin `audit fix --force` indiscriminado.
Pendientes del plan: normalización completa de archivos, PDFs, cuotas, limpieza,
copias externas, acceso privado y las demás páginas. No considerar esto una entrega
de producción terminada.
