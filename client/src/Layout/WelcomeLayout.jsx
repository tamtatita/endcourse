import React from "react";
import welcome from "../assets/welcome.jpg";
const WelcomeLayout = ({children}) => {
  return (
    <div className="flex flex-col w-full ">
      <div className="flex justify-between p-3">
        <img src="https://shub.edu.vn/images/brand-blue.svg" alt="" />
        <div className="flex items-center gap-4">
          <button className="px-3 py-1 rounded-md  font-semibold text-black ">
            Trang chủ
          </button>
          <button className="px-3 py-1 rounded-md bg-blue-500 font-semibold text-white hover:opacity-40">
            Đăng ký
          </button>
        </div>
      </div>

      <div className="w-full flex justify-center h-full items-center">
        <div className="w-1/2 px-3 flex-col flex gap-5">{children}</div>

        <div className="w-1/2">
          <img src={welcome} alt="" className="w-full h-80 object-cover" />
        </div>
      </div>
    </div>
  );
};

export default WelcomeLayout;
