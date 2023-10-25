/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Image, Modal } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
// Custom Component
import { Navi, MainHeader, CustomModal } from '@components';
import 'swiper/swiper-bundle.css';

import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Utils from '@common/utils/Utils';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getShopMenuList } from '../../api/shop/place';
import { handleError } from '../../common/utils/HandleError';
// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);

// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function SkinMenu(props) {
  const history = useHistory();
  const { shopId } = useParams();
  const [isSelected, setIsSelected] = useState(null);
  const [selectShop, setSelectShop] = useState();
  const [selectPrice, setSelectPrice] = useState(0);
  const [selectMenu, setSelectMenu] = useState();
  const [selectMenuId, setSelectMenuId] = useState();
  const [menuList, setMenuList] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(30);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, isFetching] = useState(false);
  const location = useLocation();

  const menuChangeHandler = (menuId, price, saleRate, menuNm, shopNm) => {
    setIsSelected(menuId);
    setSelectPrice(price - price * saleRate);
    setSelectMenu(menuNm);
    setSelectShop(shopNm);
    setSelectMenuId(menuId);
  };

  const dayselect = () => {
    history.push({
      pathname: `/reservation/day/${shopId}`,
      state: {
        staff: location.state.staff,
        staffID: location.state.staffID,
        shop: selectShop,
        price: selectPrice,
        menu: selectMenu,
        menuID: selectMenuId,
      },
    });
  };

  const getMenuList = async pageNo => {
    isFetching(true);
    try {
      const params = {
        page: pageNo,
        size,
      };
      const { data } = await getShopMenuList(shopId, params);
      setHasMore(!data.data.isLast);
      setMenuList(menuList.concat(data.data.list));
      setPage(pageNo);
    } catch (error) {
      handleError(error);
    }
    isFetching(false);
  };

  useEffect(() => {
    if (fetching === false) {
      getMenuList(page);
      setHasMore(true);
    }
  }, [page]);
  return (
    <main id="skinmenu">
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons" onClick={() => history.goBack()}>
              arrow_back
            </i>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom" id="scrollableDiv">
        <div style={{ padding: '0rem 1rem 1rem 1rem' }}>
          <div className="menu-line">
            <InfiniteScroll
              dataLength={menuList.length}
              next={() => {
                setPage(page + 1);
              }}
              hasMore={hasMore && !fetching}
              scrollableTarget="scrollableDiv"
            >
              {menuList &&
                menuList.length > 0 &&
                menuList.map(menuItem => (
                  <div
                    className="menu-box"
                    key={menuItem.shopMenuId}
                    onClick={() => {
                      menuChangeHandler(
                        menuItem.shopMenuId,
                        menuItem.price,
                        menuItem.saleRate,
                        menuItem.menuNm,
                        menuItem.shopNm,
                      );
                    }}
                  >
                    <div className="select-designer">
                      <Image
                        src={menuItem.fileUrl}
                        className={`image ${
                          isSelected === menuItem.shopMenuId ? 'selected' : ''
                        }`}
                      />
                      <Form.Check
                        type="radio"
                        id="default-radio"
                        name="skinmenu"
                        checked={isSelected === menuItem.shopMenuId}
                        readOnly
                      />
                    </div>
                    <div className="menu-fontbox">
                      <p className="menu-title">{menuItem.menuNm}</p>
                      <p className="menu-sale">
                        {menuItem.price - menuItem.price * menuItem.saleRate}{' '}
                        <span className="cost">{menuItem.price}</span>
                        <span className="discount">
                          {menuItem.saleRate * 100}%할인
                        </span>
                      </p>
                      <div className="daybox">
                        <p className="menu-time">{menuItem.summary}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </InfiniteScroll>
          </div>
        </div>
      </Container>
      <div className="btn-area fix-bottom place-footerbtn">
        <div className="flex-pay">
          <p className="all-acount">
            총 결제금액{' '}
            <span className="pay">
              {Utils.changeNumberComma(`${selectPrice}` || 0)}
            </span>{' '}
            원
          </p>
          <Button onClick={() => dayselect()} disabled={isSelected === null}>
            다음 →
          </Button>
        </div>
      </div>
      {/* 푸터 */}
    </main>
  );
});
