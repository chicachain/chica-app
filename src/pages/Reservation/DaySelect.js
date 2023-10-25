/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Image, Modal } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
// Custom Component
import { Navi, MainHeader, CustomModal } from '@components';
import 'swiper/swiper-bundle.css';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { format } from 'date-fns';
import Utils from '@common/utils/Utils';
import classNames from 'classnames';
import WeeklyCalendar from '../../components/WeekCalander';
import { getReservationTimeTable } from '../../api/reservation/reservations';
import { handleError } from '../../common/utils/HandleError';

// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);

// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function DaySelect(props) {
  const history = useHistory();
  const location = useLocation();
  const { shopId } = useParams();
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState(now);
  const [timeTable, setTimeTable] = useState([]);
  const [bookedList, setBookedList] = useState([]);
  const [week, setWeek] = useState(now.getDay());
  const [selectTime, setSelectTime] = useState(null);
  const [selectDate, setSelectDate] = useState();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const payment = () => {
    history.push({
      pathname: `/reservation/payment`,
      state: {
        shop: location.state.shop,
        shopID: shopId,
        staff: location.state.staff,
        staffID: location.state.staffID,
        price: location.state.price,
        menu: location.state.menu,
        menuID: location.state.menuID,
        date: selectDate,
        time: selectTime,
        day: week,
      },
    });
  };

  const getTimeTable = async () => {
    try {
      const { data } = await getReservationTimeTable(shopId);
      for (let i = 0; i < data.data.bookedList.length; i += 1) {
        if (data.data.bookedList[i].canBooking === false) {
          setBookedList(bookedList.concat(data.data.bookedList[i].resvDate));
        }
      }
      setTimeTable(data.data.schedules);
    } catch (error) {
      handleError(error);
    }
  };

  const getWeek = day => {
    if (day === 0) {
      setWeek(6);
    } else {
      setWeek(day - 1);
    }
  };

  useEffect(() => {
    getTimeTable();
  }, []);
  useEffect(() => {
    const day = new Date(format(selectedDate, 'yyyy-MM-dd'));
    getWeek(day.getDay());
  }, [selectedDate]);
  useEffect(() => {
    const day = new Date(format(selectedDate, 'yyyy-MM-dd'));
    day.setTime(
      day.getTime() +
        ((selectTime === 20 ? selectTime - 1 : selectTime) - 9) *
          60 *
          60 *
          1000 +
        (selectTime === 20 ? 30 : 0) * 60 * 1000,
    );
    setSelectDate(day);
  }, [selectTime]);
  return (
    <main id="dayselect">
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons" onClick={() => history.goBack()}>
              arrow_back
            </i>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div>
          <div className="select-daytitle">
            <h6>날짜 선택</h6>
          </div>
          <WeeklyCalendar
            date={now}
            minDate={now}
            // maxDate={new Date('2023-09-24')}
            disableDate={bookedList}
            onSelect={date => {
              setSelectedDate(date);
            }}
          />
          <div
            className={classNames('timebox', {
              active: selectedDate !== 0,
            })}
          >
            <h6>시간 선택</h6>
            <div className="time-selectbox">
              <Button
                variant="outline-primary"
                disabled={
                  timeTable[week]?.time10 === 'N' ||
                  (hours >= 10 &&
                    format(selectedDate, 'yyyy-MM-dd') ===
                      format(now, 'yyyy-MM-dd'))
                }
                onClick={() => setSelectTime(10)}
              >
                10:00
              </Button>
              <Button
                variant="outline-primary"
                disabled={
                  timeTable[week]?.time11 === 'N' ||
                  (hours >= 11 &&
                    format(selectedDate, 'yyyy-MM-dd') ===
                      format(now, 'yyyy-MM-dd'))
                }
                onClick={() => setSelectTime(11)}
              >
                11:00
              </Button>
              <Button
                variant="outline-primary"
                disabled={
                  timeTable[week]?.time12 === 'N' ||
                  (hours >= 12 &&
                    format(selectedDate, 'yyyy-MM-dd') ===
                      format(now, 'yyyy-MM-dd'))
                }
                onClick={() => setSelectTime(12)}
              >
                12:00
              </Button>
              <Button
                variant="outline-primary"
                disabled={
                  timeTable[week]?.time14 === 'N' ||
                  (hours >= 14 &&
                    format(selectedDate, 'yyyy-MM-dd') ===
                      format(now, 'yyyy-MM-dd'))
                }
                onClick={() => setSelectTime(14)}
              >
                14:00
              </Button>
              <Button
                variant="outline-primary"
                disabled={
                  timeTable[week]?.time15 === 'N' ||
                  (hours >= 15 &&
                    format(selectedDate, 'yyyy-MM-dd') ===
                      format(now, 'yyyy-MM-dd'))
                }
                onClick={() => setSelectTime(15)}
              >
                15:00
              </Button>
              <Button
                variant="outline-primary"
                disabled={
                  timeTable[week]?.time16 === 'N' ||
                  (hours >= 16 &&
                    format(selectedDate, 'yyyy-MM-dd') ===
                      format(now, 'yyyy-MM-dd'))
                }
                onClick={() => setSelectTime(16)}
              >
                16:00
              </Button>
              <Button
                variant="outline-primary"
                disabled={
                  timeTable[week]?.time17 === 'N' ||
                  (hours >= 17 &&
                    format(selectedDate, 'yyyy-MM-dd') ===
                      format(now, 'yyyy-MM-dd'))
                }
                onClick={() => setSelectTime(17)}
              >
                17:00
              </Button>
              <Button
                variant="outline-primary"
                disabled={
                  timeTable[week]?.time18 === 'N' ||
                  (hours >= 18 &&
                    format(selectedDate, 'yyyy-MM-dd') ===
                      format(now, 'yyyy-MM-dd'))
                }
                onClick={() => setSelectTime(18)}
              >
                18:00
              </Button>
              <Button
                variant="outline-primary"
                disabled={
                  timeTable[week]?.time19 === 'N' ||
                  (hours >= 19 &&
                    format(selectedDate, 'yyyy-MM-dd') ===
                      format(now, 'yyyy-MM-dd'))
                }
                onClick={() => setSelectTime(19)}
              >
                19:00
              </Button>
              <Button
                variant="outline-primary"
                disabled={
                  timeTable[week]?.time20 === 'N' ||
                  (hours >= 19 && minutes >= 30)
                }
                onClick={() => setSelectTime(20)}
              >
                19:30
              </Button>
            </div>
          </div>
        </div>
      </Container>
      <div className="btn-area fix-bottom place-footerbtn">
        <div className="flex-pay">
          <p className="all-acount">
            총 결제금액{' '}
            <span className="pay">
              {Utils.changeNumberComma(`${location.state.price}` || 0)}
            </span>{' '}
            원
          </p>
          <Button onClick={payment} disabled={selectTime === null}>
            다음 →
          </Button>
        </div>
      </div>
      {/* 푸터 */}
    </main>
  );
});
