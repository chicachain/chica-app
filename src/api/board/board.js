import Axios from '@api/axios';

const API_HOME = '/api/v1/board';

// const formDataConfig = {
//   headers: {
//     'Content-Type': 'multipart/form-data',
//   },
// };

// 자주 묻는 질문 리스트 조회
export const getQnAList = param => {
  return Axios.get(`${API_HOME}/qnas`, { params: param });
};

// 공지사항 리스트 조회
export const getNoticeList = param => {
  return Axios.get(`${API_HOME}/notices`, { params: param });
};

// 공지사항 상세 조회
export const getNoticeDetail = noticeId => {
  return Axios.get(`${API_HOME}/notices/${noticeId}`);
};
