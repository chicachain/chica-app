/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState, useRef } from 'react';
import { Container, Button, Image, Form, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
import 'swiper/swiper-bundle.css';
import { format } from 'date-fns';
import { Navi } from '@components';
// eslint-disable-next-line import/no-extraneous-dependencies
import DatePicker from 'react-mobile-datepicker';
import { getMyInfo, modifyMyInfo } from '../../api/member/userInfo';
import { handleError } from '../../common/utils/HandleError';
import RouterPath from '../../common/constants/RouterPath';
// Custom Component

export default React.memo(function MyPageEdit(props) {
  const history = useHistory();
  const [changeNick, setChangeNick] = useState('');
  const [changeName, setChangeName] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [time, setTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [changeGender, setChangeGender] = useState('');
  const [nowKeyword, setNowKeyword] = useState('');

  const keyword = () => {
    history.push({ pathname: RouterPath.keywordMenuEdit });
  };
  const pwdedit = () => {
    history.push({ pathname: RouterPath.pwdedit });
  };
  const mypage = () => {
    history.push({ pathname: RouterPath.mypage });
  };
  const clickmodal = () => {
    setIsOpen(true);
  };

  const imageRef = useRef();

  const handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();

      reader.onload = event => {
        setSelectedImage(event.target.result);
        setProfileImage(e.target.files[0]);
        e.target.value = null;
      };

      reader.readAsDataURL(e.target.files[0]);
    }
    modalClose();
  };
  const clickImg = () => {
    setModalShow(true); // 모달 표시 여부 업데이트
  };
  const modalClose = () => {
    setModalShow(false);
  };

  const getMyDetail = async () => {
    try {
      const { data } = await getMyInfo();
      setUserDetail(data.data);
      if (data.data.keywordList.length > 0) {
        setNowKeyword(data.data.keywordList[0].keywordNm);
      } else {
        setNowKeyword('없음');
      }
      setChangeName(data.data.mbNm);
      setChangeGender(data.data.gender);
      setTime(new Date(data.data.birthday));
    } catch (error) {
      handleError(error);
    }
  };

  const saveMyDetail = async () => {
    if (
      !(
        profileImage === '' &&
        changeNick === '' &&
        changeName === userDetail.mbNm &&
        changeGender === userDetail.gender &&
        format(time, 'yyyy-MM-dd') === userDetail.birthday
      )
    ) {
      try {
        const params = {
          mbNm: changeName,
          nickname: changeNick === '' ? userDetail.nickname : changeNick,
          gender: changeGender,
          birthday: format(time, 'yyyy-MM-dd'),
        };
        const formData = new FormData();
        const json = JSON.stringify(params);
        const blob = new Blob([json], { type: 'application/json' });
        formData.append('dto', blob);
        formData.append('file', profileImage);

        const { data } = await modifyMyInfo(formData);
        history.push({ pathname: RouterPath.mypage });
      } catch (error) {
        handleError(error);
      }
    }
  };

  // eslint-disable-next-line no-shadow
  const handleSelect = time => {
    setTime(time);
    setIsOpen(false);
  };

  useEffect(() => {
    getMyDetail();
  }, []);
  return (
    <main id="mypage-edit">
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons" onClick={() => mypage()}>
              arrow_back
            </i>
            <h6>프로필 편집</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="top-profile-edit">
          <div className="profile-imgbox">
            <Image
              src={
                selectedImage !== null
                  ? selectedImage
                  : userDetail.profileUrl !== null
                  ? userDetail.profileUrl
                  : images.ProfileImg
              }
              className="profile-img"
            />
            <Image
              src={images.icPlusBtn}
              className="plus-btn"
              onClick={clickImg}
            />
          </div>
          <div className="nickname-box">
            <p className="id">{userDetail.loginId}</p>
            <p className="nickname">{userDetail.nickname}</p>
            <Form.Control
              type="text"
              placeholder="닉네임을 등록해주세요."
              className="nickname-add"
              defaultValue=""
              onChange={e => setChangeNick(e.target.value)}
            />
          </div>
        </div>
        <div className="member-info">
          <div className="member-box">
            <p className="member-title">회원정보</p>
            <p className="esse">
              필수입력 <span>*</span>
            </p>
          </div>
          <div className="member-info-line">
            <p className="mi-title">
              이름 <span>*</span>
            </p>
            <input
              className="mi-text"
              type="text"
              name="username"
              spellCheck={false}
              style={{ border: 'none' }}
              defaultValue={userDetail.mbNm}
              onChange={e => setChangeName(e.target.value)}
            />
          </div>
          {/* <div className="member-info-line">
            <p className="mi-title">
              휴대폰 번호 <span>*</span>
            </p>
            <div className="phone-btnbox">
              <p className="mi-text">010-****-5678</p>
              <Button variant="outline-primary">연락처 변경</Button>
            </div>
          </div> */}
          <div className="member-info-line">
            <p className="mi-title">성별</p>
            <div className="gender-btnbox">
              <Button
                key={1}
                onClick={() => setChangeGender('W')}
                className={changeGender === 'W' ? 'active' : ''}
              >
                여성
              </Button>
              <Button
                key={2}
                onClick={() => setChangeGender('M')}
                className={changeGender === 'M' ? 'active' : ''}
              >
                남성
              </Button>
              <Button
                key={3}
                onClick={() => setChangeGender('N')}
                className={changeGender === 'N' ? 'active' : ''}
              >
                선택안함
              </Button>
            </div>
          </div>
          <div className="member-info-line">
            <p className="mi-title">생년월일</p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onClick={clickmodal}
            >
              <p className="mi-text">{format(time, 'yyyy년 M월 d일')}</p>
              <i className="material-icons">expand_more</i>
            </div>
          </div>
        </div>
        <div className="keyword-edit">
          <h6>추가 정보 – 나의 관심 뷰티키워드</h6>
          <div className="member-info-line">
            <p className="mi-title">관심 키워드</p>
            <div className="phone-btnbox">
              <p className="mi-text">{nowKeyword}</p>
              <Button variant="outline-primary" onClick={keyword}>
                키워드변경
              </Button>
            </div>
          </div>
        </div>
        {/* <div className="chica-urlbox">
          <Image src={images.ChicaUrl} />
          <div className="font-url">
            <p className="friend-url">친구들에게 CHICA를 소개해보세요.</p>
            <p className="url">
              https://$CHICA_Domain URL/kr/n/$CHICA_User_SequenceID
            </p>
          </div>
          <Button variant="outline-primary">복사</Button>
        </div> */}
        <div className="btn-foot-line">
          {userDetail.loginType === 'EMAIL' ? (
            <Button variant="outline-primary" onClick={pwdedit}>
              비밀번호 변경
            </Button>
          ) : (
            <div />
          )}
          <Button
            disabled={
              profileImage === '' &&
              changeNick === '' &&
              changeName === userDetail.mbNm &&
              changeGender === userDetail.gender &&
              format(time, 'yyyy-MM-dd') === userDetail.birthday
            }
            onClick={() => {
              if (window.confirm('프로필을 변경하시겠습니까?')) {
                saveMyDetail();
              }
            }}
          >
            저장하기
          </Button>
        </div>
        <Modal
          size="sm"
          show={modalShow}
          onHide={() => setModalShow(false)}
          aria-labelledby="example-modal-sizes-title-sm"
          id="authnumber-modal"
        >
          <Modal.Body>
            <div className="modal-body-gridline">
              <Button
                className="modal-btn"
                onClick={() => {
                  imageRef.current?.click();
                }}
              >
                앨범에서 선택
              </Button>
              <Form.Control
                ref={imageRef}
                className="d-none"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="modal-body-gridline">
              <Button className="modal-btn" onClick={modalClose}>
                취소
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer />
        </Modal>
      </Container>
      <DatePicker
        value={time}
        isOpen={isOpen}
        onSelect={handleSelect}
        confirmText="확인"
        cancelText=""
        showCaption={false}
        showHeader
        showFooter
        customHeader={<h6 className="year-day-h6">생년월일을 선택하세요.</h6>}
      />
    </main>
  );
});
