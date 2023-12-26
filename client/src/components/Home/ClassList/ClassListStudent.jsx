import { Button, Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import high from "../../../assets/star.png";
import { BsBoxArrowInRight } from "react-icons/bs";
import request from "../../../utils/request";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useSelector } from "react-redux";
const ClassListStudent = () => {
  const [dataSubjectGroup, setDataSubjectGroup] = useState([]);

  const currentUser = useSelector((state) => state.user);

  const userID = currentUser[0].memberID;
  // CÀO TẤT CẢ NHÓM MÔN HỌC
  useEffect(() => {
    const dataSubmit = {
      role: currentUser[0].role,
      userID: currentUser[0].memberID,
      status:1
    };
    const fetchAPI = async () => {
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
      title: "Giảng viên",
      dataIndex: "teacherName",
      key: "teacherName",
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

  return (
    <div>
      <Table
        dataSource={dataSubjectGroup && dataSubjectGroup?.data}
        columns={columns}
      />
    </div>
  );
};

export default ClassListStudent;
