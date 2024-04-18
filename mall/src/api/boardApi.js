import jwtAxios from '../util/jwtUtil';

export const API_SERVER_HOST = 'http://localhost:8080';
const prefix = `${API_SERVER_HOST}/api/board`;

export const getOne = async (bno) => {
  let url = `${prefix}/${bno}`;
  const res = await jwtAxios.get(url);

  return res.data;
};

export const getList = async (pageParam, searchParam) => {
  const { page, size } = pageParam;
  const { title, content, keyword } = searchParam;
  const res = await jwtAxios.get(`${prefix}/list`, {
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

export const postAdd = async (boardObj) => {
  const res = await jwtAxios.post(`${prefix}/`, boardObj);
  return res.data;
};

export const deleteOne = async (bno, currentEmail) => {
  const header = { headers: { CurrentData: currentEmail } };
  const res = await jwtAxios.delete(`${prefix}/${bno}`, header);
  return res.data;
};

export const putOne = async (board, currentEmail) => {
  const header = { headers: { CurrentData: currentEmail } };
  const res = await jwtAxios.put(`${prefix}/${board.bno}`, board, header);
  return res.data;
};
