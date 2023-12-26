import { Table, Tag, Space, Popconfirm, message } from "antd";
import PageTitleSmall from "../global/PageTitleSmall";
import { useEffect, useState } from "react";
import request from "../../utils/request";
import { useParams } from "react-router-dom";
import { AiFillDelete, AiFillEye } from "react-icons/ai";
import useColumnSearch from "../../hooks/useColumnSearch";
import moment from "moment-timezone";
import nulls from "../../assets/null.png";
import { TimeMysql } from "../../utils/Common";

const MembersList = () => {
  const [listDataMember, setListDataMember] = useState([]);
  const { classCode } = useParams();
  const [getColumnSearchProps] = useColumnSearch();
  const confirm = async (e, data) => {
    const memberID = data.memberID;
    const memberName = data.memberName;

    const res = await request.delete(`member/delete/${classCode}/${memberID}`);
    if (res.status === 200) {
      message.success(`Đã xóa thành viên ${memberName} thành công`);
      setListDataMember((prevList) => {
        return prevList.filter((member) => member.memberID !== memberID);
      });
    } else {
      message.warning(`Đã có lỗi xảy ra khi xóa thành viên `);
    }
  };
  const columns = [
    {
      key: "MSSV",
      dataIndex: "MSSV",
      title: "MSSV",
      ...getColumnSearchProps("MSSV"),

      render: (MSSV) => {
        return MSSV ? <>{MSSV}</> : <img src={nulls} alt="" />;
      },
    },
    {
      key: "memberName",
      dataIndex: "memberName",
      title: "Tên SV",
      ...getColumnSearchProps("memberName"),
      render: (memberName) => {
        return memberName ? <>{memberName}</> : <img src={nulls} alt="" />;
      },
    },

    {
      key: "memberSex",
      dataIndex: "memberSex",
      title: "Giới tính",

      render: (memberSex) => {
        return memberSex ? (
          <Tag color={memberSex == 0 ? "blue" : "green"}>
            {memberSex == 0 ? "Nam" : "Nữ"}
          </Tag>
        ) : (
          <img src={nulls} alt="" />
        );
      },
    },
    {
      key: "memberBirth",
      dataIndex: "memberBirth",
      title: "Ngày sinh",
      render: (memberBirth) => {
        return memberBirth ? (
          <h1 className="whitespace-nowrap">{TimeMysql(memberBirth)}</h1>
        ) : (
          <img src={nulls} alt="" />
        );
      },
    },
    {
      key: "memberSchool",
      dataIndex: "memberSchool",
      title: "Mã trường",
      ...getColumnSearchProps("memberSchool"),
      render: (memberSchool) => {
        return memberSchool ? <>{memberSchool}</> : <img src={nulls} alt="" />;
      },
    },
    {
      key: "memberTelephone",
      dataIndex: "memberTelephone",
      title: "SĐT",
      ...getColumnSearchProps("memberTelephone"),
      render: (memberTelephone) => {
        return memberTelephone ? (
          <>{memberTelephone}</>
        ) : (
          <img src={nulls} alt="" />
        );
      },
    },
    {
      key: "memberEmail",
      dataIndex: "memberEmail",
      title: "Email",
      ...getColumnSearchProps("memberEmail"),
    },
    {
      title: "Actions",
      render: (_, record) => {
        return (
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-md text-white flex items-center gap-2 font-semibold bg-blue-500 hover:bg-blue-600">
              <AiFillEye />
            </button>

            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() => confirm(_, record)}
              okText="Xóa"
              cancelText="Không"
            >
              <button className="p-2 rounded-md text-white flex items-center gap-2 font-semibold bg-red-500 hover:bg-red-600">
                <AiFillDelete />
              </button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  console.log(listDataMember, "cc");

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const getAll = await request.get(`member/getall/${classCode}`);
        setListDataMember(getAll.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);
  return (
    <div className="">
      <PageTitleSmall title="danh sách thành viên" />
      <div className="">
        <Table
          columns={columns}
          dataSource={listDataMember.length > 0 && listDataMember}
        />
      </div>
    </div>
  );
};
export default MembersList;
