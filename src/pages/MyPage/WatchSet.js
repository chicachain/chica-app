/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Button, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
import 'swiper/swiper-bundle.css';

// Custom Component
import { Navi } from '@components';
import InfiniteScroll from 'react-infinite-scroll-component';
import utils from '../../common/utils/Utils';
import RouterPath from '../../common/constants/RouterPath';
import SHOP_TYPES from '../../common/constants/ShopTypes';
import { handleError } from '../../common/utils/HandleError';
import {
  getFavoriteCount,
  getFavoriteMenuList,
  removeFavoriteMenu,
} from '../../api/member/favorite';

export default React.memo(function WatchExpert(props) {
  const history = useHistory();
  const [isNextButtonDisabled, setNextButtonDisabled] = useState(true);
  const [activeButton, setActiveButton] = useState('All');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(30);
  const [favCount, setFavCount] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, isFetching] = useState(false);

  const handleButtonClick = buttonKey => {
    setActiveButton(buttonKey);
  };

  const getImageSource = buttonKey => {
    return activeButton === buttonKey
      ? images[`ic${buttonKey}White`]
      : images[`ic${buttonKey}Gray`];
  };

  /**
   * api
   */
  const getFavCount = async () => {
    isFetching(true);
    try {
      const { data } = await getFavoriteCount();
      setFavCount(data.data);
    } catch (error) {
      handleError(error);
    }
    isFetching(false);
  };

  const getSearchResult = async pageNo => {
    isFetching(true);
    try {
      const params = {
        page: pageNo,
        size,
        shopType: activeButton === 'All' ? '' : activeButton,
      };
      const { data } = await getFavoriteMenuList(params);
      setHasMore(!data.data.isLast);
      setSearchResult(searchResult.concat(data.data.list));
      setPage(pageNo);
    } catch (error) {
      handleError(error);
    }
    isFetching(false);
  };

  const removeList = async id => {
    try {
      await removeFavoriteMenu(id);
      window.location.reload();
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * useEffect
   */
  useEffect(() => {
    getFavCount();
  }, []);

  useEffect(() => {
    if (fetching === false) {
      getSearchResult(1);
      setHasMore(true);
    }
  }, [activeButton]);

  const mypage = () => {
    history.push({ pathname: RouterPath.mypage });
  };
  const place = () => {
    history.push({ pathname: RouterPath.watchplace });
  };
  const expert = () => {
    history.push({ pathname: RouterPath.watchexpert });
  };
  const review = () => {
    history.push({ pathname: RouterPath.watchreview });
  };
  const setp = () => {
    history.push({ pathname: RouterPath.watchset });
  };
  return (
    <main id="watch-list">
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons" onClick={mypage}>
              arrow_back
            </i>
            <h6>관심 목록</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom" id="scrollableDiv">
        <div className="tab-menu">
          <Button onClick={place}>
            플레이스{' '}
            <span>{utils.changeNumberComma(favCount.totalShopCnt || '0')}</span>
          </Button>
          <Button onClick={expert}>
            전문가{' '}
            <span>
              {utils.changeNumberComma(favCount.totalStaffCnt || '0')}
            </span>
          </Button>
          <Button onClick={review}>
            리뷰{' '}
            <span>
              {utils.changeNumberComma(favCount.totalReviewCnt || '0')}
            </span>
          </Button>
          <Button className="active" onClick={setp}>
            관리{' '}
            <span>{utils.changeNumberComma(favCount.totalMenuCnt || '0')}</span>
          </Button>
        </div>
        <div className="watch-list-box">
          <div className="menu-flex">
            <Button
              className={activeButton === 'All' ? 'active' : ''}
              variant="outline-primary"
              onClick={() => {
                handleButtonClick('All');
                setPage(1);
                activeButton === 'All' ? '' : setSearchResult([]);
              }}
            >
              <Image src={getImageSource('All')} />
              전체
            </Button>
            {Object.values(SHOP_TYPES).map((item, index) => {
              return (
                item.type && (
                  <Button
                    key={index}
                    className={activeButton === item.type ? 'active' : ''}
                    variant="outline-primary"
                    onClick={() => {
                      handleButtonClick(item.type);
                      setPage(1);
                      activeButton === item.type ? '' : setSearchResult([]);
                    }}
                    disabled={item.type !== 'Waxing'}
                  >
                    <Image src={getImageSource(item.type)} />
                    {item.name}
                  </Button>
                )
              );
            })}
          </div>
          <div className="watch-set-line">
            <InfiniteScroll
              dataLength={searchResult.length}
              next={() => {
                getSearchResult(page + 1);
              }}
              hasMore={hasMore && !fetching}
              scrollableTarget="scrollableDiv"
            >
              {searchResult &&
                searchResult.length > 0 &&
                searchResult.map((result, index) => (
                  <div className="menu-box" key={index}>
                    <Image className="item-box" src={result.fileUrl} />
                    <div className="menu-fontbox">
                      <div>
                        <p className="place-text">{result.shopNm}</p>
                        <p className="menu-title">{result.menuNm}</p>
                        <p className="menu-sale">
                          {utils.changeNumberComma(
                            result.price - result.price * result.saleRate ||
                              '0',
                          )}
                          원{' '}
                          {result.saleRate > 0 ? (
                            <>
                              <span className="cost">
                                {utils.changeNumberComma(result.price || '0')}원
                              </span>
                              <span className="discount">
                                {result.saleRate * 100}%할인
                              </span>
                            </>
                          ) : (
                            ''
                          )}
                        </p>
                      </div>
                      <Image
                        src={images.IcTrashWatch}
                        className="trash"
                        onClick={() => {
                          if (
                            window.confirm('관심 목록에서 삭제하시겠습니까?')
                          ) {
                            removeList(result.shopMenuId);
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
            </InfiniteScroll>
          </div>
        </div>
      </Container>
    </main>
  );
});
