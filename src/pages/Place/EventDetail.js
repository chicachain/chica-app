/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Image } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
// Custom Component
import 'swiper/swiper-bundle.css';
import classNames from 'classnames';
import Moment from 'react-moment';
import { handleError } from '../../common/utils/HandleError';
import { getEventDetail } from '../../api/shop/place';
import PROGRESS_STATUS from '../../common/constants/ProgressStatuses';

// ===================================================================ㅇ
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function EventDetail(props) {
  const history = useHistory();
  const state = history.location.state || {};
  const { eventId } = useParams();
  /**
   * state
   */
  const [eventDetail, setEventDetail] = useState({});

  /**
   * api
   */
  const getEventDetailInfo = async () => {
    try {
      const { data } = await getEventDetail(eventId);
      setEventDetail(data.data);
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * useEffect
   */
  useEffect(() => {
    getEventDetailInfo();
  }, []);

  return (
    <main id="event-detail">
      <header>
        <Container>
          <div className="header-flex">
            <i
              className="material-icons"
              onClick={() => {
                history.goBack();
              }}
            >
              arrow_back
            </i>
            <h6>{state.shopNm}</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="event-reviewbox">
          {eventDetail.fileUrl && (
            <div className="img-event-box">
              <Image src={eventDetail.fileUrl} className="detailmain-img" />
            </div>
          )}
          <div className="info-fontbox">
            {eventDetail.status && (
              <span
                className={classNames('label', {
                  way:
                    PROGRESS_STATUS[eventDetail.status].type ===
                    PROGRESS_STATUS.PROGRESS.type,
                  end:
                    PROGRESS_STATUS[eventDetail.status].type ===
                    PROGRESS_STATUS.COMPLETE.type,
                })}
              >
                진행중
              </span>
            )}
            <p className="menu-title">{eventDetail.eventNm}</p>
            <div className="day-date-box">
              <p className="day">기간</p>
              <p className="daytime">
                {eventDetail.startDate && (
                  <Moment
                    date={eventDetail.startDate}
                    format="YYYY.MM.DD"
                    interval={0}
                  />
                )}{' '}
                ~{' '}
                {eventDetail.endDate && (
                  <Moment
                    date={eventDetail.endDate}
                    format="YYYY.MM.DD"
                    interval={0}
                  />
                )}
              </p>
            </div>
            <p className="fontbox-body">{eventDetail.contents}</p>
          </div>
        </div>
      </Container>
    </main>
  );
});
