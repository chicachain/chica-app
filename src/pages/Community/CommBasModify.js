/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useRef, useState } from 'react';
import { Container, Form, Button, Image, Modal } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { images } from '@assets';

// API
import { getFeedDetail, modifyFeed } from '@api/community/feed';

// Custom Component
import { handleError } from '../../common/utils/HandleError';

// Constant
import SHOP_TYPES from '../../common/constants/ShopTypes';

// 초기 피드 상세 정보
const initialFeedDetail = {
  category: '',
  comment: '',
  commentCnt: '',
  feedId: '',
  files: [],
  likeCnt: 0,
  mbId: '',
  mbNm: '',
  menuNm: '',
  profileNm: '',
  profileUrl: '',
  rating: 0,
  regDate: '',
  resvCnt: 0,
  resvId: '',
  reviewCnt: 0,
  shopId: '',
  shopNm: '',
  staffId: '',
  staffNm: '',
  title: '',
  viewCnt: 0,
  resvDate: '',
};

// ===================================================================
// [ 커뮤니티 > 글쓰기 > 일반 > 수정 ]
// ===================================================================
export default React.memo(function CommBasModify(props) {
  const history = useHistory();

  const { feedId } = useParams();

  const addFileRef = useRef();

  // ===================================================================
  // [ State ]
  // ===================================================================

  const [modalShow, setModalShow] = useState(false); // 카테고리 선택 모달 스위치
  const [feedDetail, setFeedDetail] = useState(initialFeedDetail); // 피드 상세
  const [feedFiles, setFeedFiles] = useState([]); // 첨부파일
  const [removeFiles, setRemoveFiles] = useState([]); // 삭제 요청 첨부파일
  const [options, setOptions] = useState();

  // ===================================================================
  // [ Util ]
  // ===================================================================

  // Open 카테고리 선택 모달
  const clickModal = () => {
    setModalShow(true);
  };

  // 카테고리 선택 이벤트
  const categorySelectHandler = category => {
    // '왁싱' Only
    if (category !== SHOP_TYPES.Waxing.type) {
      toast('준비중입니다.');
      return;
    }

    setFeedDetail({
      ...feedDetail,
      category,
    });

    setModalShow(false); // 모달을 닫습니다.
  };

  // 첨부파일 삭제
  const removeFile = index => {
    const removeFileId = feedFiles[index].fileId;
    removeFiles.push(removeFileId);
    setRemoveFiles([...removeFiles]);

    const filteredList = feedFiles.filter((file, idx) => idx !== index);
    setFeedFiles([...filteredList]);
  };

  // 첨부파일 추가
  const addFile = files => {
    // 5개 제한
    if (feedFiles.length + files.length > 5) {
      toast('최대 5개까지 파일만 등록할 수 있습니다.');
      return;
    }

    setFeedFiles([...feedFiles, ...files]);
  };

  // 파일 미리보기 ( Input File )
  const readURL = (id, file) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      document.getElementById(id).src = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  const initialOptions = () => {
    setOptions(
      Object.values(SHOP_TYPES)
        .filter(item => {
          return item.type !== '';
        })
        .map(value => ({
          type: value.type,
          name: value.name,
        })),
    );
  };

  // ===================================================================
  // [ API ] 피드 상세 정보 가져오기
  // ===================================================================
  const getFeedInfo = async () => {
    try {
      const { data } = await getFeedDetail(feedId);

      if (data.code === 200) {
        const { data: feedInfo } = data;
        setFeedDetail(feedInfo);
        setFeedFiles([...feedInfo.files]);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  // ===================================================================
  // [ API ] 피드 수정
  // ===================================================================
  const confirmEdit = async () => {
    if (!feedDetail.category) {
      toast('카테고리를 선택해주세요.');
      return;
    }

    if (!feedDetail.title) {
      toast('제목을 입력해주세요.');
      return;
    }

    if (!feedDetail.comment) {
      toast('내용을 입력해주세요.');
      return;
    }

    try {
      // FormData
      const formData = new FormData();

      // JSON 파라미터
      const params = {
        feedId,
        category: feedDetail.category,
        title: feedDetail.title,
        comment: feedDetail.comment,
        removeFiles,
      };

      const json = JSON.stringify(params);
      const blob = new Blob([json], { type: 'application/json' });
      formData.append('dto', blob);

      // File 파라미터
      if (feedFiles.length > 0) {
        for (const file of feedFiles) {
          if (Object.getPrototypeOf(file) === File.prototype) {
            formData.append('files', file);
          }
        }
      }

      // Axios
      const { data } = await modifyFeed(formData);

      if (data.code === 200) {
        history.go(-1);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // ===================================================================
  // [ useEffect ]
  // ===================================================================
  useEffect(() => {
    // 잘못된 접근
    if (!feedId) {
      history.go(-1);
    }
    // 피드 정보 가져오기
    else {
      getFeedInfo();
      initialOptions();
    }
  }, []);

  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <main id="community-create">
      {/* 헤더 */}
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons" onClick={() => history.go(-1)}>
              arrow_back
            </i>
            <h6>커뮤니티 글 수정</h6>
          </div>
        </Container>
      </header>

      {/* 컨텐츠 */}
      <Container className="container-custom">
        {/* 카테고리 */}
        <div className="categori-box">
          <p className="categori-text">카테고리</p>
          <div className="categori-menu" onClick={clickModal}>
            <p>{feedDetail.category && SHOP_TYPES[feedDetail.category].name}</p>
            <i className="material-icons">expand_more</i>
          </div>
        </div>

        {/* 타이틀 */}
        <div className="create-title">
          <Form.Control
            type="text"
            placeholder="제목을 입력하세요."
            value={feedDetail.title}
            onChange={e =>
              setFeedDetail({
                ...feedDetail,
                title: e.target.value,
              })
            }
          />
        </div>

        {/* 내용 */}
        <div className="create-body">
          <Form.Control
            as="textarea"
            rows={10}
            placeholder="고객 님의 따뜻한 리뷰가 큰 힘이 됩니다. "
            value={feedDetail.comment}
            onChange={e =>
              setFeedDetail({
                ...feedDetail,
                comment: e.target.value,
              })
            }
          />
        </div>

        {/* 첨부파일 */}
        <div className="create-footer">
          {/* Input - Button */}
          <Button
            className="pic-btn"
            onClick={() => {
              addFileRef.current?.click();
            }}
          >
            <Image src={images.IcCameraBlack} />
            {`사진 (${feedFiles.length}/5)`}
          </Button>

          {/* Input - Hidden */}
          <Form.Control
            className="d-none"
            ref={addFileRef}
            type="file"
            accept="image/*"
            onChange={e => addFile(e.target.files)}
            multiple
          />

          {/* 리스트 */}
          {feedFiles.length > 0 &&
            feedFiles.map((file, index) => {
              return (
                <div className="photo-imgbox" key={`file-list-${index}`}>
                  <Image
                    id={`file-img-${index}`}
                    src={file.fileUrl || readURL(`file-img-${index}`, file)}
                    className="photo-img"
                  />
                  <Image
                    src={images.IcDeleteBlack}
                    className="photo-del"
                    onClick={() => removeFile(index)}
                  />
                </div>
              );
            })}
        </div>
      </Container>

      {/* 작성완료 */}
      <div className="btn-area fix-bottom place-footerbtn">
        <Button
          onClick={() => {
            if (window.confirm('수정을 완료하시겠습니까?')) {
              confirmEdit();
            }
          }}
          disabled={
            !feedDetail.category || !feedDetail.title || !feedDetail.comment
          }
        >
          작성완료
        </Button>
      </div>

      {/* 카테고리 선택 모달 */}
      <Modal
        size="sm"
        show={modalShow}
        onHide={() => setModalShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
        id="bas-modal"
      >
        <Modal.Body>
          {options &&
            options.map((result, index) => {
              return (
                <div className="modal-body-gridline" key={index}>
                  <Button
                    className="modal-btn"
                    onClick={() => categorySelectHandler(result.type)}
                    disabled={result.name !== '왁싱'}
                  >
                    {`${result.name}`}
                  </Button>
                </div>
              );
            })}
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </main>
  );
});
