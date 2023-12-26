import React, { useState, useEffect, memo } from "react";

const FromNow = ({ targetTime, styleTime }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Hàm tính toán thời gian giữa targetTime và hiện tại
  function calculateTimeDifference(targetTime) {
    const targetDate = new Date(targetTime);
    const timeDifference = new Date() - targetDate;

    const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    const hours = Math.floor(timeDifference / (60 * 60 * 1000));
    const minutes = Math.floor(timeDifference / (60 * 1000));

    if (days >= 1) {
      return `${days} ngày trước`;
    } else if (hours >= 1) {
      return `${hours} giờ trước`;
    } else {
      return `${minutes || 0} phút trước`;
    }
  }

  // Hàm update thời gian và tính toán mỗi phút
  function updateTime() {
    const newTime = new Date();
    setCurrentTime(newTime);
  }

  useEffect(() => {
    updateTime();
    const intervalId = setInterval(updateTime, 60000); 
    return () => clearInterval(intervalId);
  }, []);

  const timeDifference = calculateTimeDifference(targetTime);

  return <div className={styleTime}>{timeDifference}</div>;
};

export default memo(FromNow);
