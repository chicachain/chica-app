/* eslint-disable no-nested-ternary */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function AuthRoute({ user, component: Component, render, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        user ? (
          render ? (
            render(props)
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect
            to={{ pathname: '/signin', state: { from: props.location } }}
          />
        )
      }
    />
  );
}

export default AuthRoute;
