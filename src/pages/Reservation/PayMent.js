/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import 'swiper/swiper-bundle.css';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

// Util
import Utils from '@common/utils/Utils';
import {
  checkMetaMaskConnection,
  balanceOf,
  getWallet,
  transfer,
} from '../../common/utils/Web3Util'; // Web3

// API
import {
  getReservationConfig,
  saveReservation,
  confirmReservation,
  errorReservation,
} from '../../api/reservation/reservations';
import { getMyPoint } from '../../api/member/userInfo';

// Custom Component
import { handleError } from '../../common/utils/HandleError';

// Const
import PAY_TYPE from '../../common/constants/PayTypes';

// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);

// 초기 코드관리
const initialConfigInfo = {
  coinPrice: 0, // 코인 현재가 - KRW
  maxOrderPoint: 0, // 최대 사용 가능 포인트
  maxOrderPointRate: 0, // 최대 사용 가능 포인트 비율
  minUsePoint: 0, // 최소 사용가능 포인트
  availableUsePoint: 0, // 사용가능 내 포인트
};

// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function PayMent(props) {
  const history = useHistory();
  const location = useLocation();
  const week = ['월', '화', '수', '목', '금', '토', '일'];

  const { price } = location.state; // 총 결제 금액
  if (!price) history.go(-1); // 잘묏된 접근

  // ===================================================================
  // [ State ]
  // ===================================================================

  const [name, setName] = useState(''); // 예약자 이름
  const [phone, setPhone] = useState(''); // 예약자 전화번호
  const [request, setRequest] = useState(''); // 요청사항
  const [selectTime, setSelectTime] = useState(); // 예약 시간
  const [purchase, setPurchase] = useState(''); // 결제 타입 ( 카드, 포인트, 토큰 )
  const [firstAgree, setFirstAgree] = useState(false); // 약관 1
  const [secondAgree, setSecondAgree] = useState(false); // 약관 2
  const [thirdAgree, setThirdAgree] = useState(false); // 약관 3
  const [agreeAll, setAgreeAll] = useState(false); // 약관 전체

  const [priceInChica, setPriceInChica] = useState(0); // 결제 금액 by 토큰

  // 포인트
  const [myPoint, setMyPoint] = useState('');
  const [usePoint, setUsePoint] = useState('');

  // 코드관리 ( 코인 현재가 - KRW, 최대 사용 가능 포인트 비율, 최소 사용 포인트 )
  const [configInfo, setConfigInfo] = useState(initialConfigInfo);

  // ===================================================================
  // [ Util ]
  // ===================================================================

  // 약관 > 전체동의
  const allAgree = e => {
    setFirstAgree(e);
    setSecondAgree(e);
    setThirdAgree(e);
  };

  // 결제 타입 입력
  const payTypeChangeHandler = async type => {
    switch (type) {
      case PAY_TYPE.CHICA_TOKEN.type: // 토큰 결제
      case PAY_TYPE.POINT_TOKEN.type: // 포인트 결제
        // MetaMask 연동 확인
        checkMetaMaskConnection();

        // 포인트 + 토큰 입력값 초기화
        setUsePoint('');
        convertPriceInChica({ inputPoint: 0 });
        break;
      default:
        toast('현재 지원하지 않는 결제 서비스입니다.');
        return;
    }

    setPurchase(type); // 상태 변경
  };

  // 사용 포인트 입력
  const pointInputHandler = e => {
    const { value } = e.target;
    const orgValue = value.replace(/[^0-9]/g, ''); // 숫자 제한
    const minValue = Math.min(orgValue, myPoint, configInfo.availableUsePoint); // 사용 가능 포인트
    const commaValue = `${minValue}`.replace(/\d(?=(?:\d{3})+$)/g, '$&,'); // 콤마처리

    setUsePoint(commaValue);
    convertPriceInChica({ inputPoint: minValue }); // 총 결제금액 토큰가 갱신
  };

  // 결제금액 토큰계산
  const convertPriceInChica = ({ inputPoint = 0 }) => {
    if (configInfo.coinPrice > 0) {
      const tokenKrwPrice = configInfo.coinPrice;
      const remainPrice = price - inputPoint;
      const calPrice = Math.ceil((remainPrice / tokenKrwPrice) * 100) / 100; // 소수점 2자리 - 올림처리

      if (calPrice > 0) setPriceInChica(calPrice);
      else setPriceInChica(0);
    }
  };

  // 결제하기 최종 Input 검증
  const validateReservationInput = params => {
    const result = {
      isValid: false,
      message: '',
    };

    // 결제 타입 확인 조건식
    const isChicaToken = params?.payType === PAY_TYPE.CHICA_TOKEN.type;
    const isPointToken = params?.payType === PAY_TYPE.POINT_TOKEN.type;

    // [ 사전 선택 정보 ]
    if (!params.shopId) {
      result.message = '선택된 샵 정보가 없습니다.';
    } else if (!params.menuId) {
      result.message = '선택된 메뉴 정보가 없습니다.';
      // } else if (!params.staffId) {
      //   result.message = '선택된 디자이너 정보가 없습니다.';
    } else if (!params.resvDate) {
      result.message = '선택된 스케쥴 정보가 없습니다.';
    } else if (!params.price) {
      result.message = '결제금액 정보가 없습니다.';
    }
    // [ 사용자 입력 정보 ]
    else if (!params.resvNm) {
      result.message = '예약자 이름을 입력해주세요.';
    } else if (!params.resvPhone) {
      result.message = '휴대폰번호를 입력해주세요.';
    } else if (!params.memo) {
      result.message = '아티스트 요청사항을 입력해주세요.';
    } else if (!params.payType) {
      result.message = '결제수단이 선택되지 않았습니다.';
    }
    // [ 결제수단별 필수정보 ]
    // 토큰 결제
    else if (isChicaToken && !params.fromAddress) {
      result.message = 'MetaMask 연동을 확인해주세요.';
    } else if (isChicaToken && !params.payToken) {
      result.message = '결제 토큰 수량을 확인해주세요.';
    } else if (isChicaToken && !params.payTokenKrwPrice) {
      result.message = '토큰 현재가 정보를 불러올 수 없습니다.';
    }
    // 포인트 결제
    else if (isPointToken && !params.fromAddress) {
      result.message = 'MetaMask 연동을 확인해주세요.';
    } else if (isPointToken && !params.payToken) {
      result.message = '결제 토큰 수량을 확인해주세요.';
    } else if (isPointToken && !params.payPoint) {
      result.message = '사용 포인트를 확인해주세요.';
    } else if (isPointToken && !params.payTokenKrwPrice) {
      result.message = '토큰 현재가 정보를 불러올 수 없습니다.';
    } else if (isPointToken && usePoint > configInfo.minUsePoint) {
      result.message = `최소 사용 포인트(${Utils.changeNumberComma(
        configInfo.minUsePoint,
      )})를 확인해주세요.`;
    } else if (isPointToken && usePoint > configInfo.availableUsePoint) {
      result.message = `사용 가능 포인트(${Utils.changeNumberComma(
        configInfo.availableUsePoint,
      )}를 확인해주세요.`;
    }
    // OK
    else {
      result.isValid = true;
    }
    // 포인트 결제 ( 내 포인트, 사용(입력) 포인트, 허용 포인트 )
    // 결제 금액 확인

    return result;
  };

  // 예약 진행 > 결제 타입별 전처리 > API
  const proceedReservation = async () => {
    // 토큰 관련 결제 ( 토큰 결제 & 포인트 결제 )
    if (
      purchase === PAY_TYPE.CHICA_TOKEN.type ||
      purchase === PAY_TYPE.POINT_TOKEN.type
    ) {
      // 지갑 연동 및 지갑 주소 갱신
      const address = await getWallet();

      if (address) {
        // 지갑 잔액 확인
        balanceOf({ walletAddress: address })
          .then(balance => {
            const myBalance = +Number(balance).toFixed(2);

            if (priceInChica > myBalance) {
              toast(`토큰 잔액이 부족합니다. 현재 잔액 ${myBalance}`);
              return;
            }

            // API 예약하기
            requestReservation({ fromAddress: address });
          })
          .catch(err => {
            switch (+err.code) {
              case 1100:
                toast('잘못된 형식의 지갑주소입니다.');
                break;
              default:
                toast('블록체인 네트워크와의 통신에 실패했습니다.');
                break;
            }
          });
      }
    }
    // 기타 결제
    else {
      // API 예약하기
      requestReservation({ fromAddress: '' });
    }
  };

  // ===================================================================
  // [ API ] 예약하기
  // ===================================================================
  const requestReservation = async ({ fromAddress }) => {
    try {
      // [ 공통 ] - JSON 파라미터
      const params = {
        shopId: location.state.shopID,
        menuId: location.state.menuID,
        staffId: location.state.staffID,
        resvDate: format(location.state.date, 'yyyy-MM-dd HH:mm'),
        resvNm: name,
        resvPhone: phone,
        memo: request,
        price,
        payType: purchase,
      };

      // [ 결제타입별 분기처리 ] - JSON 파라미터
      switch (purchase) {
        // 포인트 결제
        case PAY_TYPE.POINT_TOKEN.type:
          params.fromAddress = fromAddress;
          params.payPoint = usePoint.replace(',', '');
          params.payToken = priceInChica;
          params.payTokenKrwPrice = configInfo.coinPrice;
          break;
        // 토큰 결제
        case PAY_TYPE.CHICA_TOKEN.type:
          params.fromAddress = fromAddress;
          params.payToken = priceInChica;
          params.payTokenKrwPrice = configInfo.coinPrice;
          break;
        default:
          toast('현재 지원하지 않는 결제수단입니다.');
          return;
      }

      // Input 체크
      const inputCheck = validateReservationInput(params);
      if (!inputCheck.isValid) {
        toast(inputCheck.message);
        return;
      }

      // Axios
      const { data } = await saveReservation(params);

      if (data.code === 200) {
        const resvInfo = data.data;

        // 예약 등록 성공 > MetaMask 송금
        transfer(resvInfo.toAddress, priceInChica)
          .then(async txid => {
            // 성공 ( 송금 > txid 확인 )
            if (txid) {
              const confirmResult = await confirmReservation({
                payType: resvInfo.payType,
                resvId: resvInfo.resvId,
                txid,
              });

              if (confirmResult.data.code === 200) {
                history.push({
                  pathname: `/reservation/complete`,
                  state: {
                    resvId: resvInfo.resvId,
                    resvDate: location.state.date,
                    shopNm: resvInfo.shopNm,
                    staffNm: resvInfo.staffNm,
                    menuNm: resvInfo.menuNm,
                    payType: purchase,
                    price: resvInfo.price,
                    fromAddress: resvInfo.fromAddress,
                    toAddress: resvInfo.toAddress,
                  },
                });
              }
            }
            // 실패
            else {
              throw new Error('토큰 송금 실패');
            }
          })
          .catch(async err => {
            await errorReservation({
              payType: resvInfo.payType,
              resvId: resvInfo.resvId,
            });
          });
      }
    } catch (error) {
      handleError(error);
    }
  };

  // ===================================================================
  // [ API ] 내 보유 포인트 조회
  // ===================================================================
  const getMyPointInfo = async () => {
    try {
      const { data } = await getMyPoint();

      if (data.code === 200) {
        setMyPoint(data.data || 0);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // ===================================================================
  // [ API ] 예약 관련 코드관리 조회
  // ===================================================================
  const getResvConfig = async () => {
    try {
      const { data } = await getReservationConfig();

      if (data.code === 200) {
        const info = data.data;

        setConfigInfo({
          ...info,
          maxOrderPoint: price * info.maxOrderPointRate,
          availableUsePoint: Math.min(myPoint, price * info.maxOrderPointRate),
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  // ===================================================================
  // [ useEffect ]
  // ===================================================================

  // (1) 내 보유 포인트 조회
  useEffect(() => {
    setSelectTime(location.state.time);
    getMyPointInfo();
  }, []);

  // (2) 예약 관련 코드관리 조회
  useEffect(() => {
    if (myPoint !== '' && myPoint >= 0) {
      getResvConfig();
    }
  }, [myPoint]);

  // (3) 총 결제금액 토큰가 갱신
  useEffect(() => {
    if (configInfo.coinPrice > 0) {
      convertPriceInChica({ inputPoint: 0 });
    }
  }, [configInfo]);

  // 약관 선택 인터페이스
  useEffect(() => {
    if (firstAgree === true && secondAgree === true && thirdAgree === true) {
      setAgreeAll(true);
    } else setAgreeAll(false);
  }, [firstAgree, secondAgree, thirdAgree]);

  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <main id="payment">
      {/* 헤더 */}
      <header>
        <Container>
          <div className="header-flex">
            <h6>결제하기</h6>
            <i className="material-icons" onClick={() => history.goBack()}>
              close
            </i>
          </div>
        </Container>
      </header>

      {/* 컨텐츠 */}
      <Container className="container-custom">
        {/* 예약자 정보 입력 */}
        <div className="payment-form">
          <Form.Group>
            <Form.Label>
              예약자 이름 <span>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="예약자 이름을 입력해주세요."
              name="name"
              onChange={e => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>
              휴대폰번호 <span>*</span>
            </Form.Label>
            <div className="phone-btnbox">
              <Form.Control
                type="number"
                placeholder="휴대폰번호 입력 (- 제외)"
                name="name"
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>아티스트 요청사항</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="매장에 요청사항이 있으신가요? 요청사항 확인이 어려울 수 있으니, 방문 후 다시 한번 말씀해주세요. 단 시술 시간 조정요청은 적용되지 않습니다."
              onChange={e => setRequest(e.target.value)}
            />
          </Form.Group>
        </div>

        {/* 예약정보 */}
        <div className="reservation-info-grid">
          <div className="reservation-titlebox">
            <h6>예약정보</h6>
          </div>
          <div className="grid-box">
            <p className="grid-title">날짜/시간</p>
            <p className="grid-subtitle">
              {format(location.state.date, 'yyyy년 M월 d일')}{' '}
              {week[location.state.day]}요일{' '}
              {selectTime === 12
                ? `오후 ${selectTime}`
                : selectTime < 12
                ? `오전 ${selectTime}`
                : `오후 0${
                    selectTime === 20 ? (selectTime - 1) % 12 : selectTime % 12
                  }`}
              :{selectTime === 20 ? '30' : '00'}
            </p>
          </div>
          <div className="grid-box">
            <p className="grid-title">매장/담당</p>
            <p className="grid-subtitle">
              {location.state.shop} -{' '}
              {location.state.staff === null
                ? '현장지정'
                : location.state.staff}
            </p>
          </div>
          <div className="grid-box">
            <p className="grid-title">선택 메뉴</p>
            <p className="grid-subtitle">{location.state.menu}</p>
          </div>
        </div>

        {/* 결제정보 */}
        <div className="payment-info-grid">
          <div className="patment-titlebox">
            <h6>결제정보</h6>
          </div>
          <div style={{ borderBottomColor: '#4D4D53' }}>
            {/* 서비스 가격 */}
            <div className="grid-box">
              <p className="grid-title">서비스 가격</p>
              <p className="grid-subtitle">
                {Utils.changeNumberComma(`${price}` || 0)}원
              </p>
            </div>
            {/* 사용 포인트 - 포인트 결제 Only */}
            {purchase === PAY_TYPE.POINT_TOKEN.type && (
              <div className="grid-box">
                <p className="grid-title">사용 포인트</p>
                <input
                  className="grid-subtitle"
                  value={usePoint}
                  onChange={pointInputHandler}
                  maxLength={8}
                  placeholder="포인트 입력"
                />
                <p className="grid-title mt-1">내 포인트</p>
                <p className="grid-subtitle mt-1">
                  {Utils.changeNumberComma(myPoint)}
                </p>
                <p className="grid-title mt-1">사용 가능</p>
                <p className="grid-subtitle mt-1">
                  {Utils.changeNumberComma(configInfo.availableUsePoint)}
                </p>
                <p className="grid-title mt-1">최소 포인트</p>
                <p className="grid-title mt-1">
                  {Utils.changeNumberComma(configInfo.minUsePoint)}
                </p>
              </div>
            )}
          </div>

          {/* 총 결제금액 */}
          <div className="grid-box">
            <p className="grid-title">총 결제금액</p>
            <p className="grid-submaxtitle">
              {Utils.changeNumberComma(`${price}` || 0)} <span>원</span>{' '}
              <span>{`( ${priceInChica} CHICA + ${
                Utils.changeNumberComma(usePoint) || 0
              } 포인트 )`}</span>
            </p>
          </div>
        </div>

        {/* 결제 안내 문구 */}
        <div className="payment-terms">
          <p>
            고객님의 뷰티 시 부위 상태에 따라 선택한 시술이 불가능하거나 추가
            비용이 발생할 수 있습니다.
          </p>
          <p>
            시술 예약시간이 2시간 전까지 취소 시 100% 취소/환불이 가능하며, 이후
            취소하거나 미방문일 경우 10% 페널티가 부가되어 90% 취소/환불됩니다.
          </p>
          <p>시술 예약시간 2시간 전까지 ‘날짜, 시간’ 변경 가능합니다.</p>
          <p>시술 예약시간 변경은 예 건당 3회까지 가능합니다.</p>
        </div>

        {/* 결제 수단 선택 */}
        <div className="card-box mt-3">
          {/* 신용카드 */}
          <Button
            onClick={() => payTypeChangeHandler(PAY_TYPE.CREDIT_CARD.type)}
            disabled
          >
            <div>
              <Form.Check
                type="radio"
                id="default1-radio"
                name="cash"
                checked={purchase === PAY_TYPE.CREDIT_CARD.type}
                readOnly
              />
            </div>
            일반 신용카드
          </Button>
          {/* 포인트 */}
          <Button
            onClick={() => payTypeChangeHandler(PAY_TYPE.POINT_TOKEN.type)}
          >
            <div>
              <Form.Check
                type="radio"
                id="default2-radio"
                name="cash"
                checked={purchase === PAY_TYPE.POINT_TOKEN.type}
                readOnly
              />
            </div>
            포인트 결제
          </Button>
          {/* 토큰 */}
          <Button
            onClick={() => {
              payTypeChangeHandler(PAY_TYPE.CHICA_TOKEN.type);
            }}
          >
            <div>
              <Form.Check
                type="radio"
                id="default3-radio"
                name="cash"
                checked={purchase === PAY_TYPE.CHICA_TOKEN.type}
                readOnly
              />
            </div>
            CHICA토큰
          </Button>
        </div>

        {/* 약관 */}
        <div className="agress-box">
          <div className="checked-box">
            <Form.Check
              type="checkbox"
              id="agress1-check"
              label="전체동의"
              className="all-agress"
              checked={agreeAll === true}
              onClick={
                firstAgree === true &&
                secondAgree === true &&
                thirdAgree === true
                  ? () => allAgree(false)
                  : () => allAgree(true)
              }
              readOnly
            />
          </div>
          <div className="checked-box ">
            <Form.Check
              type="checkbox"
              id="agress2-check"
              label="[필수] 개인정보수집 동의"
              checked={firstAgree === true}
              onClick={() => setFirstAgree(!firstAgree)}
              readOnly
            />
            <div className="checked-terms">
              <p>목적: 시술예약</p>
              <p>항목: 예약자 이름 및 연락처</p>
              <p>이용/보관기간: 회원탈퇴 또는 동의 철회 시</p>
            </div>
          </div>
          <div className="checked-box ">
            <Form.Check
              type="checkbox"
              id="agress3-check"
              label="[필수] 제3자 정보제공 동의"
              checked={secondAgree === true}
              onClick={() => setSecondAgree(!secondAgree)}
              readOnly
            />
            <div className="checked-terms">
              <p>
                예약 서비스 및 커뮤니케이션을 위해 개인정보를 제공받는 대상:
                위뷰티 공덕점
              </p>
            </div>
          </div>
          <div className="checked-box ">
            <Form.Check
              type="checkbox"
              id="agress4-check"
              label="[필수] 취소/변경/환불 수수료 동의"
              checked={thirdAgree === true}
              onClick={() => setThirdAgree(!thirdAgree)}
              readOnly
            />
            <div className="checked-terms">
              <p>
                위 명시된 취소/변경/환불 수수료 및 기한을 확인하였음을
                동의합니다.
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* 푸터 */}
      <div className="btn-area fix-bottom place-footerbtn">
        <div className="flex-pay">
          <p className="all-acount">
            총 결제금액{' '}
            <span className="pay">
              {Utils.changeNumberComma(`${price}` || 0)}
            </span>{' '}
            원
          </p>
          <Button
            onClick={() => {
              if (window.confirm('결제하시겠습니까?')) {
                proceedReservation();
              }
            }}
            disabled={
              name === '' ||
              phone === '' ||
              purchase === '' ||
              agreeAll === false
            }
          >
            결제하기 →
          </Button>
        </div>
      </div>
    </main>
  );
});
