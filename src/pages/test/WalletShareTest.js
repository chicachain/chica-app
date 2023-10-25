/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import { Button } from 'react-bootstrap';
import { test1, transfer } from '../../common/utils/Web3Util';

export default React.memo(function CalanderTest(props) {
  const deviceCheck = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      alert('모바일 디바이스입니다.');
    } else {
      alert('데스크탑 또는 노트북입니다.');
    }
  };

  const send = async () => {
    const txHash = await transfer(
      '0xDBe2D1dfdb9882c56FBD76d0D35A62669f07fb70',
      0.001,
    );
    alert(txHash);
  };
  const sendTest1 = async () => {
    const txHash = await test1(
      '0xDBe2D1dfdb9882c56FBD76d0D35A62669f07fb70',
      0.001,
    );
    alert(txHash);
  };
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '공유하기',
          text: '공유',
          url: window.location.href,
        });
      } catch (error) {
        console.log('error', error.code);
        if (error.code !== 20) {
          alert(`Error sharing: ${error}`);
        }
      }
    } else {
      alert('해당 기기는 공유하기 기능을 지원하지 않습니다.');
    }
  };

  const deepLinkTest1 = () => {
    const aTag = document.createElement('a');
    aTag.setAttribute('href', 'imtokenv2://navigate/AssetsTab');
    aTag.click();
  };
  const deepLinkTest2 = () => {
    const aTag = document.createElement('a');
    aTag.setAttribute(
      'href',
      'imtokenv2://navigate/DappView?url=https://chica-mall.upchain.co.kr',
    );
    aTag.click();
  };

  const getGeo = () => {
    navigator.geolocation.getCurrentPosition(res => {
      // Redux 갱신
      console.log('res.coords.latitude', res.coords.latitude);
      console.log('res.coords.longitude', res.coords.longitude);
      alert(
        `res.coords.latitude : ${res.coords.latitude} \n res.coords.longitude : ${res.coords.longitude}`,
      );
    });
  };

  const goChrome = () => {
    const aTag = document.createElement('a');
    aTag.setAttribute(
      'href',
      'googlechrome://navigate?url=chica-mall.upchain.co.kr/test/wallet-share',
    );
    aTag.click();
  };

  const goChrome2 = () => {
    const aTag = document.createElement('a');
    aTag.setAttribute(
      'href',
      'intent://chica-mall.upchain.co.kr/test/wallet-share#Intent;scheme=https;package=com.android.chrome;end;',
    );
    aTag.click();
  };
  const goChrome3 = () => {
    window.open('https://chica-mall.upchain.co.kr/test/wallet-share');
  };

  const gosafari1 = () => {
    const aTag = document.createElement('a');
    aTag.setAttribute(
      'href',
      'safari-https://chica-mall.upchain.co.kr/test/wallet-share',
    );
    aTag.click();
  };
  const gosafari2 = () => {
    window.open('chica-mall.upchain.co.kr/test/wallet-share');
  };
  const gosafari3 = () => {
    const aTag = document.createElement('a');
    aTag.setAttribute(
      'href',
      'safari://chica-mall.upchain.co.kr/test/wallet-share',
    );
    aTag.click();
  };
  const gosafari4 = () => {
    const aTag = document.createElement('a');
    aTag.setAttribute(
      'href',
      'safari://https://chica-mall.upchain.co.kr/test/wallet-share',
    );
    aTag.click();
  };

  return (
    <div>
      <Button onClick={deviceCheck}>device check</Button>
      <Button onClick={send}>transfer</Button>
      <Button onClick={sendTest1}>sendTest1</Button>
      <Button onClick={handleShare}>share</Button>
      <Button onClick={deepLinkTest1}>deepLinkTest1</Button>
      <Button onClick={deepLinkTest2}>deepLinkTest2</Button>
      <Button onClick={getGeo}>geolocation</Button>
      <Button onClick={goChrome}>goChrome</Button>
      <Button onClick={goChrome2}>goChrome2</Button>
      <Button onClick={goChrome3}>goChrome3</Button>
      <Button onClick={gosafari1}>gosafari1</Button>
      <Button onClick={gosafari2}>gosafari2</Button>
      <Button onClick={gosafari3}>gosafari3</Button>
      <Button onClick={gosafari4}>gosafari4</Button>
    </div>
  );
});
