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
import { getNoticeList } from '../../api/board/board';
import { handleError } from '../../common/utils/HandleError';
import RouterPath from '../../common/constants/RouterPath';

export default React.memo(function Notice(props) {
  const history = useHistory();

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(30);
  const [searchResults, setSearchResults] = useState([]);
  const [isMore, setIsMore] = useState(true);
  const [fetching, isFetching] = useState(false);

  const goNoticeDetail = noticeId => {
    history.push({
      pathname: `${RouterPath.noticedetail}/${noticeId}`,
      state: noticeId,
    });
  };

  /**
   * api
   */
  const getSearchResult = async PageNo => {
    isFetching(true);
    try {
      const params = {
        page: PageNo,
        size,
      };
      const { data } = await getNoticeList(params);
      setIsMore(data.data.isLast);
      setSearchResults(searchResults.concat(data.data.list));
      setPage(page + 1);
    } catch (error) {
      handleError(error);
    }
    isFetching(false);
  };

  /**
   * useEffect
   */
  useEffect(() => {
    if (fetching === false) {
      getSearchResult(1);
    }
  }, []);

  return (
    <main id="notice">
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons" onClick={() => history.goBack()}>
              arrow_back
            </i>
            <h6>공지사항</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="qna-box" style={{ paddingTop: 0 }}>
          {searchResults &&
            searchResults.length > 0 &&
            searchResults.map((result, index) => (
              <div
                className="qna-grid"
                key={index}
                onClick={() => {
                  goNoticeDetail(result.noticeId);
                }}
              >
                <div className="qna-line">
                  <div className="qna-flex">
                    <p className="qna-title">{result.noticeTypeNm}</p>
                    <p className="notice-title">{result.title}</p>
                  </div>
                  <i className="material-icons">arrow_forward_ios</i>
                </div>
              </div>
            ))}
          {!isMore && (
            <div className="add-on-box">
              <Button onClick={() => getSearchResult(page)}>
                더보기<i className="material-icons">add</i>
              </Button>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
});
