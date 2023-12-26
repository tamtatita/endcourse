import { Tag } from "antd";
import React, { useState, useEffect } from "react";

const CaculateDeadline = ({ deadline }) => {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  function calculateTimeRemaining() {
    const now = new Date();
    const targetDate = new Date(deadline);
    const difference = targetDate - now;

    if (difference <= 0) {
      // Deadline đã qua
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { days, hours, minutes, seconds } = timeRemaining;

  if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
    return <Tag color="red-inverse">Đã kết thúc !</Tag>;
  }

  return (
    <Tag color="red">
      Còn lại {days > 0 && `${days} ngày, `}
      {hours > 0 && `${hours} giờ, `}
      {minutes > 0 && `${minutes} phút, `}
      {seconds > 0 && `${seconds} giây`}
    </Tag>
  );
};

export default CaculateDeadline;
