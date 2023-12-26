import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  BarChartOutlined,
  UserOutlined,
  FileProtectOutlined,
  FieldTimeOutlined,
  ProfileOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

// const currentUser = useSelector((state) => state.user);
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
export const items = [
  getItem("Trang chủ", "/", <PieChartOutlined />),
  getItem("Lớp học", "/class", <DesktopOutlined />),
  getItem("Tiến độ nhóm", "/progress", <RiseOutlined />),
  getItem("Giáo án", "/lessonplan", <FileProtectOutlined />),
  // getItem("Bài tập", "/practices", <FieldTimeOutlined />),
  getItem("Bài giảng", "/lesson", <ProfileOutlined />),
  getItem("Thống kê", "/statistical", <BarChartOutlined />),
  getItem("Người dùng", "/user", <FileOutlined />),
];

export const itemsStudent = [
  getItem("Trang chủ", "/", <PieChartOutlined />),
  getItem("Lớp học", "/class", <DesktopOutlined />),
  getItem("Người dùng", "/user", <FileOutlined />),
];

