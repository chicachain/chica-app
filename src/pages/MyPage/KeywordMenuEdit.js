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
import { handleError } from '../../common/utils/HandleError';
import { getFavKeywords } from '../../api/common/common';
import RouterPath from '../../common/constants/RouterPath';

// ===================================================================
// [ 회원가입 약관 ]
// ===================================================================
export default React.memo(function KeywordMenu(props) {
  /**
   * state
   */
  const history = useHistory();
  const [isNextButtonDisabled, setNextButtonDisabled] = useState(true);
  const [keywordId, setKeywordId] = useState(null);
  const [keyword, setKeyword] = useState();
  const [favKeywords, setFavKeywords] = useState([]);

  /**
   * api
   */

  const getFavKeyword = async () => {
    try {
      const { data } = await getFavKeywords();
      setFavKeywords(data.data);
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * event
   */

  const handleButtonClick = buttonKey => {
    setKeywordId(keywordId === buttonKey ? null : buttonKey);
  };

  const getImageSource = (buttonKey, iconNm) => {
    return keywordId === buttonKey
      ? images[`${iconNm}White`]
      : images[`${iconNm}`];
  };

  const partpage = (e, skip) => {
    history.push({
      pathname: RouterPath.keywordPartEdit,
      state: {
        keywordId: skip ? '' : keywordId,
        keyword,
      },
    });
  };

  /**
   * useEffect
   */
  useEffect(() => {
    const handleOutsideClick = event => {
      if (!event.target.closest('.menu-flex')) {
        setKeywordId(null);
      }
    };

    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (keywordId) {
      setNextButtonDisabled(false);
    } else {
      setNextButtonDisabled(true);
    }
  }, [keywordId]);

  useEffect(() => {
    getFavKeyword();
  }, []);

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
            <span>관심있는 키워드</span>를 <br />
            알려주세요.
          </p>
          <div className="menu-flex">
            {favKeywords &&
              favKeywords.length > 0 &&
              favKeywords.map((item, index) => {
                return (
                  <Button
                    key={`${index}`}
                    className={keywordId === item.keywordId ? 'active' : ''}
                    variant="outline-primary"
                    onClick={() => {
                      handleButtonClick(item.keywordId, item.keyword);
                      setKeyword(item.keyword);
                    }}
                    disabled={String(item.keywordId) !== '1'}
                  >
                    <Image src={getImageSource(item.keywordId, item.iconNm)} />
                    {item.keyword}
                  </Button>
                );
              })}
          </div>
        </Form>
        <div className="btn-area fix-bottom grid-btn">
          <Button
            style={{ marginTop: '0', width: 'inherit' }}
            className="keyword-nextbtn"
            disabled={isNextButtonDisabled}
            onClick={e => {
              partpage(e);
            }}
          >
            다음 →
          </Button>
        </div>
      </Container>
    </main>
  );
});
