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
import RouterPath from '../../common/constants/RouterPath';
import GENDER from '../../common/constants/Gender';

// ===================================================================
// [ 회원가입 약관 ]
// ===================================================================
export default React.memo(function KeywordGender(props) {
  // ===================================================================
  // [ State ]
  // ===================================================================
  const history = useHistory();
  const state = history.location.state || {};
  const [isNextButtonDisabled, setNextButtonDisabled] = useState(true);
  const [gender, setGender] = useState();

  const handleGenderButtonClick = sex => {
    setGender(sex);
    setNextButtonDisabled(false);
  };
  const nextmenu = skip => {
    history.push({
      pathname: RouterPath.keywordMenu,
      state: {
        ...state,
        gender: skip ? '' : gender,
      },
    });
  };
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
            <span>성별</span>을 알려주세요.
          </p>
          <div className="gender-box">
            <Button
              className={gender === GENDER.FEMALE ? 'active' : ''}
              variant="outline-primary"
              onClick={() => {
                handleGenderButtonClick(GENDER.FEMALE);
              }}
            >
              <i className="material-icons">female</i>여성
            </Button>
            <Button
              className={gender === GENDER.MALE ? 'active' : ''}
              variant="outline-primary"
              onClick={() => {
                handleGenderButtonClick(GENDER.MALE);
              }}
            >
              <i className="material-icons">male</i>남성
            </Button>
            <Button
              className={gender === GENDER.NOTHING ? 'active' : ''}
              variant="outline-primary"
              onClick={() => {
                handleGenderButtonClick(GENDER.NOTHING);
              }}
            >
              <i className="material-icons">block</i>선택안함
            </Button>
          </div>
        </Form>
        {/* 다음 */}
        <div className="next-box">
          <div className="next-bar">
            <div className="nextbar-stap" />
          </div>
        </div>
        <div className="btn-area fix-bottom grid-btn">
          <Button
            variant="outline-primary"
            className="keyword-jumpbtn"
            onClick={() => {
              nextmenu(true);
            }}
          >
            건너뛰기
          </Button>
          <Button
            style={{ marginTop: '0' }}
            className="keyword-nextbtn"
            disabled={isNextButtonDisabled}
            onClick={() => {
              nextmenu();
            }}
          >
            다음 →
          </Button>
        </div>
      </Container>
    </main>
  );
});
