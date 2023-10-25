/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Button, Image, Form, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
import 'swiper/swiper-bundle.css';

// Custom Component
import { Navi, CustomSelect } from '@components';

export default React.memo(function UserFollower(props) {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('follower');

  const handleTabClick = tabName => {
    setActiveTab(tabName);
  };
  return (
    <main id="user-follower">
      <header>
        <Container>
          <div className="header-flex">
            <i className="material-icons">arrow_back</i>
            <h6>USER-NAME</h6>
          </div>
        </Container>
      </header>
      {/* 컨텐츠 */}
      <Container className="container-custom">
        <div className="tab-menu">
          <Button
            onClick={() => handleTabClick('follower')}
            className={activeTab === 'follower' ? 'active' : ''}
          >
            팔로워 <span>123</span>
          </Button>
          <Button
            onClick={() => handleTabClick('following')}
            className={activeTab === 'following' ? 'active' : ''}
          >
            팔로잉 <span>123</span>
          </Button>
        </div>
        <div className="tab-content">
          {activeTab === 'follower' && <FollowerContent />}
          {activeTab === 'following' && <FollowingContent />}
        </div>
      </Container>
    </main>
  );
});
function FollowerContent() {
  return (
    <div className="follower-box">
      <div className="follower-search">
        <Image src={images.IcSerachBlack} />
        <Form.Control type="text" placeholder="검색" />
      </div>
      <div className="follower-line">
        <div className="follower-flex-one">
          <Image src={images.ReviewProfile} className="profile" />
          <div>
            <p className="user-name">user-name</p>
            <p className="plce-name">플레이스명</p>
          </div>
        </div>
        <div className="follower-flex-two">
          <Button>팔로우</Button>
        </div>
      </div>
      <div className="follower-line">
        <div className="follower-flex-one">
          <Image src={images.ReviewProfile} className="profile" />
          <div>
            <p className="user-name">user-name</p>
            <p className="plce-name">플레이스명</p>
          </div>
        </div>
        <div className="follower-flex-two">
          <Button>팔로우</Button>
        </div>
      </div>
      <div className="follower-line">
        <div className="follower-flex-one">
          <Image src={images.ReviewProfile} className="profile" />
          <div>
            <p className="user-name">user-name</p>
            <p className="plce-name">플레이스명</p>
          </div>
        </div>
        <div className="follower-flex-two">
          <Button>팔로우</Button>
        </div>
      </div>
      <div className="follower-line">
        <div className="follower-flex-one">
          <Image src={images.ReviewProfile} className="profile" />
          <div>
            <p className="user-name">user-name</p>
            <p className="plce-name">플레이스명</p>
          </div>
        </div>
        <div className="follower-flex-two">
          <Button>팔로우</Button>
        </div>
      </div>
    </div>
  );
}
function FollowingContent() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingtwo, setIsFollowingTwo] = useState(false);
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };
  const toggleFollowTwo = () => {
    setIsFollowingTwo(!isFollowingtwo);
  };
  return (
    <div className="follower-box">
      <div className="follower-search">
        <Image src={images.IcSerachBlack} />
        <Form.Control type="text" placeholder="검색" />
      </div>
      <div className="follower-line">
        <div className="follower-flex-one">
          <Image src={images.ReviewProfile} className="profile" />
          <div>
            <p className="user-name">user-name</p>
            <p className="plce-name">플레이스명</p>
          </div>
        </div>
        <div className="follower-flex-two">
          {isFollowing ? (
            <Button variant="outline-primary" onClick={toggleFollow}>
              팔로잉
            </Button>
          ) : (
            <Button onClick={toggleFollow}>팔로우</Button>
          )}
        </div>
      </div>
      <div className="follower-line">
        <div className="follower-flex-one">
          <Image src={images.ReviewProfile} className="profile" />
          <div>
            <p className="user-name">user-name</p>
            <p className="plce-name">플레이스명</p>
          </div>
        </div>
        <div className="follower-flex-two">
          {isFollowingtwo ? (
            <Button variant="outline-primary" onClick={toggleFollowTwo}>
              팔로잉
            </Button>
          ) : (
            <Button onClick={toggleFollowTwo}>팔로우</Button>
          )}
        </div>
      </div>
      <div className="follower-line">
        <div className="follower-flex-one">
          <Image src={images.ReviewProfile} className="profile" />
          <div>
            <p className="user-name">user-name</p>
            <p className="plce-name">플레이스명</p>
          </div>
        </div>
        <div className="follower-flex-two">
          <Button>팔로우</Button>
        </div>
      </div>
      <div className="follower-line">
        <div className="follower-flex-one">
          <Image src={images.ReviewProfile} className="profile" />
          <div>
            <p className="user-name">user-name</p>
            <p className="plce-name">플레이스명</p>
          </div>
        </div>
        <div className="follower-flex-two">
          <Button>팔로우</Button>
        </div>
      </div>
    </div>
  );
}
