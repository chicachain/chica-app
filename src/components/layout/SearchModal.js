/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-array-index-key */
/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Container, Dropdown, Button, ListGroup } from 'react-bootstrap';
import { images } from '@assets';
import { SearchHeader } from '@components';
import { css } from '@emotion/react';
import classNames from 'classnames';

function SearchModal({ noHeader, onHide, ...rest }) {
  const history = useHistory();
  const [recentKeywords, setRecentKeywords] = useState(dummyRecentKeywords);

  return (
    <Modal
      size="fullscreen"
      css={modal}
      className={classNames({ 'no-header': noHeader })}
      {...rest}
    >
      {/* 검색창 */}
      {!noHeader && <SearchHeader onHide={onHide} />}

      {/* 최근 검색어 */}
      <Modal.Body className="p-0">
        <div className="title">
          <h6>최근 검색어</h6>
          <Button variant="text">모두 지우기</Button>
        </div>
        <Container className="scroll">
          {recentKeywords.length > 0 ? (
            <ListGroup as="ul" id="list-recent">
              {recentKeywords.map((item, index) => {
                return (
                  <Dropdown.Item
                    as="li"
                    key={`recent-${index + 1}`}
                    onClick={() => history.push(`/list/search/${item}`)}
                  >
                    <Button variant="icon" as="span" />
                    <strong>{item}</strong>
                    <Button variant="icon" className="delete" />
                  </Dropdown.Item>
                );
              })}
            </ListGroup>
          ) : (
            <p className="py-3 no-data">최근 검색어가 없습니다.</p>
          )}
        </Container>
      </Modal.Body>
    </Modal>
  );
}
const modal = css`
  &.no-header {
    height: calc(100% - 64px);
    top: 64px;
    .modal-content {
      padding-top: 0 !important;
    }
  }
  .modal-body {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .title {
      padding: 1rem 1.25rem;
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      h6 {
        color: var(--bs-white);
        font-size: var(--fs-12);
        font-weight: 300;
        margin: 0;
      }
      .btn-text {
        font-size: var(--fs-10);
        color: var(--bs-secondary);
      }
    }
    .list-group {
      li {
        padding: 0.5rem 0;
        background: transparent;
        color: var(--bs-white);
        display: flex;
        align-items: center;
        span {
          flex-shrink: 0;
          padding: 0;
          width: 24px;
          background: url(${images.IcSearchGray}) no-repeat center / 24px auto;
        }
        strong {
          flex: 1;
          margin-left: 1rem;
          font-weight: 300;
          font-size: var(--fs-14);
          text-overflow: ellipsis;
          white-space: nowrap;
          word-wrap: normal;
          overflow: hidden;
          width: 100%;
        }
        .btn {
          &.delete {
            background: url(${images.IcDelete}) no-repeat center / 24px auto;
          }
        }
      }
    }
  }
`;

const dummyRecentKeywords = [
  '박은빈',
  '우영우',
  '이상한 변호사',
  '김태리',
  '스물하나 스물다섯',
  '이승은',
  '최민경',
  '신지애',
  '박승빈',
  '스라차차',
  '태리태리',
  '포션펀치',
  '버섯상점',
  '변신인간',
  '이상한 변호사 우영우',
  '거꾸로해도 우영우 똑바로해도 우영우 기러기 토마토 스위스 별똥별 역삼역',
  '마녀',
  '미남당',
  '마녀는 살아있다',
  '이브',
  '징크스의 연인',
  '환혼',
  '인사이더',
  '토르',
];

export default SearchModal;
