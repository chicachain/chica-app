/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

function Header({ title, onClickBtn, isCloseBtn, noBtn, opacity }) {
  const history = useHistory();

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
            onClick={
              onClickBtn
                ? () => onClickBtn()
                : () => {
                    history.goBack();
                  }
            }
          />
          <h2 className="ellipsis" style={{ pointerEvents: 'none' }}>
            {title || ''}
          </h2>
        </div>
      </Container>
    </header>
  );
}

export default Header;
