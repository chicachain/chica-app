import Axios from '@api/axios';

const API_USER_INFO = '/api/v1/user-info';

const formDataConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

// 회원 관심 키워드 및 프로필 등록
export const initUserInfo = param => {
  return Axios.post(`${API_USER_INFO}/init-data`, param, formDataConfig);
};

// 내 정보 조회
export const getMyInfo = () => {
  return Axios.get(`${API_USER_INFO}`);
};

// 내 정보 수정
export const modifyMyInfo = param => {
  return Axios.put(`${API_USER_INFO}`, param, formDataConfig);
};

// 비밀번호 변경
export const modifyPassword = param => {
  return Axios.patch(`${API_USER_INFO}/password`, param);
};

// 관심 키워드 수정
export const modifyFavKeyword = param => {
  return Axios.put(`${API_USER_INFO}/keyword`, param);
};

// 내 보유 포인트 조회
export const getMyPoint = () => {
  return Axios.get(`${API_USER_INFO}/my-point`);
};

// 탈퇴하기
export const removeAccount = () => {
  return Axios.delete(`${API_USER_INFO}`);
};

// 지갑주소 등록
export const modifyWallet = param => {
  return Axios.put(`${API_USER_INFO}/wallet`, param);
};
