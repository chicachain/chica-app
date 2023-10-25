/* eslint-disable no-undef */
/* global kakao */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-danger */
/** @jsxImportSource @emotion/react */
import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button, Image } from 'react-bootstrap';
import { css } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { CustomOverlayMap, Map, MapMarker } from 'react-kakao-maps-sdk';
import { images } from '@assets';

const { kakao } = window;

function CustomMap({
  clickmodal,
  geolocation,
  activeId,
  searchResults,
  width,
  height,
  marker,
  onClick = () => null,
  ...rest
}) {
  return (
    <Map
      center={geolocation}
      style={{
        width: width || '1320px',
        height: height || '812px',
      }}
      level={1}
      onClick={onClick}
    >
      {searchResults &&
        searchResults.length > 0 &&
        searchResults.map((result, index) => (
          <CustomOverlayMap
            position={{ lat: result.latitude, lng: result.longitude }}
            xAnchor={0.5}
            yAnchor={1}
            key={index}
          >
            <button
              value={result.shopId}
              type="button"
              className={`overlayBox${
                // eslint-disable-next-line eqeqeq
                result.shopId == activeId ? ' active' : ''
              }`}
              onClick={e => {
                if (clickmodal) clickmodal(e);
              }}
            >
              <div
                className="imageBox"
                style={{ pointerEvents: 'none', overflow: 'hidden' }}
              >
                <Image
                  src={result.fileUrl}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <p style={{ pointerEvents: 'none' }}>{result.shopNm}</p>
            </button>
          </CustomOverlayMap>
        ))}

      {/* 마커 */}
      {marker && (
        <CustomOverlayMap position={marker} xAnchor={0.5} yAnchor={1}>
          <MapMarker position={marker} />
        </CustomOverlayMap>
      )}
    </Map>
  );
}

export default CustomMap;
