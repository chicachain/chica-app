import Axios from '@api/axios';

const API_COMPLAIN = '/api/v1/complain';

const formDataConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

// 게시글 신고
export const complainFeed = param => {
  return Axios.post(`${API_COMPLAIN}/feed`, param, formDataConfig);
};

// 작성자 신고
export const complainMember = param => {
  return Axios.post(`${API_COMPLAIN}/member`, param, formDataConfig);
};

// 댓글 신고
export const complainComment = param => {
  return Axios.post(`${API_COMPLAIN}/comment`, param, formDataConfig);
};
