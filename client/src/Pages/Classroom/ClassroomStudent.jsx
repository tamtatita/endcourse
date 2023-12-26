import {
  Button,
  Checkbox,
  Divider,
  Input,
  Modal,
  Tag,
  Upload,
  Space,
  Select,
} from "antd";
import DefaultLayout from "../../Layout/DefaultLayout";
import ClassItem from "../../components/Classroom/ClassItem";
import PageHeading from "../../components/global/PageHeading";
import { UploadOutlined } from "@ant-design/icons";
import {
  AiFillCaretDown,
  AiFillCaretRight,
  AiOutlinePlus,
  AiOutlinePlusCircle,
} from "react-icons/ai";
// import { FaShareAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaShareAlt } from "react-icons/fa";
import ModalAddPracticeInClass from "../../components/Classroom/ModalAddPracticeInClass";
import request from "../../utils/request";
import groupData from "../../utils/Common";
import { useAuth } from "../../contexts/AuthContext";
import JoinNewClass from "../../components/Classroom/JoinNewClass";
import { useSelector } from "react-redux";
const ClassroomStudent = () => {
  const [activeModal, setActiveModal] = useState(false);
  const [dataMonHoc, setDataMonHoc] = useState([]);
  const [active, setActive] = useState({
    join: false,
    noiDung: false,
    out: false,
  });
  // const [isClickClass, setIsClickClass] = useState(null);
  const [groupedData, setGroupedData] = useState([]);
  const [checkboxState, setCheckboxState] = useState({});
  const [reload, setReload] = useState(false);

  const handleModal = (type) => {
    if (type === "join") {
      setActive({ ...active, join: !active.join });
    } else if (type === "noiDung") {
      setActive({ ...active, noiDung: !active.noiDung });
    } else if (type == "out") {
      setActive({ ...active, out: !active.out });
    }
  };

  const currentUser = useSelector((state) => state.user);
  const isTeacher = currentUser[0].teacherID ? "teacher" : "member";
  const data = {
    userID:
      isTeacher == "teacher"
        ? currentUser[0].teacherID
        : currentUser[0].memberID,
    role: isTeacher,
  };

  useEffect(() => {
    // Group data by maMonHoc and tenNhom when the component mounts
    const groupedData = groupData(dataMonHoc);
    setGroupedData(groupedData);
  }, [dataMonHoc, reload]);

  useEffect(() => {
    console.log("RE-RENDERRRRRR");
    const fetchAllDataClass = async () => {
      try {
        const res = await request.post(`subjectgroup/getall`, data);
        console.log(res, "res");
        setDataMonHoc(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllDataClass();
  }, [reload]);

 

  const updateParentState = (newValue) => {
    setReload(newValue);
  };

  console.log(reload, "reload= ===================");
  console.log(active.out, "out");

  return (
    <DefaultLayout>
      <PageHeading
        title="danh sách môn học đã tham gia"
        desc="Toàn bộ môn mà bạn đã tham gia"
      />
      <div className="flex flex-wrap flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleModal("join")}
              className="ICON bg-cyan-600 text-white whitespace-nowrap"
            >
              <AiOutlinePlusCircle />
              Vào lớp mới
            </button>

            <button
              onClick={() => handleModal("out")}
              className="ICON bg-red-600 text-white whitespace-nowrap"
            >
              <AiOutlinePlusCircle />
              Rời lớp
            </button>
          </div>
        </div>

        <div className="bg-gray-100 p-2 w-fit">
          <h1 className="font-semibold text-lg">Chú thích</h1>
          <div className="flex gap-5">
            <div className="flex items-center gap-4">
              <div className="box-primary h-8 w-8"></div>
              <h1>: Lớp thường</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r to-purple-600 from-blue-600 h-8 w-8"></div>
              <h1>: Lớp CLC</h1>
            </div>
          </div>
        </div>
        <div className="">
          {groupedData &&
            groupedData.map((item) => (
              <div className="h-fit">
                <h1 className="font-semibold text-xl capitalize text-gray-900 my-4">
                  {item.subjectName}
                </h1>
                <div className="flex gap-2">
                  {item.children.map((index) => (
                    <ClassItem reload={updateParentState} handleDelete={active.out} data={index} />
                  ))}
                </div>

                <Divider />
              </div>
            ))}
        </div>
      </div>

      <Modal
        onCancel={() => handleModal("join")}
        width={500}
        title="Vào lớp học mới"
        open={active.join}
      >
        <JoinNewClass handleClose={handleModal} reload={updateParentState} />
      </Modal>
    </DefaultLayout>
  );
};

export default ClassroomStudent;
