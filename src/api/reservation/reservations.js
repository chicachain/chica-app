import Axios from '@api/axios';

const API_RESERVATIONS = '/api/v1/reservations';

// const formDataConfig = {
//   headers: {
//     'Content-Type': 'multipart/form-data',
//   },
// };

// 예약하기
export const saveReservation = param => {
  return Axios.post(`${API_RESERVATIONS}`, param);
};

// 예약 확정
export const confirmReservation = param => {
  return Axios.post(`${API_RESERVATIONS}/confirm`, param);
};

// 예약 실패
export const errorReservation = param => {
  return Axios.post(`${API_RESERVATIONS}/error`, param);
};

// 예약 취소
export const cancelReservation = resvId => {
  return Axios.patch(`${API_RESERVATIONS}/${resvId}`);
};

// 예약 데이터 조회
export const getReservationDataByCategory = shopCategoy => {
  return Axios.get(`${API_RESERVATIONS}/info/${shopCategoy}`);
};

// 예약 내역 리스트 조회
export const getReservationList = param => {
  return Axios.get(`${API_RESERVATIONS}`, { params: param });
};

// 예약 내역 상세 조회
export const getReservationDetail = resvId => {
  return Axios.get(`${API_RESERVATIONS}/${resvId}`);
};

// 다시 예약
export const modifyReservation = resvId => {
  return Axios.post(`${API_RESERVATIONS}/${resvId}`);
};

// 예약 내역 삭제
export const removeReservation = resvId => {
  return Axios.delete(`${API_RESERVATIONS}/${resvId}`);
};

// 이용 완료된 예약 리스트 조회
export const completeReservation = () => {
  return Axios.get(`${API_RESERVATIONS}/for-review`);
};

// 매장별 예약 가능 시간 조회
export const getReservationTimeTable = shopId => {
  return Axios.get(`${API_RESERVATIONS}/time-table/${shopId}`);
};

// 예약 관련 코드관리 조회
export const getReservationConfig = () => {
  return Axios.get(`${API_RESERVATIONS}/config`);
};
