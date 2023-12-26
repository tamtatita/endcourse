import React from "react";
import { DualAxes } from "@ant-design/plots";

const ColumnDoubleChart = ({ data, name, column1, column2 }) => {
  const config = {
    data: data && [data, data],
    xField: name,
    yField: [column1, column2],
    color: ({ column1 }) => {
      if (column1 < 5.0) {
        return "#ccc";
      } else {
        return "#jr42d";
      }
    },
    geometryOptions: [
      {
        geometry: "column",
      },
      {
        geometry: "line",
        lineStyle: {
          lineWidth: 2,
        },
      },
    ],
  };
  return <DualAxes {...config} />;
};

export default ColumnDoubleChart;
