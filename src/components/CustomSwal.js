import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);
/*
icon : warning , success , info
*/
const CustomSwal = {
  alertSwal: props => {
    MySwal.fire({
      // ...props,
      title: props.title,
      text: props.text,
      icon: props.icon,
      confirmButtonColor: '#3085d6',
    }).then(result => {
      if (result.isConfirmed) {
        return props.then && props.then(result.isConfirmed);
      }
      return true;
    });
  },
  confirmSwal: props => {
    MySwal.fire({
      title: props.title,
      html: props.html,
      text: props.text,
      showCancelButton: props.cancel,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: props.confirmText ? props.confirmText : '확인',
      cancelButtonText: props.cancelText ? props.cancelText : '취소',
    }).then(result => {
      if (result.isConfirmed) {
        return props.then && props.then(result.isConfirmed);
      }
      return true;
    });
  },
  fire: props => {
    let allowEnterKey = true;
    if (typeof props.allowEnterKey !== 'undefined') {
      allowEnterKey = props.allowEnterKey;
    }
    MySwal.fire({
      title: props.title,
      text: props.text,
      icon: props.icon,
      html: props.html,
      showCancelButton: props.cancel,
      allowEnterKey,
      confirmButtonColor: '#28282B',
      // cancelButtonColor: '#FFF',
      confirmButtonText: props.confirmText ? props.confirmText : '확인',
      cancelButtonText: props.cancelText ? props.cancelText : '취소',
    })
      .then(result => {
        if (props.then && result.isConfirmed) {
          props.then(result);
        }
      })
      .finally(result => {
        if (props.finally) {
          props.finally(result);
        }
      });
  },
};
export default CustomSwal;
