import React, { memo } from "react";

const CONVERT = ({ dayTime, type }) => {
  const inputDateTime = dayTime;
  const date = new Date(inputDateTime);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  let formattedDateTime = "";

  if (type == "full") {
    formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  } else {
    formattedDateTime = `${day}-${month}-${year} `;
  }

  return <span>{formattedDateTime}</span>;
};

export default memo(CONVERT);
