/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Image, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import WeeklyCalendar from '../../components/WeekCalander';

export default React.memo(function CalanderTest(props) {
  const [selectedDate, setSelectedDate] = useState();

  const { id } = useParams();
  return (
    <div>
      <WeeklyCalendar
        date={new Date()}
        minDate={new Date('2023-09-12')}
        maxDate={new Date('2023-09-15')}
        onSelect={date => {
          setSelectedDate(date);
        }}
      />
      <div style={{ margin: 100 }}>
        {selectedDate && (
          <div>선택된 날짜: {format(selectedDate, 'yyyy-MM-dd')}</div>
        )}
      </div>
    </div>
  );
});
