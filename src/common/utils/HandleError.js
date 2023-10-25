import { toast } from 'react-toastify';
import RESULT_CODE from '../constants/ResultCode';
import customSwal from '../../components/CustomSwal';
import CustomException from '../exceptions/CustomException';

const defaultProcess = errMessage => {
  toast(errMessage);
  // customSwal.fire({
  //   html: errMessage,
  // });
};

// eslint-disable-next-line default-param-last
export const handleError = (error, process = defaultProcess, obj) => {
  switch (true) {
    case error instanceof CustomException:
      process(error.message, obj);
      break;
    default:
      console.log('handleError error :: ', error);
      process(RESULT_CODE.CODE_500, obj);
  }
};
