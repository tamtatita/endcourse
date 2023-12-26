import React, { useState, useEffect } from "react";
import { Pie } from "@ant-design/plots";

const PercentChart = ({ data }) => {
  console.log(data, 'dd');
  const config = {
    appendPadding: 10,
    data: data.length > 0 && data,
    angleField: "percent",
    colorField: "name",
    radius: 0.75,
    
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  return <Pie {...config} />;
};

export default PercentChart;
