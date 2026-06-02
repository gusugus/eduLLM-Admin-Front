// Logger simple para frontend (console + opcional envío a backend)
const isDev = import.meta.env.DEV;

export const logger = {
  info: (...args) => { if (isDev) console.log('[INFO]', ...args); },
  error: (...args) => { console.error('[ERROR]', ...args); },
  warn: (...args) => { if (isDev) console.warn('[WARN]', ...args); },
};