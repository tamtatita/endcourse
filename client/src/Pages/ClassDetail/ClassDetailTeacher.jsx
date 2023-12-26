import { Drawer, Progress, Tabs } from "antd";
import DefaultLayout from "../../Layout/DefaultLayout";

import ClassDetailAnalyst from "../../components/Classroom/ClassDetailAnalyst";
import CourseContentItem from "../../components/Classroom/CourseContentItem";
import MembersList from "../../components/Classroom/MembersList";
import PageHeading from "../../components/global/PageHeading";
import StudyGroup from "../../components/Classroom/StudyGroup";
import NoteClassroom from "../../components/Classroom/NoteClassroom";
import { useEffect, useState } from "react";
import request from "../../utils/request";
import { Navigate, useNavigate, useParams } from "react-router-dom";
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
  SettingOutlined,
  BookOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import PracticeClass from "../../components/Classroom/PracticeClass/PracticeClassTeacher";
import ConfirmationHistory from "../../components/Classroom/ConfirmationHistory";
import FileClass from "../../components/Classroom/FileClass";
import { useSelector } from "react-redux";
import Setting from "../../components/Setting";
const ClassDetailTeacher = () => {
  const { classCode } = useParams();
  const currentUser = useSelector((state) => state.user);
  const [dataClassDetail, setDataClassDetail] = useState({});
  const [allClass, setAllClass] = useState([]);
  const [open, setOpen] = useState(false);

  const [info, setInfo] = useState([]);

  const [dataAnalystClass, setDataAnalystClass] = useState({
    tienDo: 0,
    tongThanhVien: 0,
    tongSinhVien: 0,
  });

  const dataSubmit = { userID: currentUser[0].teacherID };
  const [canAccessClass, setCanAccessClass] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const data = await request.get(`classdetail/${classCode}`);
        const listClass = await request.post(
          "/subjectgroup/get/allclassid",
          dataSubmit
        );
        const info = await request.post(`/subjectgroup/info/${classCode}`);
        console.log(listClass, "listClass");
        setDataClassDetail(data.data);
        setAllClass(listClass.data);
        setInfo(info.data);
        const canAccessClass = listClass?.data?.some(
          (classObj) => classObj.subjectGroupID === classCode
        );

        if (canAccessClass) {
          setCanAccessClass(true);
        } else {
          setCanAccessClass(false);
          navigate("/notfound");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, [classCode]);

  console.log(allClass, "all class");

  // useEffect(() => {
  //   const fetchAPI = async () => {
  //     try {
  //       const data = await request.get(`classdetail/total/member/${classCode}`);

  //       setDataAnalystClass({
  //         ...dataAnalystClass,
  //         tongThanhVien: data.data.result,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchAPI();
  // }, []);

  console.log(info, "info");

  const item = [
    // {
    //   key: 1,
    //   label: (
    //     <span>
    //       <WechatOutlined /> Thảo luận
    //     </span>
    //   ),
    //   children: <CourseContentItem data={dataClassDetail} />,
    // },
    {
      key: 2,
      label: (
        <span>
          <FileUnknownOutlined /> Ghi chú
        </span>
      ),
      children: <NoteClassroom />,
    },

    // {
    //   key: 5,
    //   label: (
    //     <span>
    //       <BookOutlined /> Bảng điểm
    //     </span>
    //   ),
    //   children: <Transcript />,
    // },

    // {
    //   key: 3,
    //   label: (
    //     <span>
    //       <FileUnknownOutlined /> DS Thành viên
    //     </span>
    //   ),
    //   children: <MembersList />,
    // },

    // {
    //   key: 7,
    //   label: (
    //     <span>
    //       <OrderedListOutlined /> DS Sinh viên
    //     </span>
    //   ),
    //   children: <ListStudents />,
    // },

    // {
    //   key: 8,
    //   label: (
    //     <span>
    //       <FileUnknownOutlined /> Bài tập trong lớp
    //     </span>
    //   ),
    //   children: <PracticeClass />,
    // },

    // {
    //   key: 9,
    //   label: (
    //     <span>
    //       <FileUnknownOutlined /> Giáo án môn học
    //     </span>
    //   ),
    //   children: <GroupStatistics />,
    // },

    {
      key: 10,
      label: (
        <span>
          <FileUnknownOutlined /> Lịch sử tiến độ
        </span>
      ),
      children: <ConfirmationHistory />,
    },

    // {
    //   key: 11,
    //   label: (
    //     <span>
    //       <FileUnknownOutlined /> Nội dung, bài giảng
    //     </span>
    //   ),
    //   children: <FileClass />,
    // },

    {
      key: 6,
      label: (
        <span>
          <SettingOutlined /> Cài đặt
        </span>
      ),
      children: <Setting data={info} />,
    },
  ];

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

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      {canAccessClass && (
        <DefaultLayout>
          {/* <div className=" w-full flex justify-end">
        <button
          onClick={showDrawer}
          className="bg-gray-700 text-white p-2 rounded-full  hover:bg-gray-900"
        >
          <AiFillSetting size={26} />
        </button>
      </div> */}

          <PageHeading
            title={`${
              dataClassDetail.length > 0 && dataClassDetail[0]?.subjectName
            }`}
            desc={<Desc />}
            progress={info[0].progress}
          />

          {/* PHÂN TÍCH */}
         

          <div className="mt-2  p-2">
            <Tabs
              defaultActiveKey="1"
              items={item}
              type="card"
              tabPosition="left"
            />
          </div>

          {/* <div className="w-full flex">
        <div className="w-[30%]">
          <SidebarMenu />
        </div>
        <div className="w-[70%] "></div>

      </div> */}

          <Drawer
            title="Cài đặt"
            placement="right"
            onClose={onClose}
            open={open}
          >
            <div className="flex flex-col gap-3">
              <button className="py-2 rounded-sm font-semibold bg-gray-300/70 text-black items-center flex gap-3 px-3">
                <AiFillInfoCircle />
                Thông tin
              </button>
              <button className="py-2 rounded-sm font-semibold bg-gray-300/70 text-black items-center flex gap-3 px-3">
                <BsFillPeopleFill />
                Phân quyền
              </button>
              <button className="py-2 rounded-sm font-semibold bg-gray-300/70 text-black items-center flex gap-3 px-3">
                <AiFillEye />
                Ẩn lớp học
              </button>
              <button className="py-2 rounded-sm font-semibold bg-red-500 text-white items-center flex gap-3 px-3">
                <AiFillDelete />
                Xóa lớp
              </button>
            </div>
          </Drawer>
        </DefaultLayout>
      )}
    </>
  );
};

export default ClassDetailTeacher;
