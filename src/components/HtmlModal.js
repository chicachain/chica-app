import React from 'react';
import { Button, Modal } from 'react-bootstrap';

// ===================================================================
// [ 커스텀 모달 ]
// ===================================================================
function HtmlModal({
  headerText = '알림', // 타이틀 텍스트
  contentHtml = '', // 본문 텍스트
  confirmBtnText = '확인', // 확인 버튼 텍스트
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
      id="custom-html-modal"
    >
      {/* 확인 모달 - 헤더 */}
      <Modal.Header>
        <Modal.Title>{headerText}</Modal.Title>
      </Modal.Header>

      {/* 확인 모달 - 바디 */}
      <Modal.Body>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </Modal.Body>

      {/* 확인 모달 - 버튼 */}
      <Modal.Footer>
        {/* 확인 */}
        <Button className="check-btn" onClick={onConfirm || onHide}>
          {confirmBtnText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default HtmlModal;
