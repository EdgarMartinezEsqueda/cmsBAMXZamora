const number = new Intl.NumberFormat('es-MX');

/** 10000 → "10,000" */
export const formatNumber = (value) => number.format(value);

/** 10000 → "10,000+" */
export const formatPlus = (value) => `${number.format(value)}+`;

/** Kilos a toneladas completas: 70124 → 70 */
export const toTonnes = (kg) => Math.floor(kg / 1000);

/** "https://linktr.ee/bamx" → "linktr.ee/bamx", para mostrar un enlace sin el protocolo. */
export const displayUrl = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

/** Redondea a miles hacia abajo para no inflar la cifra: 70124 → "70,000+" */
export const formatThousandsPlus = (value) => formatPlus(Math.floor(value / 1000) * 1000);
