/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useRef, useState } from 'react';
import { Container, Form, Button, Image, Modal } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { images } from '@assets';
// Custom Component
import { Navi, MainHeader, CustomModal } from '@components';
import 'swiper/swiper-bundle.css';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { toast } from 'react-toastify';
import WeeklyCalendar from '../../components/WeekCalander';
import { handleError } from '../../common/utils/HandleError';
import { getFeedDetail, modifyFeed } from '../../api/community/feed';

// SwiperCore 모듈에 Navigation과 Pagination 추가
SwiperCore.use([Navigation, Pagination]);
// 초기 페이징 정보
const initialPagingInfo = {
  pageNo: 1,
  pageSize: 20,
};

// ===================================================================
// [ 아이템 현황 ]
// ===================================================================
export default React.memo(function CommModify(props) {
  const history = useHistory();
  const { feedId } = useParams();
  const addFileRef = useRef();

  /**
   * state
   */
  const [starStatuses, setStarStatuses] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [feedDetail, setFeedDetail] = useState({});
  const [comment, setComment] = useState('');
  const [reviewFiles, setReviewFiles] = useState([]);
  const [addFiles, setAddFiles] = useState([]);
  const [fileImages, setFileImages] = useState([]);
  const [removeFiles, setRemoveFiles] = useState([]);

  /**
   * api
   */
  const getFeed = async () => {
    try {
      const { data } = await getFeedDetail(feedId);
      setFeedDetail(data.data);
      getStarList(window.parseInt(data.data.rating));
      setComment(data.data.comment);
      setReviewFiles(data.data.files || []);
    } catch (error) {
      handleError(error);
    }
  };

  const feedModify = async e => {
    const { target } = e;
    target.disabled = true;
    try {
      const params = {
        feedId,
        resvId: feedDetail.resvId,
        category: feedDetail.category,
        rating: getRatingCnt(),
        title: feedDetail.title,
        comment,
        removeFiles,
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
      const { data } = await modifyFeed(formData);
      history.goBack();
    } catch (error) {
      handleError(error);
    }
    target.disabled = false;
  };

  /**
   * event
   */
  const handleClick = index => {
    // 클릭한 별 이미지의 상태를 토글합니다.
    getStarList(index + 1);
  };

  const removeFile = (fileId, index) => {
    if (fileId) {
      setRemoveFiles(prev => [...prev, fileId]);
      setReviewFiles(prev => [...prev.filter(item => item.fileId !== fileId)]);
    } else {
      fileImages.splice(index, 1);
      addFiles.splice(index, 1);
      setFileImages([...fileImages]);
      setAddFiles([...addFiles]);
    }
  };

  const handleImageChange = e => {
    if (reviewFiles.length + addFiles.length < 5) {
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

  /**
   * useEffect
   */
  useEffect(() => {
    getFeed();
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
              close
            </i>
            <h6>{feedDetail.shopNm}</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="rating-box">
          <h6 className="title">리뷰 점수</h6>
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
            <Image src={fileImages.IcCameraBlack} />
            사진 ({reviewFiles.length + addFiles.length}/5)
          </Button>
          <Form.Control
            className="d-none"
            ref={addFileRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {reviewFiles &&
            reviewFiles.length > 0 &&
            reviewFiles.map((item, index) => {
              return (
                <div className="photo-imgbox" key={index}>
                  <Image src={item.fileUrl || item} className="photo-img" />
                  <Image
                    src={images.IcDeleteBlack}
                    className="photo-del"
                    onClick={() => removeFile(item.fileId, index)}
                  />
                </div>
              );
            })}
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
            if (window.confirm('수정을 완료하시겠습니까?')) {
              feedModify(e);
            }
          }}
        >
          수정
        </Button>
      </div>
    </main>
  );
});
