const REQUEST_STATUS = {
  WAIT: {
    type: 'WAIT',
    name: '예약중',
  },
  TEMP: {
    type: 'TEMP',
    name: '임시저장',
  },
  CONFIRM: {
    type: 'CONFIRM',
    name: '확정',
  },
  REJECT: {
    type: 'REJECT',
    name: '거절',
  },
  ERROR: {
    type: 'ERROR',
    name: '오류',
  },
  CANCEL: {
    type: 'CANCEL',
    name: '취소',
  },
  CANCEL_WAIT: {
    type: 'CANCEL_WAIT',
    name: '취소 요청',
  },
  CANCEL_FIN: {
    type: 'CANCEL_FIN',
    name: '취소 완료',
  },
  FINISH: {
    type: 'FINISH',
    name: '방문',
  },
};
export default REQUEST_STATUS;
