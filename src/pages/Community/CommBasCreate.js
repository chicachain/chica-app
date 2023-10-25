/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useRef, useEffect, useState } from 'react';
import { Container, Form, Button, Image, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
// Custom Component
import 'swiper/swiper-bundle.css';
import { toast } from 'react-toastify';
import { handleError } from '../../common/utils/HandleError';
import SHOP_TYPES from '../../common/constants/ShopTypes';
import { saveFeed } from '../../api/community/feed';

// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function CommBasCreate(props) {
  const history = useHistory();
  const addFileRef = useRef();

  const [modalShow, setModalShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({
    type: 'Select',
    name: '선택',
  });
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [addFiles, setAddFiles] = useState([]);
  const [fileImages, setFileImages] = useState([]);
  const [options, setOptions] = useState();

  /**
   * api
   */
  const basicWrite = async e => {
    const { target } = e;
    target.disabled = true;
    try {
      const params = {
        category: selectedCategory.type,
        title,
        comment,
      };
      const formData = new FormData();
      const json = JSON.stringify(params);
      const blob = new Blob([json], { type: 'application/json' });
      formData.append('dto', blob);
      if (addFiles.length > 0) {
        for (const addFile of addFiles) {
          formData.append('files', addFile);
        }
      }
      const { data } = await saveFeed(formData);
      history.goBack();
    } catch (error) {
      handleError(error);
    }
  };

  const clickModal = () => {
    setModalShow(true);
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

  const removeFile = (fileId, index) => {
    fileImages.splice(index, 1);
    addFiles.splice(index, 1);
    setFileImages([...fileImages]);
    setAddFiles([...addFiles]);
  };

  const handleCategorySelect = category => {
    setSelectedCategory(category);
    setModalShow(false); // 모달을 닫습니다.
  };

  const handleImageChange = e => {
    if (addFiles.length < 5) {
      if (e.target.files && e.target.files[0]) {
        const render = new FileReader();

        render.onload = event => {
          setFileImages(prev => [...prev, event.target.result]);
          setAddFiles(prev => [...prev, e.target.files[0]]);
          e.target.value = null;
        };
        render.readAsDataURL(e.target.files[0]);
      }
    } else {
      toast('사진은 5개까지만 업로드가 가능합니다.');
    }
  };

  /**
   * useEffect
   */
  useEffect(() => {
    initialOptions();
  }, []);

  return (
    <main id="community-create">
      <header>
        <Container>
          <div className="header-flex">
            <i
              className="material-icons"
              onClick={() => {
                history.goBack();
              }}
            >
              arrow_back
            </i>
            <h6>커뮤니티 글쓰기</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="categori-box">
          <p className="categori-text">카테고리</p>
          <div className="categori-menu" onClick={clickModal}>
            <p>{selectedCategory.name || '선택'}</p>
            <i className="material-icons">expand_more</i>
          </div>
        </div>

        <div className="create-title">
          <Form.Control
            type="text"
            placeholder="제목을 입력하세요."
            value={title || ''}
            onChange={e => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div className="create-body">
          <Form.Control
            as="textarea"
            rows={10}
            placeholder="고객 님의 따뜻한 리뷰가 큰 힘이 됩니다. "
            value={comment || ''}
            style={{ resize: 'none' }}
            onChange={e => {
              setComment(e.target.value);
            }}
          />
        </div>
        <div className="create-footer">
          <Button
            className="pic-btn"
            onClick={() => {
              addFileRef.current?.click();
            }}
          >
            <Image src={images.IcCameraBlack} />
            사진 ({addFiles.length}/5)
          </Button>
          <Form.Control
            className="d-none"
            ref={addFileRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {fileImages &&
            fileImages.length > 0 &&
            fileImages.map((item, index) => {
              return (
                <div className="photo-imgbox" key={index}>
                  <Image src={item.fileUrl || item} className="photo-img" />
                  <Image
                    src={images.IcDeleteBlack}
                    className="photo-del"
                    onClick={() => removeFile(null, index)}
                  />
                </div>
              );
            })}
        </div>
      </Container>
      <div className="btn-area fix-bottom place-footerbtn">
        <Button
          disabled={!(selectedCategory.name !== '선택' && title && comment)}
          onClick={e => {
            if (window.confirm('게시글을 등록하시겠습니까?')) {
              basicWrite(e);
            }
          }}
        >
          작성완료
        </Button>
      </div>
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
                    onClick={() => handleCategorySelect(result)}
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
