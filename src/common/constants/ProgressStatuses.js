const PROGRESS_STATUS = {
  WAIT: {
    type: 'WAIT',
    name: '대기',
  },
  PROGRESS: {
    type: 'PROGRESS',
    name: '진행중',
  },
  COMPLETE: {
    type: 'COMPLETE',
    name: '종료',
  },
  CANCEL: {
    type: 'CANCEL',
    name: '취소',
  },
  ERROR: {
    type: 'ERROR',
    name: '오류',
  },
};
export default PROGRESS_STATUS;
