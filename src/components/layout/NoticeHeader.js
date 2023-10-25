/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

function NoticeHeader({ title, onClickBtn, isCloseBtn, noBtn, opacity }) {
  const history = useHistory();
  const location = useLocation();

  const handleBackButtonClick = () => {
    if (onClickBtn) {
      onClickBtn();
    } else {
      const currentPath = location.pathname;
      if (currentPath.includes('/myinfo/notice/detail')) {
        history.push('/myinfo/notice');
      } else if (currentPath.includes('/myinfo/notice')) {
        history.push('/myinfo');
      } else {
        history.goBack();
      }
    }
  };

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
      }}
    >
      <Container>
        <div className="header-flex">
          <Button
            variant="icon"
            id="btn-back"
            onClick={handleBackButtonClick}
          />
          <h2 className="ellipsis">{title || ''}</h2>
        </div>
      </Container>
    </header>
  );
}

export default NoticeHeader;
