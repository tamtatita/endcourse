import { Table } from "antd";
import React from "react";

const AcademicAchievement = () => {
  const columns = [
    {
      title: "Tên môn học",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tên giảng viên",
      dataIndex: "teacher",
      key: "teacher",
    },
    {
      title: "Điểm trung bình",
      dataIndex: "point",
      key: "point",
    },
  ];

  const dataSource = [
    { key: 1, name: "Cơ sở dữ liệu", teacher: "Nguyễn Thành Huy", point: 2.5 },
    {
      key: 2,
      name: "Cơ sở dữ liệu phân tán",
      teacher: "Nguyễn Thành Huy",
      point: 4.5,
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={dataSource} />
    </div>
  );
};

export default AcademicAchievement;
