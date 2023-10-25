/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Form, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
import 'swiper/swiper-bundle.css';

// API
import {
  complainFeed,
  complainMember,
  complainComment,
} from '@api/community/complain';

// Custom Component
import { CustomSelect } from '@components';
import { handleError } from '../../common/utils/HandleError';

// Constant
import EMAIL_CHECK_TYPES from '../../common/constants/ComplainTypes';
import { getComplainTypes } from '../../api/common/common';

// 초기 신고 파라미터
const initialComplainState = {
  type: '',
  idx: '',
  url: '',
};

// ===================================================================
// [ 커뮤니티 > 신고하기 ]
// ===================================================================
export default React.memo(function Report(props) {
  const history = useHistory();

  const complainState = history.location.state || initialComplainState; // 신고 개요 ( type, idx, url )
  complainState.url = `${
    window.location.origin
  }/complain/${complainState.type.toLowerCase()}/${complainState.idx}`;

  const fileInputRef = useRef(); // 첨부파일 input

  // ===================================================================
  // [ State ]
  // ===================================================================

  // 신고 개요 ( type, idx, url )
  const [complainParam, setComplainParam] = useState(complainState);

  // 신고 사유 ( { value, label })
  const [complainReasons, setComplainReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState();

  // 요청사항
  const [memo, setMemo] = useState('');

  // 첨부파일
  const [file, setFile] = useState();

  // 약관 체크박스
  const [checkExpain, setCheckExpain] = useState(false);
  const [checkPrivateTerm, setCheckPrivateTerm] = useState(false);

  // ===================================================================
  // [ Util ]
  // ===================================================================

  // 신고사유 선택
  const reasonSelectHandler = data => {
    console.log('data', data);
    setSelectedReason({
      value: data.value,
      label: data.label,
    });
  };

  // 첨부파일 입력
  const handleFileChange = event => {
    const reportFile = event.target.files[0];
    if (reportFile) {
      setFile(reportFile);
      // eslint-disable-next-line no-param-reassign
      event.target.value = null;
    }
  };

  // ===================================================================
  // [ API ] 신고하기
  // ===================================================================

  const getComplainTypeList = async () => {
    try {
      const { data } = await getComplainTypes();
      const complainTypes = data.data.map(item => {
        return { value: item.reasonCode, label: item.reason };
      });
      setComplainReasons(complainTypes);
    } catch (error) {
      handleError(error);
    }
  };
  const postComplain = async e => {
    const { target } = e;
    target.disabled = true;

    try {
      // JSON 파라미터
      const params = {
        complainType: complainParam.type,
        url: complainParam.url,
        reason: selectedReason.value,
        memo,
      };
      const json = JSON.stringify(params);
      const blob = new Blob([json], { type: 'application/json' });

      // FormData
      const formData = new FormData();
      formData.append('dto', blob);
      formData.append('file', file);

      let response;

      // API 분기처리 ( 피드, 리뷰어, 댓글 )
      switch (complainParam.type) {
        case EMAIL_CHECK_TYPES.FEED.type:
          response = await complainFeed(formData);
          break;
        case EMAIL_CHECK_TYPES.MEMBER.type:
          response = await complainMember(formData);
          break;
        case EMAIL_CHECK_TYPES.COMMENT.type:
          response = await complainComment(formData);
          break;
        default:
          break;
      }

      // 성공
      if (response?.data?.code === 200) {
        history.go(-1);
      }
    } catch (error) {
      handleError(error);
    }
    target.disabled = false;
  };

  // ===================================================================
  // [ useEffect ]
  // ===================================================================

  // 잘못된 접근
  useEffect(() => {
    if (!complainState.idx && !complainState.type && !complainState.url) {
      history.go(-1);
    } else {
      getComplainTypeList();
    }
  }, []);

  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <main id="report">
      {/* 헤더 */}
      <header>
        <Container>
          <div className="header-flex">
            <h6>신고하기</h6>
            <i
              className="material-icons"
              onClick={() => {
                history.goBack();
              }}
            >
              close
            </i>
          </div>
        </Container>
      </header>

      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="report-div">
          {/* 안내문구 (1) */}
          <div className="reportbox">
            <div className="report-target">
              <p className="title">신고 대상</p>
              <p className="report-add-title">타인을 모욕, 명예훼손하는 내용</p>
              <p className="report-add-title">개인정보를 침해하는 내용</p>
              <p className="report-add-title">
                차별, 음란, 범죄 등 불건전한 내용
              </p>
              <p className="report-add-title">타사 광고 홍보 목적의 내용</p>
            </div>
            <div className="report-title">
              <p className="title">신고 처리</p>
              <p className="report-add-title">
                이용정책 규정에 위반되는 활동이 확인되면 리뷰/게시글 삭제 및
                게시글 열람을 제한하며 서비스 이용의 제한 또는 정지됩니다.
              </p>
            </div>
          </div>

          {/* 신고 내용 입력 */}
          <div className="report-reason">
            {/* 신고대상 URL */}
            <Form.Group>
              <Form.Label>
                신고대상 URL <span>*</span>
              </Form.Label>
              <Form.Control
                placeholder="chicachain.sale"
                defaultValue={complainParam.url}
                type="text"
                disabled
              />
            </Form.Group>

            {/* 신고사유 - 드랍다운 */}
            <Form.Group>
              <Form.Label>
                신고 사유 <span>*</span>
              </Form.Label>
              <CustomSelect
                options={complainReasons}
                selectedValue={selectedReason}
                onSelect={reasonSelectHandler}
                className="select-report"
                placeholder="신고 사유를 선택해주세요."
              />
            </Form.Group>

            {/* 요청사항 */}
            <Form.Group className="mt-3">
              <Form.Label>
                요청 사항 <span>*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="요청사항을 입력해주세요"
                value={memo}
                onChange={e => {
                  setMemo(e.target.value);
                }}
              />
            </Form.Group>
          </div>

          {/* 파일첨부 */}
          <div className="file-box">
            <p className="file-lable">파일첨부</p>
            <div className="file-btnbox">
              <Button
                variant="outline-primary"
                onClick={() => {
                  fileInputRef?.current.click();
                }}
                disabled={file}
              >
                파일선택
              </Button>
              <p className="file-text">
                {file?.name}
                {file && (
                  <Image
                    src={images.IcTrashFile}
                    onClick={() => {
                      setFile(null);
                    }}
                  />
                )}
              </p>
              <Form.Control
                className="d-none"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* 안내문구 (2) */}
          <div
            className="reportbox"
            style={{ marginTop: '2rem', marginBottom: '1rem' }}
          >
            <div className="report-target" style={{ marginBottom: '0' }}>
              <p className="title">신고 접수 전 먼저 확인해 주세요!</p>
              <p className="report-add-title">
                파일이 두개 이상일 경우 압축하여 첨부해 주세요.
              </p>
              <p className="report-add-title">
                정보가 부족한 경우 검토 및 처리에 도움드리기 어렵습니다.
              </p>
            </div>
          </div>

          {/* 체크박스 (1) - 안내 */}
          <div className="report-url mb-3">
            <div className="agress-box">
              <p className="terms">
                안내 <span>*</span>
              </p>
              <div className="checked-box ">
                <Form.Check
                  type="checkbox"
                  id="agress2-checkbox"
                  label="위 신고대상 및 처리에 대한 안내를 모두
                    확인하셨나요?"
                  checked={checkExpain}
                  onChange={e => {
                    setCheckExpain(e.target.checked);
                  }}
                />
              </div>
            </div>
          </div>

          {/* 체크박스 (2) - 개인정보 수집 */}
          <div className="report-agress">
            <Form.Label>
              개인정보 수집 동의 <span>*</span>
            </Form.Label>
            <p className="agress-body">
              수집하는 개인정보 항목 : 아이디,이메일 주소 개인정보는 문의 접수,
              고객 불편 사항 확인 및 처리 결과 회신에 이용되며 관련 법령에 따라
              3년간 보관됩니다. 이용자는 본 동의를 거부 할 수 있으나, 미동의시
              문의 접수가 불가능합니다.
            </p>
            <div className="checked-box mt-3">
              <Form.Check
                type="checkbox"
                id="agress4-checkbox"
                label="동의합니다."
                checked={checkPrivateTerm}
                onChange={e => {
                  setCheckPrivateTerm(e.target.checked);
                }}
              />
            </div>
          </div>
        </div>
      </Container>
      <div className="btn-area fix-bottom place-footerbtn">
        <Button
          disabled={
            !(checkExpain && checkPrivateTerm && memo && selectedReason?.value)
          }
          onClick={e => {
            if (window.confirm('신고하시겠습니까?')) {
              postComplain(e);
            }
          }}
        >
          신고하기
        </Button>
      </div>
    </main>
  );
});
