import jwtAxios from '../util/jwtUtil';

export const API_SERVER_HOST = 'http://localhost:8080';

export const postRegisterComment = async (comment) => {
    const res = await jwtAxios.post(`${API_SERVER_HOST}/api/comment/`, comment);

    return res.data;
}

export const getCommentList = async (bno) => {
    const res = await jwtAxios.get(`${API_SERVER_HOST}/api/board/${bno}/comments`);
    return res.data;
}

export const putModifyComment = async (cno, comment, currentEmail) => {
    const header = {headers: {CurrentData: currentEmail}};
    const res = await jwtAxios.put(`${API_SERVER_HOST}/api/comment/${cno}`, comment, header);
    return res.data;
}