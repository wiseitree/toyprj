import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const setViewCountCookie = (name, value) => {
  const expires = new Date();
  expires.setHours(23, 59, 59, 999);
  return cookies.set(name, value, {path:'/', expires:expires});
}

export const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setUTCDate(expires.getUTCDate() + days);
  return cookies.set(name, value, { path: '/', expires: expires });
};

export const getCookie = (name) => {
  return cookies.get(name);
};

export const removeCookie = (name, path = '/') => {
  cookies.remove(name, { path });
};
