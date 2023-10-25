const PAY_TYPE = {
  CREDIT_CARD: {
    type: 'CREDIT_CARD',
    name: '일반 신용카드',
  },
  CHICA_POINT: {
    type: 'CHICA_POINT',
    name: '포인트 결제',
  },
  CHICA_TOKEN: {
    type: 'CHICA_TOKEN',
    name: 'CHICA 토큰',
  },
  POINT_TOKEN: {
    type: 'POINT_TOKEN',
    name: '포인트+토큰',
  },
  POINT_CARD: {
    type: 'POINT_CARD',
    name: '포인트+신용카드',
  },
};
export default PAY_TYPE;
