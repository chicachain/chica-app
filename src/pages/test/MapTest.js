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
import WeeklyCalendar from '../../components/WeekCalander';
import CustomMap from '../../components/CustomMap';

export default React.memo(function CalanderTest(props) {
  const [selectedDate, setSelectedDate] = useState();
  return (
    <div>
      <CustomMap />
    </div>
  );
});
