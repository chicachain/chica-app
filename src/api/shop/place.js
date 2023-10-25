import Axios from '@api/axios';

const API_PLACE = '/api/v1/place';

// const formDataConfig = {
//   headers: {
//     'Content-Type': 'multipart/form-data',
//   },
// };

// 플레이스 리스트 조회
export const getShopList = param => {
  return Axios.get(`${API_PLACE}/shops`, { params: param });
};

// 플레이스 상세 조회
export const getShopDetail = shopId => {
  return Axios.get(`${API_PLACE}/shops/${shopId}`);
};

// 메뉴 리스트 조회
export const getShopMenuList = (shopId, param) => {
  return Axios.get(`${API_PLACE}/shops/menus/${shopId}`, { params: param });
};

// 스텝 리스트 조회
export const getShopStaffList = (shopId, param) => {
  return Axios.get(`${API_PLACE}/shops/staffs/${shopId}`, { params: param });
};

// 리뷰 리스트 조회
export const getShopReviewList = param => {
  return Axios.get(`${API_PLACE}/shops/reviews`, { params: param });
};

export const getShopReviewDetail = feedId => {
  return Axios.get(`${API_PLACE}/shops/reviews/${feedId}`);
};

// 주문 매장 조회
export const getShopAroundList = shopId => {
  return Axios.get(`${API_PLACE}/shops/nearby/${shopId}`);
};

// 메뉴 이미지 리스트 조회
export const getMenuImageList = (shopId, param) => {
  return Axios.get(`${API_PLACE}/shops/menu-images/${shopId}`, {
    params: param,
  });
};

// 리뷰 이미지 리스트 조회
export const getReviewImageList = (shopId, param) => {
  return Axios.get(`${API_PLACE}/shops/review-images/${shopId}`, {
    params: param,
  });
};

// 매장 이벤트 리스트 조회
export const getEventList = param => {
  return Axios.get(`${API_PLACE}/shops/events`, {
    params: param,
  });
};

// 매장 이벤트 상세 조회
export const getEventDetail = eventId => {
  return Axios.get(`${API_PLACE}/shops/events/${eventId}`);
};
