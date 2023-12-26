import { Button, Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import high from "../../../assets/star.png";
import { BsBoxArrowInRight } from "react-icons/bs";
import request from "../../../utils/request";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const ClassListTeacher = () => {
  const [dataSubjectGroup, setDataSubjectGroup] = useState([]);

  const currentUser = useSelector((state) => state.user);
  console.log(currentUser);

  // CÀO TẤT CẢ NHÓM MÔN HỌC
  useEffect(() => {
    const fetchAPI = async () => {
      const dataSubmit = {
        userID: currentUser[0].teacherID,
        role: currentUser[0].role,
        status: 1,
      };
      try {
        const listSubjectGroup = await request.post(
          `subjectgroup/getall/`,
          dataSubmit
        );
        console.log(listSubjectGroup);

        setDataSubjectGroup(listSubjectGroup);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);
  const columns = [
    { title: "Mã lớp", key: "subjectGroupID", dataIndex: "subjectGroupID" },
    {
      title: "Tên môn học",
      dataIndex: "subjectName",
      key: "subjectName",
    },

    {
      title: "Nhóm",
      dataIndex: "subjectGroupNameGroup",
      key: "subjectGroupNameGroup",
      render: (subjectGroupNameGroup) => {
        return <Tag color="#FF3333">{subjectGroupNameGroup}</Tag>;
      },
    },

    {
      title: "Thứ",
      dataIndex: "subjectGroupDay",
      key: "subjectGroupDay",
    },

    {
      title: "Tiết BĐ",
      dataIndex: "subjectGroupStart",
      key: "subjectGroupStart",
    },

    {
      title: "TH",
      dataIndex: "subjectGroupPractice",
      key: "subjectGroupPractice",
      render: (subjectGroupPractice) => {
        return subjectGroupPractice === 1 ? (
          <img src={high} alt="" className=" object-cover" />
        ) : (
          ""
        );
      },
    },

    {
      title: "Phòng",
      dataIndex: "subjectGroupClassName",
      key: "subjectGroupClassName",
      render: (subjectGroupClassName) => {
        return subjectGroupClassName &&
          typeof subjectGroupClassName === "string" &&
          subjectGroupClassName.length === 9 ? (
          <Tag color="#33334F">{subjectGroupClassName}</Tag>
        ) : (
          <Tag color="#33334F">{subjectGroupClassName}</Tag>
        );
      },
    },

    {
      title: "Action",
      dataIndex: "point",
      //   key: "point",
      render: (_, record) => {
        return (
          <Tooltip title="Vào lớp">
            <Link to={`/class/${record.subjectGroupID}`}>
              <button className="bg-blue-700 text-white p-2 rounded-md items-center flex justify-center font-bold text-lg hover:bg-blue-900">
                <BsBoxArrowInRight />
              </button>
            </Link>
          </Tooltip>
        );
      },
    },
  ];
  console.log(dataSubjectGroup);

  // const dataSource = [
  //   {
  //     key: 1,
  //     maLop: "FHJKIO",
  //     name: "Cơ sở dữ liệu",
  //     teacher: "Nguyễn Thành Huy",
  //     thu: 2,

  //     tietBatDau: 4,
  //     nhom: 12,
  //     lop: "DCT1201C2",
  //   },
  //   {
  //     key: 2,
  //     maLop: "LKJKIO",
  //     name: "Cơ sở dữ liệu phân tán",
  //     teacher: "Nguyễn Khắc Huy",
  //     thu: 2,
  //     tietBatDau: 4,
  //     nhom: 12,
  //     lop: "DCT1201",
  //   },

  //   {
  //     key: 3,
  //     maLop: "FHJKIO",
  //     name: "Trí tuệ nhân tạo",
  //     teacher: "Nguyễn Thành Huy",
  //     thu: 2,
  //     tietBatDau: 4,
  //     nhom: 12,
  //     lop: "DCT1201C2",
  //   },
  // ];
  return (
    <div className="h-[400px] overflow-y-scroll px-2">
      <Table
        dataSource={dataSubjectGroup && dataSubjectGroup?.data}
        columns={columns}
      />
    </div>
  );
};

export default ClassListTeacher;
