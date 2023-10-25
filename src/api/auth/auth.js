import AXIOS from '@api/axios';

/* ****************************************************** */
// API URL
/* ****************************************************** */

const API_AUTH = '/api/v1/auth';
const API_OAUTH = '/api/v1/oauth';

const LOGIN = `${API_AUTH}/login`;
const JOIN_EMAIL = `${API_AUTH}/join-email`;
const SEND_MAIL_CODE = `${API_AUTH}/cert-email`;
const CONFIRM_MAIL_CODE = `${API_AUTH}/confirm-email`;
const FIND_ID = `${API_AUTH}/find-id`;
const PASSWORD = `${API_AUTH}/password`;
const SNS_LOGIN_URL = `${API_AUTH}/join-sns`;
const SNS_LOGIN = `${API_OAUTH}/code`;

/* ****************************************************** */
// HTTP HEADER
/* ****************************************************** */

//* 첨부 파일이 있을 경우 ( Content-Type > multipart/form-data )
const formDataConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

/* ****************************************************** */
// API CALL
/* ****************************************************** */

export const login = data => {
  return AXIOS.post(`${LOGIN}`, data);
};

export const oauthLogin = (registrationId, code) => {
  return AXIOS.get(`${SNS_LOGIN}/${registrationId}?code=${code}`);
};

export const getSnsLoginUrl = data => {
  return AXIOS.get(`${SNS_LOGIN_URL}/${data}`);
};

export const joinEmail = data => {
  return AXIOS.post(`${JOIN_EMAIL}`, data);
};

export const sendMailCode = data => {
  return AXIOS.post(`${SEND_MAIL_CODE}`, data);
};

export const confirmMailCode = data => {
  return AXIOS.post(`${CONFIRM_MAIL_CODE}`, data);
};

export const findId = data => {
  return AXIOS.post(`${FIND_ID}`, null, {
    headers: {},
    params: { ...data },
  });
};
export const modifyPassword = data => {
  return AXIOS.patch(`${PASSWORD}`, data);
};
