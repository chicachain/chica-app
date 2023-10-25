/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-danger */
/* eslint-disable no-plusplus */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/alt-text */
// eslint-disable-next-line prettier/prettier
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button, Modal, Image } from 'react-bootstrap';

// Custom Component
import { Header, HtmlModal } from '@components';
import { images } from '@assets';
import classNames from 'classnames';
import { handleError } from '../../common/utils/HandleError';
import { getFavKeywordsDetail } from '../../api/common/common';
import { initUserInfo } from '../../api/member/userInfo';
import RouterPath from '../../common/constants/RouterPath';

// ===================================================================
// [ 회원가입 약관 ]
// ===================================================================
export default React.memo(function KeywordPart(props) {
  const history = useHistory();

  /**
   * state
   */
  const state = history.location.state || {};
  const [isNextButtonDisabled, setNextButtonDisabled] = useState(true);
  const [favKeywordDetailList, setFavKeywordDetailList] = useState([]);
  const [selectedKeywordIds, setSelectedKeywordIds] = useState({});

  /**
   * api
   */
  const getKeywordPart = async () => {
    try {
      const { data } = await getFavKeywordsDetail(state.keywordId);
      setFavKeywordDetailList(data.data);
    } catch (error) {
      handleError(error);
    }
  };

  const sendKeyword = async (e, skip) => {
    const { target } = e;
    target.disabled = true;
    try {
      const keywordIds = [];
      if (selectedKeywordIds && Object.keys(selectedKeywordIds).length > 0) {
        for (const key of Object.keys(selectedKeywordIds)) {
          keywordIds.push(...selectedKeywordIds[key]);
        }
      }

      const params = {
        mbId: state.mbId,
        nickname: state.nickname,
        gender: state.gender,
        keywordList: skip
          ? [state.keywordId]
          : [state.keywordId, ...keywordIds],
      };

      const formData = new FormData();
      const json = JSON.stringify(params);
      const blob = new Blob([json], { type: 'application/json' });
      formData.append('dto', blob);
      formData.append('file', state.profileImage);

      const { data } = await initUserInfo(formData);
      history.push(RouterPath.place);
    } catch (error) {
      handleError(error);
    }
    target.disabled = false;
  };

  /**
   * event
   */
  const selectKeywordId = (parentKeywordId, childKeywordId) => {
    // 아이템이 하나도 없을 경우 리스트 생성
    if (!selectedKeywordIds[parentKeywordId]) {
      setSelectedKeywordIds({
        ...selectedKeywordIds,
        [parentKeywordId]: [childKeywordId],
      });
    } else {
      const finded = selectedKeywordIds[parentKeywordId].find(
        item => item === childKeywordId,
      );
      // 이미 있는 아이템인 경우 제거
      if (finded) {
        const filterList = selectedKeywordIds[parentKeywordId].filter(
          id => id !== childKeywordId,
        );
        setSelectedKeywordIds({
          ...selectedKeywordIds,
          [parentKeywordId]: filterList,
        });
      } else {
        // 클릭한 아이템 아이템 추가
        setSelectedKeywordIds({
          ...selectedKeywordIds,
          [parentKeywordId]: [
            ...selectedKeywordIds[parentKeywordId],
            childKeywordId,
          ],
        });
      }
    }
  };

  const activeCheck = childKeywordId => {
    if (selectedKeywordIds) {
      const isExists = Object.keys(selectedKeywordIds).find(key => {
        return selectedKeywordIds[key].includes(childKeywordId);
      });
      return !!isExists;
    }
    return false;
  };
  const nextButtonDisableCheck = () => {
    if (!selectedKeywordIds) setNextButtonDisabled(true);
    if (Object.keys(selectedKeywordIds).length > 0) {
      let count = 0;
      for (const key of Object.keys(selectedKeywordIds)) {
        count += selectedKeywordIds[key].length;
      }
      if (count === 0) {
        setNextButtonDisabled(true);
      } else {
        setNextButtonDisabled(false);
      }
    } else {
      setNextButtonDisabled(true);
    }
  };

  /**
   * useEffect
   */
  useEffect(() => {
    getKeywordPart();
  }, []);
  useEffect(() => {
    nextButtonDisableCheck();
  }, [selectedKeywordIds]);

  return (
    <main id="keyword">
      {/* 헤더 */}
      <Header />

      {/* 컨텐츠 */}
      <Container className="container-between ">
        {/* 약관 목록 */}
        <Form className="scroll" style={{ paddingTop: '16px' }}>
          <p className="keyword-title">
            회원님의 <br />
            <span>{state.keyword}방법과</span> <br />
            <span>시술하고싶은 부위</span>를
            <br />
            알려주세요.
          </p>
          {favKeywordDetailList &&
            favKeywordDetailList.length > 0 &&
            favKeywordDetailList.map((item, index) => {
              return (
                <div
                  key={`${index}`}
                  className={classNames({
                    'method-box': true,
                    'mt-3': index > 0,
                  })}
                >
                  <p className="method-title">{item.keyword.keyword}</p>
                  <div className="method-line">
                    {item.child &&
                      item.child.length > 0 &&
                      item.child.map((child, i) => (
                        <Button
                          key={i}
                          className={
                            activeCheck(child.keywordId) ? 'active' : ''
                          }
                          variant="outline-primary"
                          onClick={() => {
                            selectKeywordId(
                              item.keyword.keywordId,
                              child.keywordId,
                            );
                          }}
                        >
                          {child.keyword}
                        </Button>
                      ))}
                  </div>
                </div>
              );
            })}
        </Form>
        {/* 다음 */}
        <div className="next-box">
          <div className="next-bar">
            <div className="nextbar-stap step3" />
          </div>
        </div>
        <div className="btn-area fix-bottom grid-btn">
          <Button
            variant="outline-primary"
            className="keyword-jumpbtn"
            onClick={e => {
              sendKeyword(e, true);
            }}
          >
            건너뛰기
          </Button>
          <Button
            style={{ marginTop: '0' }}
            className="keyword-nextbtn"
            disabled={isNextButtonDisabled}
            onClick={e => {
              sendKeyword(e);
            }}
          >
            다음 →
          </Button>
        </div>
      </Container>
    </main>
  );
});
