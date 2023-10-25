/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import DatePicker from 'react-mobile-datepicker';
import { Button } from 'react-bootstrap';

export default React.memo(function MobileDatePickerTest(props) {
  const [time, setTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const dateConfig = {
    hour: {
      format: 'hh',
      caption: 'Hour',
      step: 1,
    },
    minute: {
      format: 'mm',
      caption: 'Min',
      step: 1,
    },
    second: {
      format: 'hh',
      caption: 'Sec',
      step: 1,
    },
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  // eslint-disable-next-line no-shadow
  const handleSelect = time => {
    setTime(time);
    setIsOpen(false);
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Date Picker</Button>
      <DatePicker
        value={time}
        isOpen={isOpen}
        onSelect={handleSelect}
        onCancel={handleCancel}
        confirmText="저장"
        cancelText="취소"
        showCaption={false}
        dateConfig={dateConfig}
        showHeader={false}
        showFooter
      />
    </div>
  );
});
