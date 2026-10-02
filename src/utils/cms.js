// Permiso de vista previa que el panel pone en la dirección (?preview=). No es una credencial del
// usuario: caduca en una hora y solo deja leer el borrador de lo que se está editando.
const previewParam = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('preview');
export const PREVIEW_TOKEN = previewParam && /^[\w-]+\.[\w-]+$/.test(previewParam) ? previewParam : null;

// URL pública, nunca un token. En producción se usa el mismo origen detrás de Nginx.
export const CMS_URL = (import.meta.env.VITE_CMS_URL || (import.meta.env.DEV ? 'http://127.0.0.1:1337' : '')).replace(/\/$/, '');

