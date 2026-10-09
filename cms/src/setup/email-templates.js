'use strict';

// Correos del sistema con el diseño de BAMX Zamora (en lugar de los de Strapi, en inglés):
// - Recuperar contraseña del panel: el que reciben las editoras con "¿Olvidaste tu contraseña?".
//   Strapi lo toma de la configuración (admin.forgotPassword.emailTemplate).
// - Restablecer contraseña y confirmar correo de "Usuarios y permisos": son para cuentas de
//   visitantes, que este sitio no usa, pero se dejan con el mismo diseño por si algún día se activan.
// La dirección y las redes salen de "Datos del sitio" (publicado) y se rehacen al publicarlo.
//
// Strapi rellena las plantillas con lodash: `<%= variable %>`. Todo lo que viene del panel se
// escapa (también "<" de "<%"), así un texto del panel nunca se interpreta como código.

const MARKER = '<!-- bamx-email -->';
const SITE_UID = 'api::site.site';
const NETWORKS = ['facebook', 'instagram', 'youtube', 'tiktok', 'x', 'whatsapp', 'linkedin', 'threads', 'telegram', 'pinterest', 'spotify', 'linktree', 'otro'];
const NETWORK_LABELS = { x: 'X', linktree: 'Todas nuestras redes', otro: 'Más enlaces' };

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const httpsUrl = (value) => {
  try {
    const url = new URL(String(value ?? '').trim());
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch {
    return '';
  }
};
const label = (network) => NETWORK_LABELS[network] ?? network.charAt(0).toUpperCase() + network.slice(1);

/** Datos del pie del correo a partir de "Datos del sitio" (sin nada que no sea https). */
function footerData(site, siteUrl) {
  const social = (Array.isArray(site?.socialLinks) ? site.socialLinks : [])
    .filter((link) => NETWORKS.includes(link?.network) && httpsUrl(link.url))
    .map((link) => ({ network: link.network, url: httpsUrl(link.url) }));
  const linktree = httpsUrl(site?.linktreeUrl);
  if (linktree && !social.some((link) => link.network === 'linktree' || link.url === linktree)) social.push({ network: 'linktree', url: linktree });
  social.push({ network: 'web', url: siteUrl });
  return {
    social,
    address: [site?.address, site?.city].map((part) => String(part ?? '').trim()).filter(Boolean),
  };
}

/**
 * HTML del correo. `button.href` es una expresión de plantilla de Strapi (p. ej. `<%= url %>`):
 * es lo único que no se escapa.
 */
function buildEmail({ siteUrl, site, heading, paragraphs, button, expiry, notice }) {
  const origin = new URL(siteUrl).origin;
  const { social, address } = footerData(site, origin);
  const icons = social.map(({ network, url }) => `
              <td style="padding: 0 6px;">
                <a href="${escapeHtml(url)}" target="_blank" style="text-decoration: none;">
                  <img src="${origin}/assets/email/${network}.png" width="32" height="32" alt="${escapeHtml(network === 'web' ? 'Sitio web' : label(network))}" style="display: block; border: 0;">
                </a>
              </td>`).join('');
  const text = paragraphs.map((paragraph) => `
          <p style="margin: 0 0 14px;">${escapeHtml(paragraph)}</p>`).join('');
  return `${MARKER}
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(heading)}</title></head>
<body style="margin: 0; padding: 0; background-color: #f3f4f5;">
  <span style="display: none; max-height: 0; overflow: hidden;">${escapeHtml(paragraphs[0])}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f5;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; border-collapse: collapse; background-color: #ffffff; border: 1px solid #eeeff0; font-family: Arial, sans-serif; color: #555559; font-size: 16px; line-height: 26px;">
          <!-- Encabezado -->
          <tr>
            <td align="center" style="padding: 20px; border-bottom: 4px solid #0a8e3d;">
              <a href="${origin}" target="_blank"><img src="${origin}/assets/images/logo.png" width="180" alt="Banco de Alimentos de Zamora" style="display: block; border: 0; width: 180px; max-width: 100%; height: auto;"></a>
            </td>
          </tr>
          <!-- Contenido -->
          <tr>
            <td style="padding: 28px 30px 8px;">
              <h1 style="margin: 0 0 18px; font-size: 26px; line-height: 32px; color: #0a8e3d; text-align: center;">${escapeHtml(heading)}</h1>${text}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 12px 30px 8px;">
              <a href="${button.href}" target="_blank" style="background-color: #ff8300; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; font-size: 16px;">${escapeHtml(button.label)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 30px 24px; font-size: 13px; line-height: 20px; color: #777;">
              ${expiry ? `<p style="margin: 0 0 10px; text-align: center;">${escapeHtml(expiry)}</p>` : ''}
              <p style="margin: 0;">Si el botón no funciona, abre este enlace (o cópialo en tu navegador):<br><a href="${button.href}" target="_blank" style="word-break: break-all; color: #0a8e3d; text-decoration: underline;">${button.href}</a></p>
            </td>
          </tr>
          <!-- Pie -->
          <tr>
            <td style="padding: 20px 30px; background-color: #f8f9fa; border-top: 4px solid #0a8e3d;">
              <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
                <tr>${icons}
                </tr>
              </table>
              <p style="margin: 16px 0 0; text-align: center; font-size: 14px; line-height: 21px; color: #666;">
                <b>Banco de Alimentos de Zamora A. C.</b>${address.map((line) => `<br>${escapeHtml(line)}`).join('')}
              </p>
              <p style="margin: 16px 0 0; text-align: center; font-size: 12px; line-height: 18px; color: #999;">${escapeHtml(notice)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Versión de texto plano (para clientes de correo sin HTML). */
const buildText = ({ heading, paragraphs, button, expiry, notice }) =>
  [heading, '', ...paragraphs, '', `${button.label}: ${button.href}`, expiry || '', '', notice, '', 'Banco de Alimentos de Zamora A. C.']
    .filter((line, index, all) => line !== '' || all[index - 1] !== '').join('\n');

/** Plantilla del panel: recuperar contraseña (variables de Strapi: url, user.firstname). */
function adminResetPassword(siteUrl, site) {
  const content = {
    heading: 'Restablece tu contraseña',
    paragraphs: [
      'Hola <%= user.firstname %>:',
      'Recibimos una solicitud para cambiar la contraseña de tu cuenta del panel de BAMX Zamora. Pulsa el botón para elegir una nueva.',
    ],
    button: { label: 'Restablecer contraseña', href: '<%= url %>' },
    expiry: 'Este enlace vence en 1 hora.',
    notice: 'Si no pediste cambiar tu contraseña, ignora este correo: tu contraseña actual sigue funcionando.',
  };
  // El saludo lleva una variable de Strapi: se restituye tras escapar el texto.
  const html = buildEmail({ siteUrl, site, ...content }).replaceAll('Hola &lt;%= user.firstname %&gt;:', 'Hola <%= user.firstname %>:');
  return { subject: 'Restablece tu contraseña del panel de BAMX Zamora', html, text: buildText(content) };
}

/** Plantillas de "Usuarios y permisos" (variables de Strapi: URL, TOKEN, CODE). */
function usersPermissionsTemplates(siteUrl, site) {
  return {
    reset_password: {
      object: 'Restablece tu contraseña de BAMX Zamora',
      message: buildEmail({
        siteUrl, site,
        heading: 'Restablece tu contraseña',
        paragraphs: ['Recibimos una solicitud para cambiar la contraseña de tu cuenta. Pulsa el botón para elegir una nueva.'],
        button: { label: 'Restablecer contraseña', href: '<%= URL %>?code=<%= TOKEN %>' },
        expiry: '',
        notice: 'Si no pediste cambiar tu contraseña, ignora este correo.',
      }),
    },
    email_confirmation: {
      object: 'Confirma tu correo electrónico',
      message: buildEmail({
        siteUrl, site,
        heading: 'Confirma tu correo electrónico',
        paragraphs: ['¡Gracias por registrarte! Solo falta confirmar que este correo es tuyo.'],
        button: { label: 'Confirmar mi correo', href: '<%= URL %>?confirmation=<%= CODE %>' },
        expiry: '',
        notice: 'Si no creaste una cuenta, ignora este correo.',
      }),
    },
  };
}

/** "BAMX Zamora <no-responder@dominio>" → { name, email }. */
function parseFrom(value) {
  const match = /^\s*(.*?)\s*<([^>]+)>\s*$/.exec(String(value ?? ''));
  return match ? { name: match[1] || 'BAMX Zamora', email: match[2] } : (value ? { name: 'BAMX Zamora', email: String(value).trim() } : null);
}

const DEFAULT_STRAPI_MESSAGES = ['We heard that you lost your password', 'Thank you for registering'];
// Solo se reemplazan las de Strapi o las nuestras; si alguien las editó a mano en el panel, se respetan.
const isReplaceable = (message) => typeof message !== 'string' || message.includes(MARKER) || DEFAULT_STRAPI_MESSAGES.some((text) => message.includes(text));

async function applyEmailTemplates(strapi) {
  const siteUrl = process.env.SITE_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173');
  if (!siteUrl) {
    strapi.log.warn('[email-templates] Falta SITE_URL: los correos siguen con la plantilla de Strapi.');
    return;
  }
  const site = await strapi.documents(SITE_UID).findFirst({ status: 'published', populate: ['socialLinks'] }).catch(() => null);

  strapi.config.set('admin.forgotPassword.emailTemplate', adminResetPassword(siteUrl, site));
  if (process.env.CONTACT_FROM && !strapi.config.get('admin.forgotPassword.from')) {
    strapi.config.set('admin.forgotPassword.from', process.env.CONTACT_FROM);
  }

  const store = strapi.store({ type: 'plugin', name: 'users-permissions', key: 'email' });
  const current = await store.get();
  if (!current) return;
  const from = parseFrom(process.env.CONTACT_FROM);
  const templates = usersPermissionsTemplates(siteUrl, site);
  let changed = false;
  for (const [key, template] of Object.entries(templates)) {
    const options = current[key]?.options;
    if (!options || !isReplaceable(options.message)) continue;
    if (options.message === template.message && options.object === template.object) continue;
    current[key].options = { ...options, ...template, ...(from && options.from?.email === 'no-reply@strapi.io' ? { from } : {}) };
    changed = true;
  }
  if (changed) await store.set({ value: current });
}

/** Al publicar "Datos del sitio", los correos se rehacen con las redes y la dirección nuevas. */
function registerEmailTemplateRefresh(strapi) {
  strapi.documents.use(async (context, next) => {
    const result = await next();
    if (context.uid === SITE_UID && ['publish', 'update', 'unpublish'].includes(context.action)) {
      applyEmailTemplates(strapi).catch((error) => strapi.log.error(`[email-templates] ${error?.message || error}`));
    }
    return result;
  });
}

module.exports = { applyEmailTemplates, registerEmailTemplateRefresh, adminResetPassword, usersPermissionsTemplates, buildEmail, parseFrom, MARKER };
