import jwtAxios from '../util/jwtUtil';
import axios from "axios";

export const API_SERVER_HOST = 'http://localhost:8080';
const host = `${API_SERVER_HOST}/api/board`;

export const getOne = async (bno) => {
  const res = await jwtAxios.get(`${host}/${bno}`);

  return res.data;
};

export const getList = async (pageParam, searchParam) => {
  const { page, size } = pageParam;
  const { title, content, keyword } = searchParam;
  const res = await axios.get(`${host}/list`, {
    params: {
      page: page,
      size: size,
      title: title,
      content: content,
      keyword: keyword,
    },
  });

  return res.data;
};

export const postAdd = async (boardFormData) => {
  const header = {headers: {"Content-Type": "multipart/form-data"}}

  const res = await jwtAxios.post(`${host}/`, boardFormData, header);
  return res.data;
};

export const putOne = async (bno, boardFormData, currentEmail) => {
  const header = { headers: { CurrentData: currentEmail,
      "Content-Type": "multipart/form-data"} };
  const res = await jwtAxios.put(`${host}/${bno}`, boardFormData, header);
  return res.data;
};

export const deleteOne = async (bno, currentEmail) => {
  const header = { headers: { CurrentData: currentEmail } };
  const res = await jwtAxios.delete(`${host}/${bno}`, header);
  return res.data;
};

export const downloadOne = async (fileName) => {
  const res = await jwtAxios.get(`${host}/download`, {
    params:{
      fileName: fileName,
    },
    responseType:'blob',
  });
  return res;
}
