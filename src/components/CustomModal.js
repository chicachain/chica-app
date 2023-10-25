import React from 'react';
import { Button, Modal } from 'react-bootstrap';

// ===================================================================
// [ 커스텀 모달 ]
// ===================================================================
function CustomModal({
  headerText = '알림', // 타이틀 텍스트
  contentText = '', // 본문 텍스트
  confirmBtnText = 'Remove', // 확인 버튼 텍스트
  headerDisplay = true,
  messageOnly = true, // 메세지 모달 옵션
  display = false, // 출력 여부
  onHide, // 취소 버튼
  onConfirm, // 확인 버튼
}) {
  // ===================================================================
  // [ Return ]
  // ===================================================================
  return (
    <Modal
      size="sm"
      show={display}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-sm"
      id="custom-modal"
    >
      {/* 확인 모달 - 헤더 */}
      {headerDisplay && (
        <Modal.Header>
          <Modal.Title>{headerText}</Modal.Title>
        </Modal.Header>
      )}

      {/* 확인 모달 - 바디 */}
      <Modal.Body>{contentText}</Modal.Body>

      {/* 확인 모달 - 버튼 */}
      <Modal.Footer className={`${!messageOnly && 'btn-flex'} space-around`}>
        {/* 취소 */}
        <Button
          className="cancle-btn"
          onClick={onHide}
          style={{ display: messageOnly && 'none' }}
        >
          Cancel
        </Button>

        {/* 확인 */}
        <Button
          className={messageOnly ? `default-btn` : `check-btn`}
          onClick={onConfirm || onHide}
        >
          {confirmBtnText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomModal;
