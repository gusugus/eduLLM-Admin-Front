import { GATEWAY } from '../config';

export const getLoginUrl = () => {
  return import.meta.env.VITE_LOGIN_URL || `${GATEWAY}/login`;
};

export const redirectToLogin = () => {
  window.location.href = getLoginUrl();
};