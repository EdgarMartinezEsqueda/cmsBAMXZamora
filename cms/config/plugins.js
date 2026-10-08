const allowedMediaTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const deniedTypes = [
  'image/svg+xml',
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

module.exports = ({ env }) => ({
  // Correo del panel (recuperar contraseña) por el SMTP de Resend: la misma cuenta y remitente
  // del formulario de contacto. Sin RESEND_API_KEY no se envía nada (queda en el log).
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
  'users-permissions': {
    config: {
      jwtManagement: 'refresh',
      sessions: {
        httpOnly: true,
      },
    },
  },
  upload: {
    config: {
      sizeLimit: 15 * 1024 * 1024,
      // Versiones reducidas de cada foto; el sitio usa estas y no el original (shared/content/core.js).
      breakpoints: { small: 640, medium: 1280, large: 1920 },
      sharp: { cache: false, concurrency: 1 },
      concurrentUploadRequests: 1,
      concurrentUploadSize: 1,
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes,
      },
    },
  },
});
