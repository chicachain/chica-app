/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-danger */
import React from 'react';
import QRCode from 'qrcode.react';

function QRCodeGenerator({ data }) {
  return <QRCode value={data} />;
}

export default QRCodeGenerator;
