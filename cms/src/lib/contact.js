'use strict';
const { z } = require('zod');
const { Resend } = require('resend');

const schema = z.object({
  nombre: z.string().trim().min(1).max(120), correo: z.string().trim().email().max(200),
  mensaje: z.string().trim().min(10).max(2000), website: z.string().max(200).optional(),
  captchaToken: z.string().max(2048).optional(),
}).strict();
const recipientsSchema = z.array(z.string().email()).min(1).max(10);
const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const reply = (status, error) => ({ status, body: { error } });

exports.createContactHandler = ({ env = process.env, getSettings, sendEmail, fetchImpl = globalThis.fetch, now = Date.now }) => {
  const hits = new Map();
  const windowMs = 600000;
  let resend;
  return async ({ body, ip }) => {
    const time = now();
    for (const [key, entry] of hits) if (entry.expires <= time) hits.delete(key);
    if (!hits.has(ip)) {
      if (hits.size >= 10000) return reply(429, 'Intenta de nuevo más tarde.');
      hits.set(ip, { count: 0, expires: time + windowMs });
    }
    const entry = hits.get(ip);
    entry.count = Math.min(6, entry.count + 1);
    if (entry.count > 5) return { ...reply(429, 'Has enviado demasiados mensajes. Intenta más tarde.'), retryAfter: Math.ceil((entry.expires - time) / 1000) };
    const parsed = schema.safeParse(body);
    if (!parsed.success) return reply(400, 'Datos del formulario inválidos.');
    const { nombre, correo, mensaje, website, captchaToken } = parsed.data;
    if (website?.trim()) return { status: 200, body: { ok: true } };
    if (!env.RESEND_API_KEY || !env.CONTACT_FROM || (env.NODE_ENV === 'production' && !env.TURNSTILE_SECRET_KEY)) return reply(503, 'El servicio de contacto no está configurado.');

    if (env.TURNSTILE_SECRET_KEY) {
      if (!captchaToken) return reply(400, 'Completa la verificación anti-bots.');
      try {
        const response = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: captchaToken, remoteip: ip || '' }),
          signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) return reply(502, 'La verificación no está disponible.');
        const result = await response.json();
        if (!result.success || result.action !== 'contact' || (env.TURNSTILE_HOSTNAME && result.hostname !== env.TURNSTILE_HOSTNAME)) return reply(400, 'La verificación anti-bots no es válida.');
      } catch { return reply(502, 'La verificación no está disponible.'); }
    }
    let settings;
    try { settings = await getSettings(); } catch { return reply(503, 'El servicio de contacto no está disponible.'); }
    const recipients = recipientsSchema.safeParse(settings?.recipients?.map((item) => item.email));
    if (!settings?.enabled || !recipients.success) return reply(503, 'El servicio de contacto no está disponible.');
    try {
      const message = {
        from: env.CONTACT_FROM, to: [...new Set(recipients.data)], replyTo: correo,
        subject: `Nuevo mensaje de contacto — ${nombre.replace(/[\r\n]/g, ' ')}`,
        text: `Nombre: ${nombre}\nCorreo: ${correo}\n\nMensaje:\n${mensaje}`,
        html: `<h2>Nuevo mensaje de contacto</h2><p>Nombre: ${escapeHtml(nombre)}</p><p>Correo: ${escapeHtml(correo)}</p><p style="white-space:pre-wrap">${escapeHtml(mensaje)}</p>`,
      };
      if (!sendEmail && !resend) resend = new Resend(env.RESEND_API_KEY);
      const result = await (sendEmail ? sendEmail(message) : resend.emails.send(message));
      if (result?.error || !result?.data?.id) return reply(502, 'No se pudo enviar el mensaje. Intenta de nuevo más tarde.');
      return { status: 200, body: { ok: true } };
    } catch { return reply(502, 'No se pudo enviar el mensaje. Intenta de nuevo más tarde.'); }
  };
};
