import Axios from '@api/axios';

const API_HOME = '/api/v1/home';

// const formDataConfig = {
//   headers: {
//     'Content-Type': 'multipart/form-data',
//   },
// };

// 메인 화면 플레이스 및 게시글 조회
export const getShopListByRecommend = shopCategory => {
  return Axios.get(`${API_HOME}/shops-recommend/${shopCategory}`);
};

// 주변 플레이스 조회
export const getShopListByLocation = param => {
  return Axios.get(`${API_HOME}/shops-location`, { params: param });
};

// 예약 가능한 플레이스 조회
export const getShopListByReservation = param => {
  return Axios.get(`${API_HOME}/shops-reservation`, { params: param });
};

// 뷰티 플레이스, 전문가 검색
export const searchShop = param => {
  return Axios.get(`${API_HOME}/search`, { params: param });
};
