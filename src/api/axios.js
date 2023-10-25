import axios from 'axios';
import Swal from 'sweetalert2';
import CustomException from '../common/exceptions/CustomException';
import RouterPath from '../common/constants/RouterPath';

const baseURL = process.env.REACT_APP_API_URL;

/* ****************************************************** */
// HTTP URL, Request Header 설정
/* ****************************************************** */
const AXIOS = axios.create({
  baseURL,
  headers: {
    'Content-type': 'application/json',
  },
});

/* ****************************************************** */
// API > Header > Access Token 주입
/* ****************************************************** */
AXIOS.interceptors.request.use(
  async config => {
    const originalRequest = config;

    try {
      // 토큰 확인
      const accessToken = localStorage.getItem('access_token');

      // 토큰 주입
      if (accessToken) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch (err) {
      // console.log('Failed to set Access Token');
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

/* ****************************************************** */
// API > Resposne 전처리
/* ****************************************************** */
AXIOS.interceptors.response.use(
  //* OK
  response => {
    return response;
  },
  //* ERROR
  async error => {
    try {
      const { response, config } = error;
      const originalRequest = config;

      //* HTTP Status >= 400
      if (response.status >= 400) {
        if (response.data && response.data.message) {
          // 에러 코드 & 메세지
          const errorCode = `${response.data.code}`;
          let errorMessage = '';

          if (response.data.error) {
            errorMessage = `${response.data.error}<br />`;
          }

          errorMessage += `${response.data.message}`;

          /*
            토큰 만료 > 재발급

            1001 : 토큰이 만료 되었습니다.
          */
          if (String(response.data.code) === '1001') {
            try {
              // 리프레시 토큰 확인 > Authorization 설정
              const refreshToken = localStorage.getItem('refresh_token');
              axios.defaults.headers.common.Authorization = `Bearer ${refreshToken}`;

              // 재발급요청
              const { data } = await axios.get(
                `${baseURL}/api/v1/auth/refresh-token`,
              );

              // 재발급 토큰 주입
              localStorage.setItem('access_token', data.data.accessToken);

              return AXIOS(originalRequest);
            } catch (err) {
              // 에러 > 재로그인
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('mb_id');
              window.location.href = RouterPath.signIn; // 로그인 화면 이동
            }
          }

          /*
            토큰 오류 > 재로그인
           
            1002 : 권한 정보가 없는 토큰입니다.
            1003 : 자격 증명에 실패하였습니다.
            1004 : 로그인을 해주세요.
            1005 : 잘못된 토큰입니다.

            1008 : 접근 권한이 없습니다.
            1009 : 토큰 변환 중 오류가 발생했습니다.
          */
          const tokenNotValidErrorCodes = [
            '1002',
            '1003',
            '1004',
            '1005',

            // '1008',
            '1009',
          ];

          if (tokenNotValidErrorCodes.includes(errorCode)) {
            return Promise.reject(
              await Swal.fire({
                html: errorMessage,
                confirmButtonText: '확인',
              }).then(result => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('mb_id');

                window.location.href = RouterPath.signIn; // 로그인 화면 이동
              }),
            );
          }

          // /*
          //   기타 후처리 코드
          //
          //   1310 : KYC 인증을 완료해야 본인 계정 구매 아이템 승인신청이 가능합니다. 인증센터로 이동하시겠습니까?
          //   1317 : 지갑 인증을 완료해야 본인 계정 구매 아이템 승인신청이 가능합니다. 인증센터로 이동하시겠습니까?
          // */
          // const extraCareCodes = ['1310', '1317'];
          //
          // if (extraCareCodes.includes(response.data.code)) {
          //   return Promise.reject(response);
          // }

          /*
            에러 메세지 출력
          */
          //   Swal.fire({
          //     icon: 'warning',
          //     confirmButtonColor: '#161616',
          //     html: errorMessage,
          //     confirmButtonText: '확인',
          //   });
          // } else {
          //   Swal.fire({
          //     icon: 'error',
          //     confirmButtonColor: '#161616',
          //     html: '잘못된 요청입니다.',
          //     confirmButtonText: '확인',
          //   });
          return Promise.reject(new CustomException(errorMessage));
        }
      }
    } catch (err) {
      // console.log(err);
    }

    return Promise.reject(error);
  },
);

export default AXIOS;
