'use strict';
// El parser común limita JSON a 1 MB; contacto aplica además 16 KB antes del controlador.
module.exports = () => (ctx, next) => {
  if (ctx.path === '/api/contact' && ctx.method === 'POST') {
    if (!ctx.is('application/json')) ctx.throw(415, 'Se requiere JSON.');
    const raw = ctx.request.body?.[Symbol.for('unparsedBody')];
    const length = raw !== undefined ? Buffer.byteLength(raw) : Buffer.byteLength(JSON.stringify(ctx.request.body || {}));
    if (length > 16 * 1024) ctx.throw(413, 'Solicitud demasiado grande.');
  }
  return next();
};
