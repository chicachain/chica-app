/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-danger */
/** @jsxImportSource @emotion/react */
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { css } from '@emotion/react';
import { useTranslation } from 'react-i18next';

function SmallModal({
  title,
  text,
  show,
  onHide,
  submit,
  btnText,
  btnList,
  ...rest
}) {
  return (
    <Modal show={show} onHide={onHide} centered css={smallModal} {...rest}>
      {/* 헤더 */}
      <Modal.Header className="m-auto">
        <Modal.Title>{title || '알림'}</Modal.Title>
      </Modal.Header>

      {/* 바디 */}
      <Modal.Body>
        <p dangerouslySetInnerHTML={{ __html: text }} />
      </Modal.Body>

      {/* 푸터 */}
      <Modal.Footer className="btn-area w-100">
        {btnList ? (
          btnList.map((btn, idx) => {
            return (
              <Button
                key={`small-btn-${idx}}`}
                variant={btn.variant || 'primary'}
                onClick={btn.onClick || onHide}
                size="lg"
              >
                {btn.text}
              </Button>
            );
          })
        ) : (
          <Button size="lg" onClick={submit || onHide}>
            {btnText || '확인'}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

const smallModal = css`
  .modal-dialog {
    .modal-content {
      .modal-header {
        padding: 1rem;
      }
      .modal-body {
        p {
          text-align: center;
          font-weight: 300;
        }
      }
    }
  }
`;

export default SmallModal;
