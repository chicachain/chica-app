import { useCallback } from 'react';
// 미완
const commonHandler = () => console.log('공통 처리 로직 필요');
const defaultHandler = () => console.log('어디에도 정의되지않은 에러');
const handler401 = () => console.log('401 처리 로직 필요');
const handler403 = () => console.log('403 처리 로직 필요');
const handler40910001 = () => console.log('409 -> 1001 처리 로직 필요');
const handler40910002 = () => console.log('409 -> 1002 처리 로직 필요');
const handler500 = () => console.log('500 처리 로직 필요');

const defaultHandlers = {
  common: commonHandler,
  default: defaultHandler,
  401: {
    default: handler401,
  },
  403: {
    default: handler403,
  },
  409: {
    10001: handler40910001,
    10002: handler40910002,
  },
  500: {
    default: handler500,
  },
};
// 매개변수 handlers: 컴포넌트에서 재정의한 핸들러 모음 매개변수로 커스텀 가능

/*
custom 예시

const errorHandler40910001 = () => {
  // 컴포넌트의 상황에 맞게 처리 로직을 작성
}
// HTTP Status가 500일 때 실행할 핸들러 함수
const errorHandler500 = () => {
	// 컴포넌트의 상황에 맞게 처리 로직을 작성
}

const { handleError } = useApiError({
	409: {
		10001: errorHandler40910001,
	},
	500: {
		default: errorHandler500,
	},
});

const { isLoading, error, data, isFetching } = useQuery('key', fetchData, {
  onError: handleError,
});
*/
export const useApiError = handlers => {
  // 우선순위에 따른 핸들러의 선택과 실행
  const handleError = useCallback(
    error => {
      const httpStatus = error.response.status; // HTTP Status
      const serviceCode = error.response.meta.code; // 서비스 표준 에러 Code
      switch (true) {
        case handlers && handlers[httpStatus][serviceCode]:
          // 우선순위 1. 컴포넌트에서 (HTTP Status, 서비스 표준 에러 Code) Key 조합으로 재정의한 핸들러
          handlers[httpStatus][serviceCode]();
          break;
        case handlers && handlers[httpStatus]:
          // 우선순위 2. 컴포넌트에서 (HTTP Status) Key로 재정의한 핸들러
          handlers[httpStatus].default();
          break;
        case defaultHandlers[httpStatus][serviceCode]:
          // 우선순위 3. Hook에서 (HTTP Status, 서비스 표준 에러 Code) Key 조합으로 정의한 핸들러
          defaultHandlers[httpStatus][serviceCode]();
          break;
        case defaultHandlers[httpStatus]:
          // 우선순위 4. Hook에서 (HTTP Status) Key로 정의한 핸들러
          defaultHandlers[httpStatus].default();
          break;
        default:
          // 우선순위 5. 어디에서도 정의되지 못한 에러를 처리하는 핸들러
          defaultHandlers.default();
      }

      // 공통 처리 로직 수행
      defaultHandlers.common();
    },
    [handlers],
  );

  // ...
  return { handleError };
};
