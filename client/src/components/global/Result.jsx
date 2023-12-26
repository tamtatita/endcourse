import React from "react";
import check from "../../assets/check_big.png";
import warning_big from "../../assets/warning_big.png";
import error_big from "../../assets/error_big.png";
import { useNavigate } from "react-router-dom";

const Result = ({ title, desc, type, Icon }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex items-center flex-col gap-4 border-[1px] border-gray-200 rounded-e-md p-4 my-5">
      <div className="">
        <img
          src={
            type === "success"
              ? check
              : type === "warning"
              ? warning_big
              : error_big
          }
          alt=""
        />
      </div>

      <div className="flex flex-col items-center gap-4">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <span className="text-lg font-semibold">{desc}</span>
      </div>

      <div className="flex items-center justify-between gap-5 w-full">
        <button
          onClick={() => navigate("/class")}
          className="py-3 rounded-sm bg-green-500 text-white w-1/3 font-semibold text-base"
        >
          Chuyển hướng đến Phòng học
        </button>

        <button className="py-3 rounded-sm bg-yellow-500 text-white w-1/3 font-semibold text-base">
          Ở lại
        </button>
      </div>
    </div>
  );
};

export default Result;
