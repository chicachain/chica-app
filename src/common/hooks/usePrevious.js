import { useEffect, useRef } from 'react';
// 이전 렌더링에서의 값을 기억해두어야하는 경우에 사용
export const usePrevious = value => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
