/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useRef, useState } from 'react';
import { Container, Form, Button, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
// Custom Component
import 'swiper/swiper-bundle.css';
import { toast } from 'react-toastify';
import { handleError } from '../../common/utils/HandleError';
import { saveReview } from '../../api/community/feed';

// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function CommCreate(props) {
  const history = useHistory();
  const addFileRef = useRef();

  const state = history.location.state || {};

  const [starStatuses, setStarStatuses] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [comment, setComment] = useState('');
  const [addFiles, setAddFiles] = useState([]);
  const [fileImages, setFileImages] = useState([]);

  /**
   * api
   */
  const reviewWrite = async e => {
    const { target } = e;
    target.disabled = true;
    try {
      const params = {
        resvId: state.resvId,
        category: state.category,
        rating: getRatingCnt(),
        title: state.shopNm,
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
      const { data } = await saveReview(formData);
      toast('리뷰가 등록되었습니다.');
      history.goBack();
    } catch (error) {
      handleError(error);
    }
  };

  /**
   * function
   */
  const getStarList = (colorStarCnt = 0) => {
    let colorStar = colorStarCnt;
    if (colorStar > 5) colorStar = 5;
    const blankStar = 5 - colorStar;
    const starList = [];
    for (let cnt = 1; cnt <= colorStar; cnt += 1) {
      starList.push(true);
    }
    if (blankStar > 0) {
      for (let cnt = 1; cnt <= blankStar; cnt += 1) {
        starList.push(false);
      }
    }
    setStarStatuses(starList);
  };

  const getRatingCnt = () => {
    const startLength =
      starStatuses.filter(item => {
        return item;
      })?.length || '0';
    return startLength;
  };

  const removeFile = (fileId, index) => {
    if (fileId) {
      setRemoveFiles(prev => [...prev, fileId]);
    } else {
      fileImages.splice(index, 1);
      addFiles.splice(index, 1);
      setFileImages([...fileImages]);
      setAddFiles([...addFiles]);
    }
  };

  /**
   * event
   */
  const handleClick = index => {
    // 클릭한 별 이미지의 상태를 토글합니다.
    getStarList(index + 1);
  };

  const handleImageChange = e => {
    if (addFiles.length < 5) {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();

        reader.onload = event => {
          setFileImages(prev => [...prev, event.target.result]);
          setAddFiles(prev => [...prev, e.target.files[0]]);
          e.target.value = null;
        };

        reader.readAsDataURL(e.target.files[0]);
      }
    } else {
      toast('사진은 5개까지만 업로드가 가능합니다.');
    }
  };

  return (
    <main id="community-create">
      <header>
        <Container>
          <div className="header-flex">
            <i
              className="material-icons pointer"
              onClick={() => {
                history.goBack();
              }}
            >
              close
            </i>
            <h6>{state.shopNm}</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="rating-box">
          <h6 className="title">리뷰를 남겨주세요.</h6>
          <div className="rating-star">
            {starStatuses.map((status, index) => (
              <Image
                key={index}
                src={status ? images.IcStarFull : images.IcStarBasic}
                onClick={() => handleClick(index)}
              />
            ))}
          </div>
          <p className="select-p">
            {getRatingCnt() > 0 ? `${getRatingCnt()}점` : '선택하세요'}
          </p>
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
          disabled={!(getRatingCnt() > 0 && comment)}
          onClick={e => {
            if (window.confirm('리뷰를 등록하시겠습니까?')) {
              reviewWrite(e);
            }
          }}
        >
          작성완료
        </Button>
      </div>
    </main>
  );
});
