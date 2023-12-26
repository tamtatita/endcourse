import { Drawer, Tabs } from "antd";
import DefaultLayout from "../../Layout/DefaultLayout";

import ClassDetailAnalyst from "../../components/Classroom/ClassDetailAnalyst";
import CourseContentItem from "../../components/Classroom/CourseContentItem";
import MembersList from "../../components/Classroom/MembersList";
import PageHeading from "../../components/global/PageHeading";
import StudyGroup from "../../components/Classroom/StudyGroup";
import NoteClassroom from "../../components/Classroom/NoteClassroom";
import { useEffect, useState } from "react";
import request from "../../utils/request";
import { useParams } from "react-router-dom";
import GroupStatistics from "../../components/Classroom/GroupStatistics";
import Transcript from "../../components/Classroom/Transcript";
import ListStudents from "../../components/Classroom/ListStudents";
import { BsFillPeopleFill, BsThreeDotsVertical } from "react-icons/bs";
import {
  AiFillDelete,
  AiFillEye,
  AiFillInfoCircle,
  AiFillMessage,
  AiFillSetting,
  AiOutlineLeftSquare,
} from "react-icons/ai";
import { SiCodeceptjs } from "react-icons/si";
import { BiNotepad } from "react-icons/bi";
import SidebarMenu from "../../components/Classroom/SidebarMenu";
import {
  WechatOutlined,
  FileUnknownOutlined,
  UsergroupAddOutlined,
  BookOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import PracticeClass from "../../components/Classroom/PracticeClass/PracticeClassTeacher";
import ConfirmationHistory from "../../components/Classroom/ConfirmationHistory";
import FileClass from "../../components/Classroom/FileClass";
import PracticeClassStudent from "../../components/Classroom/PracticeClass/PracticeClassStudent";
const ClassDetailStudent = () => {
  const { classCode } = useParams();

  const [dataClassDetail, setDataClassDetail] = useState({});
  const [open, setOpen] = useState(false);

  const [dataAnalystClass, setDataAnalystClass] = useState({
    tienDo: 0,
    tongThanhVien: 0,
    tongSinhVien: 0,
  });
  const item = [
    {
      key: 1,
      label: (
        <span>
          <WechatOutlined /> Thảo luận
        </span>
      ),
      children: <CourseContentItem data={dataClassDetail} />,
    },

    {
      key: 3,
      label: (
        <span>
          <FileUnknownOutlined /> DS Thành viên
        </span>
      ),
      children: <MembersList />,
    },

    {
      key: 8,
      label: (
        <span>
          <FileUnknownOutlined /> Bài tập trong lớp
        </span>
      ),
      children: <PracticeClassStudent />,
    },

    {
      key: 11,
      label: (
        <span>
          <FileUnknownOutlined /> Nội dung, bài giảng
        </span>
      ),
      children: <FileClass />,
    },
  ];
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const data = await request.get(`classdetail/${classCode}`);
        console.log(data);
        setDataClassDetail(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const data = await request.get(`classdetail/total/member/${classCode}`);

        setDataAnalystClass({
          ...dataAnalystClass,
          tongThanhVien: data.data.result,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);

  const Desc = () => {
    return (
      dataClassDetail && (
        <div>
          <p>
            Nhóm: {dataClassDetail[0]?.subjectGroupNameGroup} __ Thứ:{" "}
            {dataClassDetail[0]?.subjectGroupDay} __ Tiết:{" "}
            {dataClassDetail[0]?.subjectGroupStart} __ Học kì:{" "}
            {dataClassDetail[0]?.subjectGroupSemester} __ Năm học:{" "}
            {dataClassDetail[0]?.subjectGroupSchoolYear}
          </p>
        </div>
      )
    );
  };

  return (
    <DefaultLayout>
      <PageHeading
        title={`${
          dataClassDetail.length > 0 && dataClassDetail[0]?.subjectName
        }`}
        desc={<Desc />}
      />

      {/* PHÂN TÍCH */}
      <div className="flex w-full justify-between items-center  flex-wrap ">
        <ClassDetailAnalyst data={12} desc="Tiến độ của môn" title="Tiến độ" />
        <ClassDetailAnalyst
          data={dataAnalystClass?.tongThanhVien}
          title="Danh sách thành viên"
          desc="Các thành viên hiện đã vào nhóm"
        />
        <ClassDetailAnalyst
          desc="Danh sách ở website trường"
          data="11"
          title="Danh sách sinh viên"
        />
      </div>

      <div className="mt-2  p-2">
        <Tabs
          defaultActiveKey="1"
          items={item}
          type="card"
          tabPosition="left"
        />
      </div>
    </DefaultLayout>
  );
};

export default ClassDetailStudent;
