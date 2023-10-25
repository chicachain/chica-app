import { useState } from 'react';

const validateInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  // const [isValid, setIsValid] = useState(''); // bool > 초기 화면 로딩 UI 이슈로 공백 문자열 주입

  const changeHandler = (
    inputValue,
    validaor = null, // 값 검증 함수
    compareValue = null, // 값 비교 매개변수
  ) => {
    setValue(inputValue);
  };

  return {
    value,
    // isValid,
    changeHandler,
  };
};

export default validateInput;
