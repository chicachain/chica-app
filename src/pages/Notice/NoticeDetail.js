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
import { Navi } from '@components';

// Custom Component
import { getNoticeDetail } from '../../api/board/board';
import { handleError } from '../../common/utils/HandleError';

const initialNoticeDetail = {
  noticeId: '',
  noticeType: '',
  noticeTypeNm: '',
  title: '',
  contents: '',
  regDate: '',
  updDate: '',
  bannerUrl: '',
  bannerNm: '',
  files: [],
  writer: '',
};

export default React.memo(function NoticeDetail(props) {
  const history = useHistory();
  const noticeId = history.location.state || {};

  const [noticeDetail, setNoticeDetail] = useState(initialNoticeDetail);

  const getNoticeInfo = async id => {
    try {
      const { data } = await getNoticeDetail(id);
      if (data.code === 200) {
        setNoticeDetail(data.data);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (!noticeId) {
      history.go(-1);
    } else {
      getNoticeInfo(noticeId);
    }
  }, []);

  return (
    <main id="notice-detail">
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
        <div className="top-line-box">
          <div className="top-flex">
            <p>{noticeDetail.regDate.slice(0, 10)}</p>
            <div className="center-line" />
            <p>{noticeDetail.writer}</p>
            <div className="center-line" />
            <p>{noticeDetail.noticeTypeNm}</p>
          </div>
          <h6 className="no-title">{noticeDetail.title}</h6>
        </div>
        {noticeDetail.bannerUrl ? (
          <div className="banner-box">
            <Image src={noticeDetail.bannerUrl} />
          </div>
        ) : (
          ''
        )}
        <div className="wr-body">
          <p className="body-text pre-line">{noticeDetail.contents}</p>
        </div>
      </Container>
      <div
        className="btn-area fix-bottom"
        style={{ padding: '1rem', marginTop: '1rem' }}
      >
        <Button variant="outline-primary" onClick={() => history.goBack()}>
          목록보기
        </Button>
      </div>
    </main>
  );
});
