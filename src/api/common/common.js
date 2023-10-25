import AXIOS from '@api/axios';

/* ****************************************************** */
// API URL
/* ****************************************************** */

const API_COMMON = '/api/v1/common';

const TERMS = `${API_COMMON}/terms`;
const FAV_KEYWORDS = `${API_COMMON}/fav-keywords`;
const COMPLAIN_TYPES = `${API_COMMON}/complain-types`;

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

export const getTerms = data => {
  return AXIOS.get(`${TERMS}`, { params: data });
};

export const getTerm = data => {
  return AXIOS.get(`${TERMS}/${data}`);
};

// 관심 키워드(분야) 조회
export const getFavKeywords = () => {
  return AXIOS.get(`${FAV_KEYWORDS}`);
};

// 관심 키워드(상세) 조회
export const getFavKeywordsDetail = parentIdx => {
  return AXIOS.get(`${FAV_KEYWORDS}/${parentIdx}`);
};

// 신고 사유 리스트 조회
export const getComplainTypes = () => {
  return AXIOS.get(`${COMPLAIN_TYPES}`);
};
