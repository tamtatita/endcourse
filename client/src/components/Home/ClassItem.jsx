import { Tag } from "antd";
import React, { memo } from "react";
import { Link } from "react-router-dom";

const ClassItem = ({
  id,
  tenMonHoc,
  tietBatDau,
  thu,
  tienTrinh,
  ngayTao,
  nhomMonHoc,
}) => {
  return (
    <Link to={`/class/${id}`}>
      <div className="w-[200px] h-auto pb-3 primary hover:scale-95 transition-all duration-300">
        <div className=" max-w-full w-full">
          <h3 className="flex items-center text-center justify-center top-[45%] left-2 font-semibold text-lg capitalize">
            {tenMonHoc}
          </h3>

          <span className="top-1 right-1 bg-red-100/90 rounded-md text-red-500 font-extrabold text-xl px-3 py-1">
            Nhóm {nhomMonHoc}
          </span>
        </div>

        <div className="flex items-center justify-between my-3 px-2">
          <h1 className="px-3 py-1 bg-blue-100 text-blue-500 font-bold text-lg rounded-md">
            {thu}
          </h1>
          <h3 className="px-3 py-1 bg-red-100 text-red-500 font-bold text-lg rounded-md">
            Tiết bắt đầu: {tietBatDau}
          </h3>
        </div>

        {/* TIẾN TRÌNH */}
        <div className="w-full bg-neutral-200 my-5">
          <div
            className={`${
              tienTrinh < 50 ? "bg-red-500/80" : "bg-blue-500/80"
            } p-0.5 text-center text-xs font-medium leading-none text-white `}
            style={{ width: `${tienTrinh}%` }}
          >
            {tienTrinh}%
          </div>
        </div>

        {/* NGÀY TẠO */}
        <h4 className="font-semibold px-2 text-blue-500 ">
          Số ngày đã tạo: {ngayTao}
        </h4>
      </div>
    </Link>
  );
};

export default memo(ClassItem);
