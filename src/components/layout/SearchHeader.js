/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-array-index-key */
/** @jsxImportSource @emotion/react */
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { images } from '@assets';
import { css } from '@emotion/react';

function SearchHeader({ onHide, onClick }) {
  const history = useHistory();

  const [searchKeyword, setSearchKeyword] = useState('');
  const searchKeywordRef = useRef();

  const onClickSearchBox = () => {
    if (onClick) {
      onClick();
      searchKeywordRef.current.focus();
    }
  };
  const resetSearchKeyword = () => {
    setSearchKeyword('');
    searchKeywordRef.current.focus();
  };
  const closeSearchModal = () => {
    if (onHide) {
      onHide();
    } else {
      history.goBack();
    }
    setTimeout(() => {
      setSearchKeyword('');
    }, 200);
  };

  return (
    <header>
      <Container
        style={{
          justifyContent: 'flex-start',
          paddingLeft: 64,
        }}
      >
        <Button
          variant="icon"
          id="btn-back"
          onClick={() => closeSearchModal()}
        />

        <div className="search-box" onClick={() => onClickSearchBox()}>
          <Button variant="icon" className="search" as="i" />
          <Form.Control
            placeholder="검색어를 입력하세요."
            value={searchKeyword}
            onChange={e => {
              setSearchKeyword(e.target.value);
            }}
            ref={searchKeywordRef}
          />
          {searchKeyword !== '' && (
            <Button
              variant="icon"
              className="delete-input"
              onClick={() => resetSearchKeyword()}
            />
          )}
        </div>
      </Container>
    </header>
  );
}
export default SearchHeader;
