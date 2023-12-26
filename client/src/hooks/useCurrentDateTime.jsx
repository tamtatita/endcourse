// useFormatVND.ts
import { useMemo } from "react";
import moment from "moment-timezone";
const useCurrentDateTime = () => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Định dạng đối tượng moment với múi giờ UTC
    const utcMoment = moment.utc(date);

    // Chuyển đổi sang múi giờ Việt Nam
    const vnMoment = utcMoment.tz("Asia/Ho_Chi_Minh");

    // Lấy thông tin ngày, tháng, năm, giờ, phút, giây
    const day = vnMoment.format("DD");
    const month = vnMoment.format("MM");
    const year = vnMoment.format("YYYY");
    const hours = vnMoment.format("HH");
    const minutes = vnMoment.format("mm");
    const seconds = vnMoment.format("ss");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return useMemo(() => formatDate, []);
};

export default useCurrentDateTime;
