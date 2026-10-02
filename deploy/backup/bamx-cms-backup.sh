#!/usr/bin/env bash
# Respaldo diario del CMS de BAMX Zamora: base de datos de Strapi + archivos subidos.
# Destino en el VPS: /usr/local/sbin/bamx-cms-backup.sh   (chmod 700, dueño root)
#
# Cron (root), todos los días a las 03:30:
#   30 3 * * * /usr/local/sbin/bamx-cms-backup.sh >> /var/log/bamx-cms-backup.log 2>&1
#
# Credenciales de MySQL en un archivo aparte (chmod 600) para que la contraseña no aparezca en
# `ps` ni en este script. /root/.bamx-cms-backup.cnf:
#   [client]
#   user=bamx_cms
#   password=LA_CONTRASEÑA
#   host=127.0.0.1
#
# Restaurar (en una base de prueba primero):
#   gunzip -c bamx_cms-FECHA.sql.gz | mysql --defaults-extra-file=/root/.bamx-cms-backup.cnf bamx_cms_restauracion
#   tar -xzf uploads-FECHA.tar.gz -C __RUTA_REPO__/cms/public

set -euo pipefail

REPO="__RUTA_REPO__"                 # ruta del repositorio en el VPS
DEST="__RUTA_RESPALDOS__/bamx-cms"   # junto al volcado diario de MySQL que ya existe
DB_NAME="bamx_cms"
CREDENTIALS="/root/.bamx-cms-backup.cnf"
KEEP_DAYS=14

STAMP="$(date +%Y-%m-%d_%H%M)"
mkdir -p "$DEST"
chmod 700 "$DEST"

echo "[$(date -Is)] Respaldo iniciado"

# Base de datos. --single-transaction: copia consistente sin bloquear a Strapi.
mysqldump --defaults-extra-file="$CREDENTIALS" \
  --single-transaction --quick --routines --no-tablespaces \
  "$DB_NAME" | gzip -9 > "$DEST/$DB_NAME-$STAMP.sql.gz.tmp"
mv "$DEST/$DB_NAME-$STAMP.sql.gz.tmp" "$DEST/$DB_NAME-$STAMP.sql.gz"

# Imágenes y PDF subidos desde el panel.
tar -czf "$DEST/uploads-$STAMP.tar.gz.tmp" -C "$REPO/cms/public" uploads
mv "$DEST/uploads-$STAMP.tar.gz.tmp" "$DEST/uploads-$STAMP.tar.gz"

# Comprobación mínima: los archivos no están vacíos y el gzip es válido.
gzip -t "$DEST/$DB_NAME-$STAMP.sql.gz"
tar -tzf "$DEST/uploads-$STAMP.tar.gz" > /dev/null

# Rotación.
find "$DEST" -maxdepth 1 -type f \( -name "$DB_NAME-*.sql.gz" -o -name 'uploads-*.tar.gz' \) -mtime +"$KEEP_DAYS" -delete

echo "[$(date -Is)] Respaldo terminado: $(du -sh "$DEST" | cut -f1) en $DEST"
