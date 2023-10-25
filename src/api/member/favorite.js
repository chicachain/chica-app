import Axios from '@api/axios';

const API_FAVORITE = '/api/v1/favorite';

// const formDataConfig = {
//   headers: {
//     'Content-Type': 'multipart/form-data',
//   },
// };

// 관심 목록 카운트 조회
export const getFavoriteCount = () => {
  return Axios.get(`${API_FAVORITE}/count`);
};

// 관심 플레이스 리스트 조회
export const getFavoriteShopList = param => {
  return Axios.get(`${API_FAVORITE}/shops`, { params: param });
};

// 관심 플레이스 등록
export const saveFavoriteShop = shopId => {
  return Axios.post(`${API_FAVORITE}/shops/${shopId}`);
};

// 관심 플레이스 취소
export const removeFavoriteShop = shopId => {
  return Axios.delete(`${API_FAVORITE}/shops/${shopId}`);
};

// 관심 전문가 리스트 조회
export const getFavoriteStaffList = param => {
  return Axios.get(`${API_FAVORITE}/staffs`, { params: param });
};

// 관심 전문가 등록
export const saveFavoriteStaff = staffId => {
  return Axios.post(`${API_FAVORITE}/staffs/${staffId}`);
};

// 관심 전문가 취소
export const removeFavoriteStaff = staffId => {
  return Axios.delete(`${API_FAVORITE}/staffs/${staffId}`);
};

// 관심 리뷰 리스트 조회
export const getFavoriteFeedList = param => {
  return Axios.get(`${API_FAVORITE}/feeds`, { params: param });
};

// 관심 리뷰 등록
export const saveFavoriteFeed = feedId => {
  return Axios.post(`${API_FAVORITE}/feeds/${feedId}`);
};

// 관심 리뷰 취소
export const removeFavoriteFeed = feedId => {
  return Axios.delete(`${API_FAVORITE}/feeds/${feedId}`);
};

// 관심 메뉴 리스트 조회
export const getFavoriteMenuList = param => {
  return Axios.get(`${API_FAVORITE}/menus`, { params: param });
};

// 관심 메뉴 등록
export const saveFavoriteMenu = shopMenuId => {
  return Axios.post(`${API_FAVORITE}/menus/${shopMenuId}`);
};

// 관심 메뉴 취소
export const removeFavoriteMenu = shopMenuId => {
  return Axios.delete(`${API_FAVORITE}/menus/${shopMenuId}`);
};
