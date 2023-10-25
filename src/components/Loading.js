/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { Container } from 'react-bootstrap';

function Loading() {
  return (
    <Container className="container-center">
      {/* eslint-disable-next-line react/no-unknown-property */}
      <div css={loading} />
    </Container>
  );
}
const loading = css`
  color: var(--bs-white);
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  position: relative;
  animation: animate-loading 1.3s infinite linear;
  transform: scale(0.5) translateZ(0);

  @keyframes animate-loading {
    0%,
    100% {
      box-shadow: 0 -3rem 0 0.2rem, 2rem -2rem 0 0rem, 3rem 0 0 -1rem,
        2rem 2rem 0 -1rem, 0 3rem 0 -1rem, -2rem 2rem 0 -1rem, -3rem 0 0 -1rem,
        -2rem -2rem 0 0;
    }
    12.5% {
      box-shadow: 0 -3rem 0 0, 2rem -2rem 0 0.2rem, 3rem 0 0 0,
        2rem 2rem 0 -1rem, 0 3rem 0 -1rem, -2rem 2rem 0 -1rem, -3rem 0 0 -1rem,
        -2rem -2rem 0 -1rem;
    }
    25% {
      box-shadow: 0 -3rem 0 -0.5rem, 2rem -2rem 0 0, 3rem 0 0 0.2rem,
        2rem 2rem 0 0, 0 3rem 0 -1rem, -2rem 2rem 0 -1rem, -3rem 0 0 -1rem,
        -2rem -2rem 0 -1rem;
    }
    37.5% {
      box-shadow: 0 -3rem 0 -1rem, 2rem -2rem 0 -1rem, 3rem 0rem 0 0,
        2rem 2rem 0 0.2rem, 0 3rem 0 0rem, -2rem 2rem 0 -1rem,
        -3rem 0rem 0 -1rem, -2rem -2rem 0 -1rem;
    }
    50% {
      box-shadow: 0 -3rem 0 -1rem, 2rem -2rem 0 -1rem, 3rem 0 0 -1rem,
        2rem 2rem 0 0rem, 0 3rem 0 0.2rem, -2rem 2rem 0 0, -3rem 0rem 0 -1rem,
        -2rem -2rem 0 -1rem;
    }
    62.5% {
      box-shadow: 0 -3rem 0 -1rem, 2rem -2rem 0 -1rem, 3rem 0 0 -1rem,
        2rem 2rem 0 -1rem, 0 3rem 0 0, -2rem 2rem 0 0.2rem, -3rem 0 0 0,
        -2rem -2rem 0 -1rem;
    }
    75% {
      box-shadow: 0rem -3rem 0 -1rem, 2rem -2rem 0 -1rem, 3rem 0rem 0 -1rem,
        2rem 2rem 0 -1rem, 0 3rem 0 -1rem, -2rem 2rem 0 0, -3rem 0rem 0 0.2rem,
        -2rem -2rem 0 0;
    }
    87.5% {
      box-shadow: 0rem -3rem 0 0, 2rem -2rem 0 -1rem, 3rem 0 0 -1rem,
        2rem 2rem 0 -1rem, 0 3rem 0 -1rem, -2rem 2rem 0 0, -3rem 0rem 0 0,
        -2rem -2rem 0 0.2rem;
    }
  }
`;
export default Loading;
