import { Menu } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { items, itemsStudent } from "../../constants/Menu";
import logo from "../../assets/logo.png";
import { useSelector } from "react-redux";
const MenuSideBar = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user);

  return (
    <div className="fixed h-screen overflow-y-hidden hover:overflow-y-scroll duration-500 transition-all ">
      <div className="flex justify-center items-center border-b-2 border-gray-200 py-3">
        <img src={logo} className="object-cover " />
      </div>
      <Menu
        onClick={({ key }) => {
          navigate(key);
        }}
        theme="light"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={currentUser[0].role == "teacher" ? items : itemsStudent}
      />
    </div>
  );
};

export default MenuSideBar;
