import { Progress, Tag } from "antd";
import React, { memo } from "react";

const PageHeading = ({ title, desc, progress }) => {
  return (
    <div className="bg-white shadow-lg shadow-gray-100 border-[1px] border-gray-200 my-2 p-4 w-full flex items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-gray-800 tracking-wider font-extrabold text-3xl uppercase">
          {title}
        </h1>
        <h3 className="font-medium font-sans text-gray-800 w-fit p-2 text-lg mt-2">
          {desc}
        </h3>
      </div>

      {progress && (
        <div className="">
          <Progress type="circle" percent={progress} />
        </div>
      )}
    </div>
  );
};

export default memo(PageHeading);
