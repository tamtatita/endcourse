import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Gauge } from '@ant-design/plots';

const Progress = ({data}) => {
  const config = {
    percent: data,
    range: {
      color: 'l(0) 0:#B8E1FF 1:#3D76DD',
    },
    startAngle: Math.PI,
    endAngle: 2 * Math.PI,
    indicator: null,
    statistic: {
      title: {
        offsetY: -36,
        style: {
          fontSize: '30px',
          color: '#4B535E',
        },
        formatter: () => `${data*100}%`,
      },
      content: {
        style: {
          fontSize: '20px',
          lineHeight: '44px',
          color: '#4B535E',
        },
        formatter: () => 'TIẾN ĐỘ',
      },
    },
  };
  return <Gauge {...config} />;
};

export default Progress;