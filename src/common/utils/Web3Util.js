import Web3 from 'web3';
import { toast } from 'react-toastify';
import CustomException from '../exceptions/CustomException';
import abis from '../Abis';

// BSC Network
const tokenNetwork = process.env.REACT_APP_TOEKN_NETWORK;
const networkId = process.env.REACT_APP_TOEKN_NETWORK_ID;

// CHICA Contract Address
const tokenContract = process.env.REACT_APP_TOKEN_CONTRACT;

let web3 = null;
const gasExtra = 100000;

// Token ABI
const tokenAbi = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
];

const defaultHandleError = error => {
  if (error?.message.includes('User denied transaction signature')) {
    alert('MetaMask에서 해당 기능에 대해 거부를 하였습니다.');
  } else if (error?.message.includes('transfer amount exceeds balance')) {
    alert('걸제에 필요한 토큰량이 부족합니다.');
  } else {
    throw error;
  }
};

// 메타마스크 호출 > 지갑주소 연동
export const checkMetaMaskConnection = () => {
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
          ethereum.request({ method: 'eth_requestAccounts' }).catch(err => {
            toast('MetaMask 연동에 실패했습니다.');
          });
        }
      })
      .catch(err => toast(err));
  } else {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      toast('메타마스크 앱을 통해 접근해주시기 바랍니다.');
    } else {
      toast('브라우저에 MetaMask가 설치되어있지 않습니다.');
    }
  }
};

// balanceOf
export const balanceOf = ({ walletAddress }) => {
  try {
    // Network 연결
    const web3Obj = new Web3(tokenNetwork);

    // Contract 확인
    const contract = new web3Obj.eth.Contract(abis.chica, tokenContract);

    // RPC 호출
    return contract.methods.balanceOf(walletAddress).call();
  } catch (err) {
    return Promise.reject(err);
  }
};

const web3Init = async () => {
  try {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      return true;
    }
    web3 = new Web3(window.web3.currentProvider);
    return true;
  } catch (error) {
    console.log('error', error);
    throw new CustomException('web3를 찾을 수 없습니다.');
  }
  // eslint-disable-next-line no-unreachable
  return false;
};

// 트랜잭션에 필요한 가스 추정
const estimateGasWithExtra = async (contractMethod, args) => {
  try {
    const estimatedGas = await contractMethod(...args).estimateGas({
      from: await getWallet(),
    });
    // eslint-disable-next-line no-undef
    return BigInt(estimatedGas) + BigInt(gasExtra);
  } catch (error) {
    console.log('error', error);
    throw new CustomException(error.data.message);
  }
};

export const getWallet = async () => {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      if (accounts && accounts[0]) {
        return accounts[0];
      }
    } catch (error) {
      throw new CustomException(error);
    }
    return false;
  }
  return false;
};

/**
 *  transaction
 */

const sendTransaction = async (method, gasPrice, gasLimit) => {
  return method
    .send({
      from: await getWallet(),
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(gasLimit),
    })
    .on('error', error => console.error('에러:', error))
    .on('transactionHash', transactionHash => {
      // console.info('트랜잭션 해시:', transactionHash);
      return transactionHash;
    })
    .on('receipt', receipt => {
      // console.info('영수증:', receipt);
    })
    .on('confirmation', confirmation => {
      // console.info('확인:', confirmation);
    })
    .then(newContractInstance => {
      // 트랜잭션 후 작업
      // console.log('newContractInstance :: ', newContractInstance);
      return newContractInstance.transactionHash;
    });
};

export const checkConnection = async () => {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      if (accounts && accounts[0]) {
        return true;
      }
    } catch (error) {
      throw new CustomException(error);
    }
    return false;
  }
  return false;
};

export const validateWallet = async () => {
  // 메타 마스트 연결 확인
  const isCheck = await checkConnection();
  if (!isCheck) {
    throw new CustomException(
      'MetaMask 연결에 실패하였습니다. <br/>MetaMask를 확인해주시기 바랍니다.',
    );
  }
  // const clientWalletAddress = store.dispatch(authAction.getAuth()).payload
  //   ?.clientWalletAddress;
  // const wallet = getWallet();
  // if (
  //   String(clientWalletAddress).toLocaleLowerCase() !==
  //   String(wallet).toLocaleLowerCase()
  // ) {
  //   throw new CustomException(
  //     'MetaMask 연결된 지갑 주소와 등록된 지갑 주소와 다릅니다.',
  //   );
  // }
  const id = await web3.eth.net.getId();
  if (String(networkId) !== String(id)) {
    throw new CustomException('MetaMask에 연결된 네트워크를 확인해 주세요.');
  }
};

export const transfer = async (toAddr, amount) => {
  try {
    await validateWallet();
    if (toAddr && amount) {
      // const contract = new web3.eth.Contract(스마트 컨트랙트의 ABI, 스마트 컨트랙트의 주소);
      const contract = new web3.eth.Contract(abis.chica, tokenContract);
      const amountInWei = web3.utils.toWei(String(amount), 'ether');

      const gasPrice = await web3.eth.getGasPrice();
      const gasLimit = await estimateGasWithExtra(contract.methods.transfer, [
        toAddr,
        amountInWei,
      ]);

      const txHash = await sendTransaction(
        contract.methods.transfer(toAddr, amountInWei),
        gasPrice,
        gasLimit,
      );
      return txHash;
    }
  } catch (error) {
    defaultHandleError(error);
  }
  return null;
};

export const test1 = async (toAddr, amount) => {
  try {
    if (window.ethereum) {
      await validateWallet();
      if (toAddr && amount) {
        // const contract = new web3.eth.Contract(스마트 컨트랙트의 ABI, 스마트 컨트랙트의 주소);
        const contract = new web3.eth.Contract(abis.chica, tokenContract);
        const amountInWei = web3.utils.toWei(String(amount), 'ether');

        const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = await estimateGasWithExtra(contract.methods.transfer, [
          toAddr,
          amountInWei,
        ]);

        const txHash = await sendTransaction(
          contract.methods.transfer(toAddr, amountInWei),
          gasPrice,
          gasLimit,
        );
        return txHash;
      }
    }
  } catch (error) {
    alert(error.message);
  }
  return null;
};
