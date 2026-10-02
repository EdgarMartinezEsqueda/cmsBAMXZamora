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

module.exports = () => ({
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
      breakpoints: { small: 640, medium: 1280 },
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
