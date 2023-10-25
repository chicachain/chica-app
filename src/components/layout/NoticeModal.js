/* eslint-disable react/no-array-index-key */
/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Button, ListGroup, Figure, Ratio } from 'react-bootstrap';
import { images } from '@assets';
import { Header } from '@components';
import { css } from '@emotion/react';
import classNames from 'classnames';
import Moment from 'react-moment';
import { useTranslation } from 'react-i18next';

function NoticeModal({ onHide, ...rest }) {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  // const [data, setData] = useState(dummyNotices);
  const [data, setData] = useState([]);

  return (
    <Modal size="fullscreen" css={modal} show>
      {/* <Header title="알림" onClickBtn={onHide} isCloseBtn /> */}
      <Header title={t('notice')} onClickBtn={onHide} isCloseBtn />
      <Modal.Body>
        <div className="btn-area justify-content-end">
          {/* <Button variant="text">모두 삭제</Button> */}
          <Button variant="text">{t('deleteAll')}</Button>
          {/* <Button */}
          {/*  variant="text" */}
          {/*  onClick={() => history.push('/mypage/noticeSetting')} */}
          {/* > */}
          {/*  /!*알림설정*!/ */}
          {/*  {t('setNotice')} */}
          {/* </Button> */}
        </div>
        <div className="scroll">
          {data.length > 0 ? (
            <ListGroup as="ul">
              {data.map((item, index) => {
                return (
                  <ListGroup.Item as="li" key={`notice-${index}`}>
                    <Figure>
                      <Ratio aspectRatio="1x1">
                        <div
                          className="img-box"
                          style={{
                            backgroundImage: item.img
                              ? `url(${item.img})`
                              : 'none',
                          }}
                        />
                      </Ratio>
                      <Figure.Caption>
                        <div className="flex-between">
                          <h6>{item.title}</h6>
                          <small>
                            <Moment
                              date={item.date}
                              format="YYYY.MM.DD hh:mm"
                              interval={0}
                            />
                          </small>
                        </div>
                        <p>{item.msg}</p>
                      </Figure.Caption>
                    </Figure>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          ) : (
            <div className="container-center">
              {/* <p className="no-data">알림이 없습니다.</p> */}
              <p className="no-data">{t('noNotice')}</p>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
const modal = css`
  .modal-body {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .btn-area {
      padding: 0 1.25rem 1.25rem;
      justify-content: space-between;
      margin: 1rem 0 0;
      flex-shrink: 0;
    }
    ul {
      padding: 0 1.25rem;
      li {
        margin-bottom: 1rem;
        padding: 1rem;
        background: var(--bs-bg-gray);
        border-radius: 0.75rem !important;
        figure {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          .ratio {
            width: 4.5rem;
            .img-box {
              border-radius: 0.5rem;
              &.coin-send {
                background: var(--bs-gray) url(${images.CoinSend}) no-repeat
                  center / 32px auto !important;
              }
              &.coin-receive {
                background: var(--bs-gray) url('${images.CoinReceive}')
                  no-repeat center / 32px auto !important;
              }
            }
          }
          figcaption {
            padding-left: 1rem;
            flex: 1;
            h6 {
              margin: 0;
              font-weight: 400;
              text-overflow: ellipsis;
              white-space: nowrap;
              word-wrap: normal;
              overflow: hidden;
              width: 50%;
            }
            small {
              font-size: var(--fs-10);
            }
            p {
              margin-top: 0.5rem;
              font-size: var(--fs-12);
              color: var(--bs-gray-700);
              display: block;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
              -webkit-line-clamp: 2;
              word-break: break-all;
            }
          }
        }
      }
    }
  }
`;

const dummyNotices = [
  {
    type: 'vote',
    title: '투표 마감',
    img: images.Visual01,
    date: new Date(),
    msg: '여름 휴가 때 가장 기대되는 드라마에 투표해주세요. 여름 휴가 때 가장 기대되는 드라마에 투표해주세요.',
  },
  {
    type: 'vote',
    title: '투표 마감',
    img: images.Visual01,
    date: new Date(),
    msg: '여름 휴가 때 가장 기대되는 드라마에 투표해주세요. 여름 휴가 때 가장 기대되는 드라마에 투표해주세요.',
  },
  {
    type: 'vote',
    title: '투표 마감',
    img: images.Visual01,
    date: new Date(),
    msg: '여름 휴가 때 가장 기대되는 드라마에 투표해주세요. 여름 휴가 때 가장 기대되는 드라마에 투표해주세요.',
  },
  {
    type: 'vote',
    title: '투표 마감',
    img: images.Visual01,
    date: new Date(),
    msg: '여름 휴가 때 가장 기대되는 드라마에 투표해주세요. 여름 휴가 때 가장 기대되는 드라마에 투표해주세요.',
  },
];

export default NoticeModal;
