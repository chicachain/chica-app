/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-danger */
/* eslint-disable no-plusplus */
/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/alt-text */
// eslint-disable-next-line prettier/prettier
import React, { createContext, useContext, useState } from 'react';

// UserInfoContext 생성
export const UserInfoContext = createContext();

export function UserInfoProvider({ children }) {
  const [userInfo, setUserInfo] = useState({
    loginId: '',
    loginType: '',
    password: '',
    loginKey: '',
    mbNm: '',
    birthday: '',
    certCode: '',
    certId: '',
    confirmYn: '',
    termServiceYn: '',
    termPrivateYn: '',
    termLocateYn: '',
    termOpensourceYn: '',
    termAdYn: '',
  });

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
}
