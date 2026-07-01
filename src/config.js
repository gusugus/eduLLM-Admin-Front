const url = import.meta.env.VITE_GATEWAY_URL;
export const GATEWAY = url !== undefined ? url : 'http://localhost:8085';
