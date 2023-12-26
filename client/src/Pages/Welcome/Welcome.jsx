import React, { useState } from "react";
import welcome from "../assets/welcome.jpg";
import WelcomeLayout from "../../Layout/WelcomeLayout";
import { useNavigate } from "react-router-dom";
const Welcome = () => {
  const [value, setValue] = useState("teacher");

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const navigate = useNavigate();

  const handleSubmit = () => {
    // Sử dụng history.push để chuyển hướng đến đường dẫn mong muốn
    navigate(`/login/${value}`);
  };
  console.log(value);
  return (
    <WelcomeLayout>
      <div className="flex flex-col gap-5">
        <h1 className="text-gray-900 font-extrabold text-3xl uppercase">
          Chào mừng bạn đến với Subs Classroom
        </h1>

        <div className="">
          <label
            for="countries"
            className="block mb-2 text-sm font-medium text-blue-500 "
          >
            Chọn vai trò của bạn
          </label>
          <select
            value={value}
            onChange={handleChange}
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 "
          >
            <option className="p-4" selected value="teacher">
              Tôi là giảng viên
            </option>
            <option className="p-4" value="student">
              Tôi là học sinh - sinh viên
            </option>
          </select>
        </div>
        <button
          onClick={handleSubmit}
          className="font-semibold text-md bg-blue-500 w-full hover:bg-blue-600 text-white py-2 rounded-md"
        >
          Tiếp tục
        </button>
      </div>
    </WelcomeLayout>
  );
};

export default Welcome;
