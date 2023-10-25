import React, { useEffect, useLayoutEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { UserInfoProvider } from './UserInfoContext';

function Layout({ component: Component, render, ...rest }) {
  Layout.propTypes = {
    component: PropTypes.elementType,
  };
  Layout.defaultProps = {
    component: PropTypes.element,
  };

  const navi = useLocation();

  // Access Token
  const isAuthorized = localStorage.getItem('access_token');

  // ===================================================================
  // [ useEffect ]
  // ===================================================================
  useEffect(() => {
    // 로그인 유저 > 홈으로 이동
    if (isAuthorized) {
      window.location.href = '/home';
    }
    return () => {};
  }, []);

  useLayoutEffect(() => {
    // go scroll top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [navi.pathname]);

  // ===================================================================
  // [ Return ]
  // ===================================================================
  return (
    <UserInfoProvider>
      <Container fluid className="app-container">
        {!isAuthorized && (
          <div className="app-contents">
            <Route
              {...rest}
              render={routeProps => <Component {...routeProps} />}
            />
          </div>
        )}
      </Container>
    </UserInfoProvider>
  );
}

export default React.memo(Layout);
