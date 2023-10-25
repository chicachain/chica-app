/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import { Container, Button, Image } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { images } from '@assets';
import { toast } from 'react-toastify';
import Web3 from 'web3';

// API
import { getMyInfo, modifyWallet } from '@api/member/userInfo';

// Custom Component
import { Navi, QRCodeGenerator } from '@components';
import { handleError } from '../../common/utils/HandleError';

// Util
import { balanceOf } from '../../common/utils/Web3Util'; // Web3
import Utils from '../../common/utils/Utils';

// CHICA Token Network ID
const networkId = +process.env.REACT_APP_TOEKN_NETWORK_ID;

// ===================================================================
// [ 지갑 ]
// ===================================================================
export default React.memo(function Wallet(props) {
  const history = useHistory();

  // ===================================================================
  // [ State ]
  // ===================================================================

  const [walletAddressFromDB, setWalletAddressFromDB] = useState(''); // 등록된 회원 지갑주소
  const [walletAddressFromMeta, setWalletAddressFromMeta] = useState(''); // MetaMask 회원 지갑주소
  const [balance, setBalance] = useState(0); // 잔액
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false);

  // ===================================================================
  // [ Utils ]
  // ===================================================================

  // 메타마스크 호출 > 지갑주소 연동
  const openMetaMask = () => {
    if (typeof window.ethereum !== 'undefined') {
      const { ethereum } = window;

      ethereum
        .request({ method: 'eth_chainId' })
        .then(chainIdHex => {
          const chainId = Number(chainIdHex, 16);

          // Network 확인 ( 56 = MainNet, 97 = Testnet )
          if (+networkId !== chainId) {
            toast('MetaMask와 연동된 네트워크를 확인해주세요.');
          }

          // Account 확인
          else {
            ethereum
              .request({ method: 'eth_requestAccounts' })
              .then(accounts => {
                const account = accounts[0];

                setWalletAddressFromMeta(account); // MetaMask 로그인 지갑주소
                setIsMetaMaskConnected(true); // 연동 유무

                // 기존 지갑주고와 다를 경우 > 갱신
                if (walletAddressFromDB !== account) {
                  updateWalletAddress(account);
                }
              })
              .catch(err => {
                if (+err.code === -32002) {
                  toast('이미 진행중인 요청이 존재합니다.');
                } else {
                  toast('MetaMask 연동에 실패했습니다.');
                }
              });
          }
        })
        .catch(err => console.log(err));
    } else {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        toast('메타마스크 앱을 통해 접근해주시기 바랍니다.');
      } else {
        toast('브라우저에 MetaMask가 설치되어있지 않습니다.');
      }
    }
  };

  // 지갑주소 표기
  const maskWalletAddress = address => {
    const len = address.length;

    if (len > 10) {
      return `${address.substring(0, 4)}...${address.substring(len - 4, len)}`;
    }
    return address;
  };

  // ===================================================================
  // [ Web3 ] balanceOf
  // ===================================================================
  const getBalance = address => {
    balanceOf({ walletAddress: address })
      .then(result => {
        web3 = new Web3(window.ethereum);
        setBalance(+Number(web3.utils.fromWei(result, 'ether')).toFixed(5));
      })
      .catch(err => {
        switch (+err.code) {
          case 1100:
            toast('잘못된 형식의 지갑주소입니다..');
            break;
          default:
            toast('블록체인 네트워크와의 통신에 실패했습니다.');
            break;
        }
      });
  };

  // ===================================================================
  // [ API ] 내 정보 가져오기 > 지갑주소 확인
  // ===================================================================
  const getMyData = async () => {
    const { data } = await getMyInfo();

    if (data.code === 200) {
      setWalletAddressFromDB(data.data.walletAddress);
    }
  };

  // ===================================================================
  // [ API ] 지갑주소 등록
  // ===================================================================
  const updateWalletAddress = async address => {
    try {
      const { data } = await modifyWallet({
        walletAddress: address,
      });

      if (data.code === 200) {
        toast('지갑주소가 갱신되었습니다.');
      }
    } catch (error) {
      handleError(error);
    }
  };

  // ===================================================================
  // [ useEffect ]
  // ===================================================================

  // 내 정보 조회
  useEffect(() => {
    getMyData();
  }, []);

  // MetaMask 호출
  useEffect(() => {
    if (walletAddressFromDB) {
      openMetaMask();
    }
  }, [walletAddressFromDB]);

  // balanceOf & QR Code
  useEffect(() => {
    if (walletAddressFromMeta) {
      getBalance(walletAddressFromMeta);
    }
  }, [walletAddressFromMeta]);

  // ===================================================================
  // [ return ]
  // ===================================================================
  return (
    <main id="wallet">
      {/* 헤더 */}
      <header>
        <Container>
          <div className="header-flex">
            <h6>CHICA WALLET</h6>
            {/* <Image src={images.scan} /> */}
          </div>
        </Container>
      </header>

      {/* 컨텐츠 */}
      <Container className="container-custom">
        {/* 보유 자산 & MetaMask 연결 */}
        <div className="top-box">
          <p
            className="link"
            onClick={!isMetaMaskConnected ? openMetaMask : null}
          >
            {!isMetaMaskConnected
              ? '연결하기'
              : maskWalletAddress(walletAddressFromMeta)}
          </p>
          <div className="token-point-box">
            <Image src={images.token} />
            <p>{Utils.numberComma(balance)}</p>
            <p>CHICA</p>
          </div>
        </div>

        {/* 로그인 or QR 코드 */}
        <div className="member-ship">
          <h6>CHICA MEMBERSHIP</h6>
          <div className="member-box">
            {!walletAddressFromMeta ? (
              <Button onClick={openMetaMask}>로그인</Button>
            ) : (
              <QRCodeGenerator data={walletAddressFromMeta} />
            )}
          </div>
        </div>
      </Container>

      {/* 푸터 */}
      <Navi />
    </main>
  );
});
