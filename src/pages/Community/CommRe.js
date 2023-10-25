/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import 'swiper/swiper-bundle.css';
import { toast } from 'react-toastify';

// API
import { modifyComment } from '@api/community/feed';

// Constant
import RouterPath from '../../common/constants/RouterPath';

// ===================================================================
// [ 커뮤니티 > 피드 > 상세 > 댓글 > 수정 ]
// ===================================================================
export default React.memo(function CommCreate(props) {
  const history = useHistory();

  const idx = history.location.state?.idx; // 댓글 IDX
  const comment = history.location.state?.comment; // 댓글 내용
  const feedIdx = history.location.state?.feedIdx; // 피드 IDX

  // ===================================================================
  // [ State ]
  // ===================================================================

  const [commentInput, setCommentInput] = useState(comment); // 댓글 내용 입력

  // ===================================================================
  // [ API ] 댓글 수정
  // ===================================================================
  const modifyNewComment = async () => {
    if (!commentInput) {
      toast('댓글 내용이 입력되지 않았습니다.');
      return;
    }

    try {
      const { data } = await modifyComment({
        commentId: idx,
        comment: commentInput,
      });

      if (data.code === 200) {
        history.push({
          pathname: RouterPath.commdetail,
          state: feedIdx,
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  // ===================================================================
  // [ useEffect ]
  // ===================================================================

  // 잘못된 접근
  useEffect(() => {
    if (!idx || !feedIdx) {
      history.go(-1);
    }
  }, []);

  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <main id="community-re">
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons" onClick={() => history.go(-1)}>
              close
            </i>
            <h6>댓글수정</h6>
            <p className="comple" onClick={modifyNewComment}>
              완료
            </p>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <Form.Control
          as="textarea"
          rows={30}
          value={commentInput}
          onChange={e => setCommentInput(e.target.value)}
          maxLength={400}
        />
      </Container>
    </main>
  );
});
