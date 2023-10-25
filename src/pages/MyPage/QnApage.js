/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Button, Image, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
import 'swiper/swiper-bundle.css';

// Custom Component
import { Navi } from '@components';
import { getQnAList } from '../../api/board/board';
import { handleError } from '../../common/utils/HandleError';

export default React.memo(function QnApage(props) {
  const history = useHistory();
  const [searchResults, setSearchResult] = useState([]);
  const [size, setSize] = useState(30);
  const [page, setPage] = useState(1);
  const [isMore, setIsMore] = useState(true);
  const [expandQNA, setExpandQNA] = useState(null);

  const toggleExpand = index => {
    if (index === expandQNA) {
      setExpandQNA(null);
    } else {
      setExpandQNA(index);
    }
  };

  const QNA_TYPES = {
    all: {
      type: '',
      name: '전체',
    },
    policy: {
      type: 'QNA_POLICY',
      name: '이용정책',
    },
    general: {
      type: 'QNA_GENERAL',
      name: '공통',
    },
    reservation: {
      type: 'QNA_RESERVATION',
      name: '예약주문',
    },
    join: {
      type: 'QNA_JOIN',
      name: '회원가입',
    },
  };
  const [selectType, setSelectType] = useState(QNA_TYPES.all.type);

  const getQnA = async pageNo => {
    try {
      const params = {
        qnaType: selectType,
        size,
        page: pageNo,
      };
      const { data } = await getQnAList(params);
      setIsMore(data.data.isLast);
      setSearchResult(searchResults.concat(data.data.list));
      setPage(pageNo + 1);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    getQnA(page);
  }, [selectType]);
  return (
    <main id="qna">
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons" onClick={() => history.goBack()}>
              arrow_back
            </i>
            <h6>도움말</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="top-title">
          <h6>자주 묻는 질문</h6>
          <div className="top-selectbox">
            {Object.keys(QNA_TYPES).map((key, index) => (
              <Button
                key={key}
                className={selectType === QNA_TYPES[key].type ? 'active' : ''}
                onClick={() => {
                  setSelectType(QNA_TYPES[key].type);
                  setPage(1);
                  setSearchResult([]);
                }}
              >
                {QNA_TYPES[key].name}
              </Button>
            ))}
          </div>
        </div>
        <div className="qna-box">
          {searchResults &&
            searchResults.length > 0 &&
            searchResults.map((result, index) => (
              <div className="qna-grid">
                <div className="qna-line" onClick={() => toggleExpand(index)}>
                  <div className="qna-flex">
                    <p className="qna-title">{result.qnaTypeNm}</p>
                    <p>{result.question}</p>
                  </div>
                  <i
                    className={`material-icons toggle-icon ${
                      expandQNA === index ? 'expanded' : ''
                    }`}
                  >
                    {expandQNA === index ? 'expand_less' : 'expand_more'}
                  </i>
                </div>
                {expandQNA === index && (
                  <div className="less-box">
                    <p className="edit-day">최종 수정일: {result.regDate}</p>
                    <p className="less-body pre-line">{result.answer}</p>
                  </div>
                )}
              </div>
            ))}
          {!isMore && (
            <div className="add-on-box">
              <Button onClick={() => getQnA(page)}>
                더보기<i className="material-icons">add</i>
              </Button>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
});
