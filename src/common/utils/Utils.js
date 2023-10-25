import moment from 'moment';

const calTime = {
  seconds: 1,
  minute: 1 * 60,
  hour: 1 * 60 * 60,
  day: 1 * 60 * 60 * 24,
  mon: 1 * 60 * 60 * 24 * 30,
  year: 1 * 60 * 60 * 24 * 30 * 12,
};

const utils = {
  logStyleErr: 'color:red',
  logStyleWarn: 'color:yellow',
  logStyleInfo: 'color:blue',
  logStyleSuccess: 'color:green',

  checkSpace: str => {
    if (str.search(/\s/) !== -1) {
      return true;
    }
    return false;
  },
  // 거리 계산 ( Decimal > number + km | number + m)
  convertDistance: decimalValue => {
    const distance = decimalValue || 0;

    if (distance > 1) {
      return `${distance.toFixed(1)} km`;
    }
    return `${(distance * 1000).toFixed(0)} m`;
  },
  // 경과 시간 계산
  calculatePassedTime: datetime => {
    const now = new Date();
    const writeDay = new Date(datetime);

    let difference = now.getTime() - writeDay.getTime();
    difference = Math.trunc(difference / 1000);

    let result = '';

    if (difference < calTime.seconds) {
      result = '방금전';
    } else if (difference < calTime.minute) {
      result = `${Math.trunc(difference / calTime.seconds)}초 전`;
    } else if (difference < calTime.hour) {
      result = `${Math.trunc(difference / calTime.minute)}분 전`;
    } else if (difference < calTime.day) {
      result = `${Math.trunc(difference / calTime.hour)}시간 전`;
    } else if (difference < calTime.mon) {
      result = `${Math.trunc(difference / calTime.day)}일 전`;
    } else if (difference < calTime.year) {
      result = `${Math.trunc(difference / calTime.mon)}달 전`;
    } else {
      result = `${Math.trunc(difference / calTime.year)}년 전`;
    }

    return result;
  },
  // 숫자 단위 나누기 : 만, 억, 조, 경 단위로 나누기 :: 'x억, x만, ... '
  numberFormat: number => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  numberToKorean: number => {
    const inputNumber = number < 0 ? false : number;
    const unitWords = ['', '만', '억', '조', '경'];
    const splitUnit = 10000;
    const splitCount = unitWords.length;
    const resultArray = [];
    let resultString = '';

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < splitCount; i++) {
      let unitResult = (inputNumber % splitUnit ** (i + 1)) / splitUnit ** i;
      unitResult = Math.floor(unitResult);
      if (unitResult > 0) {
        resultArray[i] = unitResult;
      }
    }

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < resultArray.length; i++) {
      // eslint-disable-next-line no-continue
      if (!resultArray[i]) continue;
      resultString = `${
        String(utils.numberFormat(resultArray[i])) + unitWords[i]
      } ${resultString}`;
    }
    return resultString.trim();
  },

  // 숫자 단위 나누기 K, M, B :: 'xM, xK, ...'
  numberToEng: number => {
    const inputNumber = number < 0 ? false : number;
    const unitWords = ['', 'K', 'M', 'B'];
    const splitUnit = 1000;
    const splitCount = unitWords.length;
    const resultArray = [];
    let resultString = '';

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < splitCount; i++) {
      let unitResult = (inputNumber % splitUnit ** (i + 1)) / splitUnit ** i;
      unitResult = Math.floor(unitResult);
      if (unitResult > 0) {
        resultArray[i] = unitResult;
      }
    }
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < resultArray.length; i++) {
      // eslint-disable-next-line no-continue
      if (!resultArray[i]) continue;
      resultString = `${String(resultArray[i]) + unitWords[i]} ${resultString}`;
    }

    return resultString.trim();
  },
  // 숫자 단위를 통해 축약 :: 한글단위
  abbreviateNumberKoean: value => {
    let newValue = value;
    if (value >= 10000) {
      const suffixes = ['', '만', '억', '조', '경'];
      const suffixNum = Math.floor(`${value}`.length / 4);
      let shortValue = '';
      // eslint-disable-next-line no-plusplus
      for (let precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat(
          (suffixNum !== 0 ? value / 10000 ** suffixNum : value).toPrecision(
            precision,
          ),
        );
        const dotLessShortValue = `${shortValue}`.replace(
          /[^a-zA-Z 0-9]+/g,
          '',
        );
        if (dotLessShortValue.length <= 2) {
          break;
        }
      }
      if (shortValue % 1 !== 0) shortValue = shortValue.toFixed(1);
      newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
  },

  // 숫자 단위를 통해 축약 :: 영어단위
  abbreviateNumber: value => {
    let newValue = value;
    if (value >= 1000) {
      const suffixes = ['', 'k', 'm', 'b', 't'];
      const suffixNum = Math.floor(`${value}`.length / 3);
      let shortValue = '';
      // eslint-disable-next-line no-plusplus
      for (let precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat(
          (suffixNum !== 0 ? value / 1000 ** suffixNum : value).toPrecision(
            precision,
          ),
        );
        const dotLessShortValue = `${shortValue}`.replace(
          /[^a-zA-Z 0-9]+/g,
          '',
        );
        if (dotLessShortValue.length <= 2) {
          break;
        }
      }
      if (shortValue % 1 !== 0) shortValue = shortValue.toFixed(1);
      newValue = shortValue + suffixes[suffixNum];
    }
    return newValue;
  },

  // 인풋 입력숫자 콤마표기
  changeNumberComma: str => {
    if (str === '' || str === null || str === undefined) return '';
    const result = Number(`${str}`.replace(/\D/g, '')).toLocaleString();
    return result;
    // const parts = str.split('.');
    // return (
    //   parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    //   (parts[1] ? `.${parts[1]}` : '')
    // );
    // const str = val.split('.');
    // str[0] = str[0].replace(/[^0-9.]/g, '').replace(/(.)(?=(\d{3})+$)/g, '$1,');
    // const fmStr = str.join('.');

    // return fmStr.replace(
    //   /[`~!@#$%^&*()_|+\-=?;:'"<>{}[]|ㄱ-ㅎ|ㅏ-ㅣ-ㅢ|가-힣|a-z|A-Z]/g,
    //   '',
    // );
    // const result = str.replace(/[^0-9.]/g, '') * 1;

    // return (result * 1).toLocaleString();
    // let result;
    // if (str === '') {
    //   result = '';
    // }
    // let end = '';
    // if (str.charAt(str.length - 1) === '.') {
    //   end = '.';
    //   result = parseFloat(str).toLocaleString() + end;
    // }
    // console.log(end);
    // return result;
  },

  // 숫자 콤마표기, 소수점 3자리까지
  numberComma: num => {
    const result = Number(num).toLocaleString(undefined, {
      maximumFractionDigits: 3,
    });
    return result;
  },
  // 숫자 콤마제거, 소수점 3자리까지
  removeComma: str => {
    const result = str.toString().replace(/,/g, '').toLocaleString(undefined, {
      maximumFractionDigits: 3,
    });
    return Number(result);
  },

  // 가격 이름 변환
  translateSaleType: type => {
    switch (type) {
      case 'unsold':
        return '일반 판매';
      case 'general':
        return '일반 판매';
      case 'limited':
        return '한정 판매';
      case 'auction':
        return '경매';
      default:
        return '';
    }
  },

  // 가운데 ellipsis
  ellipsisCenter(str, maxLength, startLength, endLength) {
    if (str.length > maxLength) {
      return `${str.substr(0, startLength)}…${str.substr(
        str.length - endLength,
        str.length,
      )}`;
    }
    return str;
  },

  calculateDuration: (start, end, format) => {
    const ms = moment(end, 'DD/MM/YYYY HH:mm:ss').diff(
      moment(start, 'DD/MM/YYYY HH:mm:ss'),
    );
    const d = moment.duration(ms);
    const result = d.format(format);
    return result;
  },

  // 정규식
  regCheck: (value, type) => {
    let reg;
    switch (type) {
      case 'email':
        reg =
          /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        break;
      case 'tel':
        reg = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})?[0-9]{3,4}?[0-9]{4}$/;
        break;
      case 'password':
        reg =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/;
        break;
      case 'nickname':
        reg = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\\s]{3,15}$/;
        break;
      default:
        break;
    }
    return !!reg.test(value);
  },

  // 정규식
  importTerms: type => {
    switch (type) {
      case 'terms':
        return {
          title: '서비스 이용약관',
          content: `서비스 이용약관<br /><br />${dummyTerms}`,
        };
      case 'privacy':
        return {
          title: '개인정보 수집 및 이용',
          content: `개인정보 수집 및 이용<br /><br />${dummyTerms}`,
        };
      case 'thirdProvision':
        return {
          title: '개인정보 제3자 제공',
          content: `개인정보 제3자 제공<br /><br />${dummyTerms}`,
        };
      case 'selfAuthModalPrivacy':
        return {
          title: '개인정보 수집 및 이용',
          content: `본인인증 모달 내 개인정보 수집 및 이용<br /><br />${dummyTerms}`,
        };
      default:
        return {
          title: '개인정보 수집 및 이용',
          content: `개인정보 수집 및 이용<br /><br />${dummyTerms}`,
        };
    }
  },

  // 초 -> 시:분:초
  secondsToTime: seconds => {
    let result;

    const hour =
      parseInt(seconds / 3600, 10) < 10
        ? `0${parseInt(seconds / 3600, 10)}`
        : parseInt(seconds / 3600, 10);
    const min =
      parseInt((seconds % 3600) / 60, 10) < 10
        ? `0${parseInt((seconds % 3600) / 60, 10)}`
        : parseInt((seconds % 3600) / 60, 10);
    const sec = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;

    result = `${hour}:${min}:${sec}`;
    if (hour === '00') {
      result = `${min}:${sec}`;
    }
    return result;
  },

  // +82 xxx xxxx xxx 형식으로 변환 && 앞부분 0 제거
  phoneNoStr: (phoneNo, countryNo) => {
    const phoneStr = phoneNo
      .replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1 $2 $3')
      .replace(/(^0+)/, '');
    return `+${countryNo} ${phoneStr}`;
  },

  // HTML 태그 제거
  removeHTML: text => {
    const imgTag = /<IMG(.*?)>/gi;
    const result = text
      .replace(imgTag, '')
      .replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/gi, ' ');
    return result;
  },
  // yyyy-mm-dd => yyyy년 mm월 dd일
  changeDateString: dateString => {
    const date = dateString.split('-');
    return `${date[0]}년 ${date[1]}월 ${date[2]}일`;
  },
  checkMobile: () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      // if (process.env.REACT_APP_ENV_NAME !== 'local') {
      return true;
      // }
    }
    return false;
  },
  moveAppByDeeplink: () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      if (process.env.REACT_APP_ENV_NAME !== 'local') {
        // a 태그 생성
        const aTag = document.createElement('a');
        aTag.setAttribute('href', process.env.REACT_APP_REDIRECT_URL);
        // aTag.style.display = 'none'; // 화면에 보이지 않게 설정
        // document.body.appendChild(aTag);

        // a 태그를 클릭하여 링크를 실행
        aTag.click();

        // a 태그를 제거
        // document.body.removeChild(aTag);
        return true;
      }
    }
    return false;
  },
  // yyyyMMdd 형태의 데이터를 받아서 날짜 유효성 체크
  validDate: date => {
    // 입력 문자열의 길이가 8이 아니면 false 반환
    if (date.length !== 8) {
      return false;
    }

    // 숫자가 아닌 문자가 포함되어 있으면 false 반환
    // eslint-disable-next-line no-restricted-properties
    if (window.isNaN(date)) {
      return false;
    }

    const year = parseInt(date.substring(0, 4), 10);
    const month = parseInt(date.substring(4, 6), 10);
    const day = parseInt(date.substring(6, 8), 10);

    // 년도, 월, 일의 유효성 검사
    if (
      year < 1000 ||
      year > 9999 ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      return false;
    }

    // 각 월에 따른 일수 유효성 검사
    if (month === 4 || month === 6 || month === 9 || month === 11) {
      return day <= 30;
    }
    if (month === 2) {
      // 윤년 체크
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        return day <= 29;
      }
      return day <= 28;
    }
    return true;
  },
};

