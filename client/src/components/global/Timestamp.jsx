import { Space, Tag } from "antd";
import React, { useState, useEffect } from "react";
import useCurrentDateTime from "../../hooks/useCurrentDateTime";

function Timestamp() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Tạo một interval để cập nhật thời gian mỗi phút
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Xóa interval khi component bị unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  
  const formatDateTime = useCurrentDateTime()

  return (
    <Space>
      <Tag color="lime" className='px-3 py-1 font-semibold text-lg uppercase'>{formatDateTime(currentTime)}</Tag>
    </Space>
  );
}

export default Timestamp;
