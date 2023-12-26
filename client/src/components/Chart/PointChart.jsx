import React from "react";
import { Column } from "@ant-design/plots";

const PointChart = ({ data, type, x, y }) => {
  const maxValue = Math.max(...data.map(item => item[y]));
  const minValue = Math.min(...data.map(item => item[y]));
  const config = {
    data: data,
    xField: x,
    yField: y,
    
    minColumnWidth: 50,
    maxColumnWidth: 50,
    maxLimit: maxValue > 100 ? maxValue : 100,
    min:100,
    color: (dataItem) => {
      // Xác định màu sắc dựa trên giá trị y
      if (dataItem[y] === maxValue) {
        return '#66CC00'; // Màu xanh cho giá trị y cao nhất
      } else if (dataItem[y] === minValue) {
        return '#FF3333'; // Màu đỏ cho giá trị y thấp nhất
      } else {
        return '#33CCFF'; // Màu xanh dương cho các giá trị khác
      }
    },
    minLimit:100,
    label: {
      // 可手动配置 label 数据标签位置
      position: "middle",
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: "#FFFFFF",
        // opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        autoHide: true,
        max:100,
        autoRotate: false,
      },
      max:100,
    },
    meta: {
      type: {
        alias: "类别",
      },
      sales: {
        alias: "销售额",
      },
    },
  };

  return <Column {...config} />;
};

export default PointChart;
