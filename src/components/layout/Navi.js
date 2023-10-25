import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Nav, Image } from 'react-bootstrap';
import { images } from '@assets';
import RouterPath from '../../common/constants/RouterPath';
import { checkConnection } from '../../common/utils/Web3Util';
import CustomException from '../../common/exceptions/CustomException';
// ===================================================================
// [ Home Footer ]
// ===================================================================
export default React.memo(function Navi() {
  const isAuthorized = localStorage.getItem('access_token');
  const history = useHistory();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [homeSrc, setHomeSrc] = useState(images.naviHome);
  const [placeSrc, setPlaceSrc] = useState(images.naviPlace);
  const [messageSrc, setMessageSrc] = useState(images.naviMessage);
  const [personSrc, setPersonSrc] = useState(images.naviPerson);
  const handleNavClick = path => {
    setActiveLink(path);
    // history.push(path);
  };

  const HomeNavClick = () => {
    if (isAuthorized) {
      setHomeSrc(images.naviHomeOn);
      history.push({ pathname: RouterPath.home });
    } else {
      history.push({
        pathname: RouterPath.signIn,
        state: {
          goUrl: RouterPath.home,
        },
      });
    }
  };
  const PlaceNavClick = () => {
    if (isAuthorized) {
      setPlaceSrc(images.naviPlaceOn);
      history.push({ pathname: RouterPath.place });
    } else {
      history.push({
        pathname: RouterPath.signIn,
        state: {
          goUrl: RouterPath.place,
        },
      });
    }
  };
  const MessageNavClick = () => {
    if (isAuthorized) {
      setMessageSrc(images.naviMessageOn);
      history.push({ pathname: RouterPath.community });
    } else {
      history.push({
        pathname: RouterPath.signIn,
        state: {
          goUrl: RouterPath.community,
        },
      });
    }
  };
  const PersonNavClick = () => {
    if (isAuthorized) {
      setPersonSrc(images.naviPersonOn);
      history.push({ pathname: RouterPath.mypage });
    } else {
      history.push({
        pathname: RouterPath.signIn,
        state: {
          goUrl: RouterPath.mypage,
        },
      });
    }
  };
  const wallet = () => {
    if (isAuthorized) {
      if (checkConnection()) {
        history.push({ pathname: RouterPath.wallet });
      } else {
        throw new CustomException(
          'MetaMask 연결에 실패하였습니다. <br/>MetaMask를 확인해주시기 바랍니다.',
        );
      }
    } else {
      history.push({
        pathname: RouterPath.signIn,
        state: {
          goUrl: RouterPath.wallet,
        },
      });
    }
  };
  return (
    <Nav as="nav">
      {/* 아이템 현황 */}
      <Nav.Item
        onClick={() => {
          HomeNavClick();
          handleNavClick(location.pathname);
        }}
      >
        <Nav.Link>
          <Image
            src={
              activeLink.split('/')[1] === 'home' ? images.naviHomeOn : homeSrc
            }
          />
        </Nav.Link>
      </Nav.Item>
      {/* 지갑 */}
      <Nav.Item
        onClick={() => {
          PlaceNavClick();
          handleNavClick(location.pathname);
        }}
      >
        <Nav.Link>
          <Image
            src={
              activeLink.split('/')[1] === 'place'
                ? images.naviPlaceOn
                : placeSrc
            }
          />
        </Nav.Link>
      </Nav.Item>
      <Nav.Item onClick={wallet}>
        <Nav.Link>
          <Image
            src={images.icNaviPng}
            style={{
              position: 'absolute',
              transform: 'translateY(-17px)',
              top: '0',
              zIndex: '99',
            }}
          />
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          onClick={() => {
            MessageNavClick();
            handleNavClick(location.pathname);
          }}
        >
          <Image
            src={
              activeLink.split('/')[1] === 'community'
                ? images.naviMessageOn
                : messageSrc
            }
          />
        </Nav.Link>
      </Nav.Item>
      {/* 보유자산 */}
      <Nav.Item>
        <Nav.Link
          onClick={() => {
            PersonNavClick();
            handleNavClick(location.pathname);
          }}
        >
          <Image
            src={
              activeLink.split('/')[1] === 'mypage'
                ? images.naviPersonOn
                : personSrc
            }
          />
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
});
