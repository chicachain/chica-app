import React, { useState, useEffect } from 'react';
import {
  format,
  addWeeks,
  addMonths,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from 'date-fns';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import ko from 'date-fns/locale/ko';
import classNames from 'classnames';

function WeeklyCalendar({ date, onSelect, minDate, maxDate, disableDate }) {
  const now = new Date();

  const [monthEachWeekDateList, setMonthEachWeekDateList] = useState([]);
  const [checkDate, setCheckDate] = useState(format(now, 'yyyy-MM-dd'));

  useEffect(() => {
    getMonthDates(date);
  }, [date]);

  const getMonthDates = dateOfMonth => {
    const monthEachWeekDate = [];
    let start = startOfWeek(dateOfMonth, { weekStartsOn: 1 });
    const end = addMonths(start, 2);
    while (start <= end) {
      const dates = getWeekDates(start);
      monthEachWeekDate.push(dates);
      start = addWeeks(start, 1);
    }
    setMonthEachWeekDateList(monthEachWeekDate);
  };

  const getWeekDates = dateOfWeeks => {
    const start = startOfWeek(dateOfWeeks, { weekStartsOn: 1 });
    const end = endOfWeek(dateOfWeeks, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  const handleDateClick = sltDate => {
    if (onSelect) onSelect(sltDate);
  };

  const exceedMax = compareDate => {
    if (compareDate && maxDate) {
      const cpDate = new Date(format(compareDate, 'yyyy-MM-dd'));
      const max = new Date(format(maxDate, 'yyyy-MM-dd'));
      return cpDate > max;
    }
    return false;
  };

  const underMin = compareDate => {
    if (compareDate && minDate) {
      const cpDate = new Date(format(compareDate, 'yyyy-MM-dd'));
      const min = new Date(format(minDate, 'yyyy-MM-dd'));
      return cpDate < min;
    }
    return false;
  };

  const activeCheck = compareDate => {
    if (compareDate && date) {
      const cpDate = format(compareDate, 'yyyy-MM-dd');
      const selected = format(date, 'yyyy-MM-dd');
      return cpDate === selected;
    }
    return false;
  };

  const disableDay = compareDate => {
    const cpDate = format(compareDate, 'yyyy-MM-dd');
    if (disableDate.indexOf(cpDate) > -1) {
      return true;
    }
    return false;
  };

  return (
    <div>
      <Swiper
        // spaceBetween={13}
        slidesPerView={1}
        navigation={false}
        // pagination={{ clickable: true }}
        pagination={false}
        // scrollbar={{ draggable: true }}
      >
        {monthEachWeekDateList &&
          monthEachWeekDateList.length > 0 &&
          monthEachWeekDateList.map((item, index) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <SwiperSlide key={`week-${index}`}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  className="day-slider"
                >
                  {item &&
                    item.length > 0 &&
                    item.map(dateItem => (
                      <div
                        key={dateItem}
                        style={{
                          display: 'grid',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          cursor:
                            !exceedMax(dateItem) &&
                            !underMin(dateItem) &&
                            !disableDay(dateItem)
                              ? 'pointer'
                              : 'default',
                        }}
                        className={classNames({
                          disabled:
                            exceedMax(dateItem) ||
                            underMin(dateItem) ||
                            disableDay(dateItem),
                          active: activeCheck(dateItem),
                        })}
                        onClick={() => {
                          if (
                            !exceedMax(dateItem) &&
                            !underMin(dateItem) &&
                            !disableDay(dateItem)
                          ) {
                            handleDateClick(dateItem);
                          }
                          setCheckDate(format(dateItem, 'yyyy-MM-dd'));
                        }}
                      >
                        <div className="day-title">
                          {format(dateItem, 'E', { locale: ko })}
                        </div>
                        <div
                          className={`day-number ${
                            format(dateItem, 'yyyy-MM-dd') === checkDate
                              ? 'active'
                              : ''
                          } ${
                            exceedMax(dateItem) ||
                            underMin(dateItem) ||
                            disableDay(dateItem)
                              ? 'disable'
                              : ''
                          }`}
                        >
                          {format(dateItem, 'dd', { locale: ko })}
                        </div>
                      </div>
                    ))}
                </div>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </div>
  );
}

export default WeeklyCalendar;
