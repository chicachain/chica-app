const TERM_TYPE = {
  TERMS_SERVICE: {
    type: 'TERMS_SERVICE',
    name: '이용약관',
    required: true,
    selected: false,
  },
  TERMS_PRIVATE: {
    type: 'TERMS_PRIVATE',
    name: '개인정보처리방침',
    required: true,
    selected: false,
  },
  TERMS_LOCATE: {
    type: 'TERMS_LOCATE',
    name: '위치기반서비스',
    required: true,
    selected: false,
  },
  TERMS_OPENSOURCE: {
    type: 'TERMS_OPENSOURCE',
    name: '오픈소스 라이선스',
    required: true,
    selected: false,
  },
  TERMS_AD: {
    type: 'TERMS_AD',
    name: '광고성 정보수신',
    required: false,
    selected: false,
  },
};
export default TERM_TYPE;
