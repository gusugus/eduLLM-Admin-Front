const envUrl = import.meta.env.VITE_GATEWAY_URL;

let GATEWAY;
if (!envUrl || envUrl === '') {
  GATEWAY = '';
} else {
  try {
    const parsed = new URL(envUrl);
    const isLocalBackend = ['localhost', '127.0.0.1'].includes(parsed.hostname);
    const isLocalDev = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (isLocalBackend && !isLocalDev) {
      GATEWAY = '';
    } else {
      GATEWAY = envUrl;
    }
  } catch {
    GATEWAY = '';
  }
}

export { GATEWAY };
