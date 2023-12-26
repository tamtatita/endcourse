import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import TimeStamp from "../components/TimeStamp/TimeStamp";
import UseCurrentDateTime from "../hooks/useCurrentDateTime";
import Timestamp from "../components/global/Timestamp";
import MenuSideBar from "../components/global/MenuSideBar";
import HeaderTeacher from "../components/global/Header/HeaderTeacher";
import HeaderMember from "../components/global/Header/HeaderMember";
import { useSelector } from "react-redux";

const { Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const DefaultLayout = ({ children }) => {
  const currentUser = useSelector((state) => state.user);

  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-[100vh] flex font-sans">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <MenuSideBar />
      </Sider>
      <div className="flex-1">
        {currentUser[0].role == "teacher" ? (
          <HeaderTeacher />
        ) : (
          <HeaderMember />
        )}
        <div className="p-3 flex flex-col gap-3 bg-white">
          <Timestamp />
          {children}
        </div>
        <Footer
          className="box-primary text-white font-bold"
          style={{
            textAlign: "center",
          }}
        >
          KHÓA LUẬN TỐT NGHIỆP Lê Văn Tâm
        </Footer>
      </div>
    </div>
  );
};
export default DefaultLayout;
