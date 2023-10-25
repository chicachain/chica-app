/* eslint-disable import/no-named-as-default */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// import { Loading } from '@components';
import { Provider } from 'react-redux';
import store from './reducers/index';

import App from './App';

import './index.scss';

window.onload = () => {
  const lang = window.navigator.language;
  render();
};

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root'),
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
