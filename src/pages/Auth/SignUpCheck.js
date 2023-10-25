/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-danger */
/* eslint-disable no-plusplus */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/alt-text */
// eslint-disable-next-line prettier/prettier
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button, Modal, Image } from 'react-bootstrap';
import { Header } from '@components';
import { getTerms } from '../../api/common/common';
import { joinEmail } from '../../api/auth/auth';
import { UserInfoContext } from '../../router/UserInfoContext';
import RouterPath from '../../common/constants/RouterPath';
import { handleError } from '../../common/utils/HandleError';
import TERM_TYPE from '../../common/constants/TermTypes';

// ===================================================================
// [ 회원가입 약관 ]
// ===================================================================
export default React.memo(function SignUpCheck(props) {
  // ===================================================================
  // [ state ]
  // ===================================================================
  const history = useHistory();
  const state = history.location.state || {};
  const [userInfo, setUserInfo] = useState({ ...state });
  const [modalShow, setModalShow] = useState(false);
  const [agreements, setAgreements] = useState([]);
  const [termsTitle, setTermsTitle] = useState();
  const [termsContents, setTermsContents] = useState();
  const [allAgreementsSelected, setAllAgreementsSelected] = useState(false);
  const [reqAgreementsSelected, setReqAgreementsSelected] = useState(false);
  const [termTypes, setTermTypes] = useState(Object.values(TERM_TYPE));

  // ===================================================================
  // [ util ]
  // ===================================================================
  const modalOpen = type => {
    const selectedAgreement = agreements.find(
      agreement => agreement.termsType === type,
    );
    setTermsTitle(selectedAgreement.termsTitle);
    setTermsContents(selectedAgreement.fileUrl);
    setModalShow(true);
  };

  const modalClose = () => {
    setModalShow(false);
  };

  const areAllRequiredChecked = () => {
    return termTypes
      .filter(agreement => agreement.required)
      .every(agreement => agreement.selected);
  };

  const handleCheckboxChange = type => {
    const updatedAgreements = termTypes.map(agreement =>
      agreement.type === type
        ? { ...agreement, selected: !agreement.selected }
        : agreement,
    );

    setTermTypes(updatedAgreements);
  };

  const setAllAgreementsTo = value => {
    const updatedAgreements = termTypes.map(agreement => ({
      ...agreement,
      selected: value,
    }));
    setTermTypes(updatedAgreements);
  };

  // ===================================================================
  // [ useEffect ]
  // ===================================================================

  useEffect(async () => {
    const { data } = await getTerms();

    const initialAgreements = data.data.map(agreement => ({
      ...agreement,
      termsTitle: TERM_TYPE[agreement.termsType].name,
    }));

    setAgreements(initialAgreements);
  }, []);

  useEffect(() => {
    const areAllSelected = termTypes.every(agreement => agreement.selected);
    setAllAgreementsSelected(areAllSelected);
    setReqAgreementsSelected(areAllRequiredChecked());

    const updatedUserInfo = { ...userInfo };

    termTypes.forEach(agreement => {
      switch (agreement.type) {
        case TERM_TYPE.TERMS_SERVICE.type:
          updatedUserInfo.termServiceYn = agreement.selected ? 'Y' : 'N';
          break;
        case TERM_TYPE.TERMS_PRIVATE.type:
          updatedUserInfo.termPrivateYn = agreement.selected ? 'Y' : 'N';
          break;
        case TERM_TYPE.TERMS_LOCATE.type:
          updatedUserInfo.termLocateYn = agreement.selected ? 'Y' : 'N';
          break;
        case TERM_TYPE.TERMS_OPENSOURCE.type:
          updatedUserInfo.termOpensourceYn = agreement.selected ? 'Y' : 'N';
          break;
        case TERM_TYPE.TERMS_AD.type:
          updatedUserInfo.termAdYn = agreement.selected ? 'Y' : 'N';
          break;
        default:
          break;
      }
    });
    setUserInfo(updatedUserInfo);
  }, [termTypes]);

  useEffect(() => {
    if (allAgreementsSelected) {
      setAllAgreementsTo(true);
    }
  }, [allAgreementsSelected]);

  // ===================================================================
  // [ api ] 회원가입 완료
  // ===================================================================
  const completeJoin = async () => {
    try {
      const { data } = await joinEmail(userInfo);
      localStorage.setItem('access_token', data.data.accessToken);
      localStorage.setItem('refresh_token', data.data.refreshToken);
      localStorage.setItem('mb_id', data.data.mbId);

      history.push({ pathname: RouterPath.keywordProp });
    } catch (error) {
      handleError(error);
    }
  };
  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <main id="sign-up">
      {/* 헤더 */}
      <Header title="회원가입" />

      {/* 컨텐츠 */}
      <Container className="container-between ">
        {/* 약관 목록 */}
        <Form className="scroll" style={{ marginTop: '40px' }}>
          <p className="id-check-title">
            <span style={{ fontWeight: '500' }}>약관 및 정책</span>에<br />{' '}
            동의해주세요.
          </p>
          <p className="auth-text">
            회원가입을 위해서는 필수 약관 동의가 필요합니다.
          </p>
          <div className="checkpoint-box">
            <div className="checkpoint-title">
              <p className="check-title">약관 및 정책</p>
              <p
                className="allagress"
                onClick={() => setAllAgreementsSelected(!allAgreementsSelected)}
              >
                모두 선택
              </p>
            </div>
            {termTypes.map(term => (
              <div key={term.type} className="check-line">
                <Form.Check
                  type="checkbox"
                  id={term.type}
                  label={
                    term.required
                      ? `${term.name} (필수)`
                      : `${term.name} (선택)`
                  }
                  checked={term.selected}
                  onChange={() => handleCheckboxChange(term.type)}
                />
                <p className="more" onClick={() => modalOpen(term.type)}>
                  더 보기
                </p>
              </div>
            ))}
          </div>
        </Form>
        {/* 다음 */}
        <div className="btn-area fix-bottom auth-btnarea">
          <Button
            className="w-100"
            disabled={!reqAgreementsSelected}
            onClick={completeJoin}
          >
            다음
          </Button>
        </div>
        <Modal
          size="sm"
          show={modalShow}
          onHide={() => setModalShow(false)}
          aria-labelledby="example-modal-sizes-title-sm"
          id="terms-modal"
        >
          <Modal.Header>
            <p>{termsTitle}</p>
          </Modal.Header>
          <Modal.Body>
            <div className="w-100 h-100">
              {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
              <iframe src={termsContents} width="100%" height="100%" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-primary"
              className="w-100"
              onClick={modalClose}
            >
              취소
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </main>
  );
});
