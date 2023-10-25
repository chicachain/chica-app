import Axios from '@api/axios';

const API_FEEDS = '/api/v1/feeds';

const formDataConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

// 게시글 리스트 조회
export const getFeedList = param => {
  return Axios.get(`${API_FEEDS}`, { params: param });
};

// 게시글 상세 조회
export const getFeedDetail = feedId => {
  return Axios.get(`${API_FEEDS}/${feedId}`);
};

// 게시글 등록
export const saveFeed = param => {
  return Axios.post(`${API_FEEDS}`, param, formDataConfig);
};

// 게시글 수정
export const modifyFeed = param => {
  return Axios.put(`${API_FEEDS}`, param, formDataConfig);
};

// 게시글 삭제
export const removeFeed = feedId => {
  return Axios.delete(`${API_FEEDS}/${feedId}`);
};

// 리뷰 등록
export const saveReview = param => {
  return Axios.post(`${API_FEEDS}/review`, param, formDataConfig);
};

// 게시글 댓글 조회
export const getCommentList = param => {
  return Axios.get(`${API_FEEDS}/comments`, { params: param });
};

// 게시글 댓글 등록
export const saveComment = param => {
  return Axios.post(`${API_FEEDS}/comments`, param);
};

// 게시글 댓글 수정
export const modifyComment = param => {
  return Axios.put(`${API_FEEDS}/comments`, param);
};

// 게시글 댓글 삭제
export const removeComment = commentId => {
  return Axios.delete(`${API_FEEDS}/comments/${commentId}`);
};

// 공감하기 등록
export const saveLiked = feedId => {
  return Axios.post(`${API_FEEDS}/liked/${feedId}`);
};
