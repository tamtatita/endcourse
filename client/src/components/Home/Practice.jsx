import React from "react";
import fire from "../../assets/fire.gif";
import { Tag } from "antd";
import FromNow from "../global/FromNow";
import CaculateDeadline from "../global/CaculateDeadline";
import moment from "moment-timezone";
const Practice = ({ props }) => {
  const {
    practiceID,
    practiceFile,
    practiceStatus,
    practiceTitle,
    subjectGroupID,
    subjectName,
    dayOpen,
    dayClose,
    subjectGroupNameGroup,
    subjectGroupStart,
    subjectGroupDay,
  } = props;
  return (
    <div
      key={practiceID}
      className="bg-white  p-2 flex  items-center justify-between border-b border-gray-200 relative"
    >
      <div className="flex flex-col gap-2 flex-1 ">
        <div className="flex items-center gap-2 ">
          <h1 className="w-1/5 text-sm">Môn: </h1>
          <h4 className="font-bold text-md">{subjectName}</h4>
        </div>

        <div className="flex items-center gap-2 ">
          <div className="flex items-center gap-2">
            <h1 className="text-sm">Nhóm: </h1>
            <h4 className="font-bold text-md">{subjectGroupNameGroup}</h4>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-sm">Thứ: </h1>
            <h4 className="font-bold text-md">{subjectGroupDay}</h4>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-sm">Tiết: </h1>
            <h4 className="font-bold text-md">{subjectGroupStart}</h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <h1 className="w-1/5 text-sm">Open: </h1>

          {moment(dayOpen).format("DD-MM-YYYY HH:mm:ss")}
        </div>

        <div className="flex items-center gap-2">
          <h1 className="w-1/5 text-sm">Close: </h1>

          {moment(dayClose).format("DD-MM-YYYY HH:mm:ss")}
        </div>

        <div className="flex items-center gap-2">
          <h1 className="w-1/5 text-sm whitespace-nowrap">Còn lại: </h1>
          <div>
            <CaculateDeadline deadline={dayClose} />
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-1">
        <img src={fire} loading="lazy" className="h-10 w-10" alt="" />
      </div>
    </div>
  );
};

export default Practice;