const dummyTerms =
  '개인정보보호법에 따라 네이버에 회원가입 신청하시는 분께 수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간, 동의 거부권 및 동의 거부 시 불이익에 관한 사항을 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.<br /><br />1. 수집하는 개인정보 이용자는 회원가입을 하지 않아도 정보 검색, 뉴스 보기 등 대부분의 네이버 서비스를 회원과 동일하게 이용할 수 있습니다.<br /><br />개인정보보호법에 따라 네이버에 회원가입 신청하시는 분께 수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간, 동의 거부권 및 동의 거부 시 불이익에 관한 사항을 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.<br /><br />1. 수집하는 개인정보 이용자는 회원가입을 하지 않아도 정보 검색, 뉴스 보기 등 대부분의 네이버 서비스를 회원과 동일하게 이용할 수 있습니다.<br /><br />개인정보보호법에 따라 네이버에 회원가입 신청하시는 분께 수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간, 동의 거부권 및 동의 거부 시 불이익에 관한 사항을 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.<br /><br />1. 수집하는 개인정보 이용자는 회원가입을 하지 않아도 정보 검색, 뉴스 보기 등 대부분의 네이버 서비스를 회원과 동일하게 이용할 수 있습니다.<br /><br />개인정보보호법에 따라 네이버에 회원가입 신청하시는 분께 수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간, 동의 거부권 및 동의 거부 시 불이익에 관한 사항을 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.<br /><br />1. 수집하는 개인정보 이용자는 회원가입을 하지 않아도 정보 검색, 뉴스 보기 등 대부분의 네이버 서비스를 회원과 동일하게 이용할 수 있습니다.';

export default utils;
