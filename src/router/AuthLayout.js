import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import PropTypes from 'prop-types';
import RouterPath from '../common/constants/RouterPath';

function AuthLayout({ component: Component, render, ...rest }) {
  AuthLayout.propTypes = {
    component: PropTypes.elementType,
  };

  AuthLayout.defaultProps = {
    component: PropTypes.element,
  };

  // Access Token
  const isAuthorized = localStorage.getItem('access_token');
  // const isAuthorized = true;

  // ===================================================================
  // [ Return ]
  // ===================================================================
  return (
    <Container fluid className="app-container">
      <div className="app-contents">
        <Route
          {...rest}
          render={routeProps =>
            isAuthorized ? (
              render ? (
                render(routeProps)
              ) : (
                <Component {...routeProps} />
              )
            ) : (
              <Redirect
                to={{
                  pathname: RouterPath.homebefor,
                  state: { from: routeProps.location },
                }}
              />
            )
          }
        />
      </div>
    </Container>
  );
}
export default React.memo(AuthLayout);
