import axios from 'axios';
import { API_SERVER_HOST } from './todoApi';

const host = `${API_SERVER_HOST}/api/member`;

export const loginPost = async (loginParam) => {
  const header = { headers: { 'Content-Type': 'x-www-form-urlencoded' } };

  const form = new FormData();
  form.append('username', loginParam.email);
  form.append('password', loginParam.pw);

  const res = await axios.post(`${host}/login`, form, header);

  return res.data;
};

export const postRegister = async (registerParam) => {
  const res = await axios.post(`${host}/register`, registerParam);

  return res.data;
};

export const checkDuplicate = async (currentData) => {
  const encodedCurrentData = encodeURIComponent(currentData);
  const header = { headers: { CurrentData: encodedCurrentData } };
  const res = await axios.get(`${host}/check`, header);

  return res.data;
};

export const getMember = async (currentEmail) => {
  const header = { headers: { CurrentData: currentEmail } };
  const res = await axios.get(`${host}/`, header);

  return res.data;
};
