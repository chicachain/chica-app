import { useEffect, useState } from 'react';

const useTimer = () => {
  let start = 180;
  const [timer, setTimer] = useState();
  const [flag, setFlag] = useState(false);

  const resetTimer = () => {
    setFlag(!flag);
  };

  useEffect(() => {
    start = 180;

    const interval = setInterval(() => {
      if (start <= 0) {
        setTimer(`0:00`);
        return;
      }

      start -= 1;

      const min = Math.floor(start / 60);
      const sec = start % 60 < 10 ? `0${start % 60}` : start % 60;

      setTimer(`${min}:${sec}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [flag]);

  return { timer, resetTimer };
};

export default useTimer;
