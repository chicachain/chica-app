/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import 'swiper/swiper-bundle.css';

// Custom Component
import { Navi } from '@components';
import { getTerm } from '../../api/common/common';
import TERM_TYPE from '../../common/constants/TermTypes';
import { handleError } from '../../common/utils/HandleError';

export default React.memo(function License(props) {
  const history = useHistory();
  const [term, setTerm] = useState();

  const terms = async () => {
    try {
      const { data } = await getTerm(TERM_TYPE.TERMS_PRIVATE.type);
      setTerm(data.data[0].fileUrl);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    terms();
  }, []);
  return (
    <main id="terms">
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons" onClick={() => history.goBack()}>
              arrow_back
            </i>
            <h6>개인정보 처리방침</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="w-100 h-100" style={{ padding: '16px' }}>
          {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
          <iframe src={term} width="100%" height="100%" />
        </div>
      </Container>
    </main>
  );
});
