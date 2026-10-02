// URL pública, nunca un token. En producción se usa el mismo origen detrás de Nginx.
export const CMS_URL = (import.meta.env.VITE_CMS_URL || (import.meta.env.DEV ? 'http://127.0.0.1:1337' : '')).replace(/\/$/, '');

