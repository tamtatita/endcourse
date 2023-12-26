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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSelector } from "react-redux";
import ModalAddFileInClass from "../../components/Classroom/ModalAddFileInClass";
const ClassroomTeacher = () => {
  const [activeModal, setActiveModal] = useState({
    baiTap: false,
    baiGiang: false,
  });
  const [dataMonHoc, setDataMonHoc] = useState([]);
  const [active, setActive] = useState({ baiTap: false, baiGiang: false });
  // const [isClickClass, setIsClickClass] = useState(null);
  const [groupedData, setGroupedData] = useState([]);
  const [checkboxState, setCheckboxState] = useState({});
  const [stateClass, setStateClass] = useState(1);
  const navigate = useNavigate();

  const handleModal = (type) => {
    if (type === "baiTap") {
      setActiveModal({ ...activeModal, baiTap: !activeModal.baiTap });
    } else if (type === "baiGiang") {
      setActiveModal({ ...activeModal, baiGiang: !activeModal.baiGiang });
    }
  };

  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    // Group data by maMonHoc and tenNhom when the component mounts
    const groupedData = groupData(dataMonHoc);
    setGroupedData(groupedData);
  }, [dataMonHoc, stateClass]);

  useEffect(() => {
    const fetchAllDataClass = async () => {
      const dataSubmit = {
        userID: currentUser[0].teacherID || currentUser[0].memberID,
        role: currentUser[0].role,
        status: stateClass,
      };
      console.log(dataSubmit, 'submit--------')
      try {
        const res = await request.post("subjectgroup/getall", dataSubmit);
        console.log(res, "res");
        setDataMonHoc(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllDataClass();
  }, [stateClass]);

  const handleChangeState = (type) => {
    if (type == "teaching") {
      setStateClass(1);
    } else if (type == "end") {
      setStateClass(0);
    }
  };

  console.log(dataMonHoc, "xxx");

  return (
    <DefaultLayout>
      <PageHeading
        title="danh sách môn học giảng dạy"
        desc="Toàn bộ môn mà giảng viên dạy, bạn có thể thêm lớp học"
      />
      <div className="flex flex-wrap flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Select
              defaultValue="HK1"
              style={{
                width: 120,
              }}
              // onChange={handleChange}
              options={[
                {
                  value: "HK1",
                  label: "HK1",
                },
                {
                  value: "HK2",
                  label: "HK2",
                },
                {
                  value: "HK3",
                  label: "HK3",
                },
              ]}
            />
            <Select
              defaultValue="2023-2024"
              style={{
                width: 120,
              }}
              options={[
                {
                  value: "2023-2024",
                  label: "2023-2024",
                },
              ]}
            />
          </div>

          <Input className='mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300' placeholder="Tìm kiếm tên lớp: Ví dụ Cơ sở dữ liệu" />

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/class/add")}
              className="ICON bg-cyan-600 text-white whitespace-nowrap"
            >
              <AiOutlinePlusCircle />
              Thêm lớp
            </button>
            {/* <button
              onClick={() => handleModal("baiGiang")}
              className="ICON bg-lime-500 text-white whitespace-nowrap"
            >
              <FaShareAlt />
              Gửi nội dung cho lớp
            </button>

            <button
              onClick={() => handleModal("baiTap")}
              className="ICON bg-yellow-400 text-white whitespace-nowrap"
            >
              <AiOutlinePlus />
              Tạo bài tập
            </button> */}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleChangeState("teaching")}
            className={`ICON bg-gray-200 text-black ${
              stateClass == 1 ? "bg-red-500 text-white" : ""
            }`}
          >
            Lớp đang dạy
          </button>
          <button
            onClick={() => handleChangeState("end")}
            className={`ICON bg-gray-200 text-black ${
              stateClass == 0 ? "bg-red-500 text-white" : ""
            }`}
          >
            Lớp đã dạy
          </button>
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
                    <ClassItem data={index} />
                  ))}
                </div>

                <Divider />
              </div>
            ))}
        </div>
      </div>

      <Modal
        onCancel={() => handleModal("baiGiang")}
        width={900}
        open={activeModal.baiGiang}
        title="Gửi bài giảng cho lớp"
      >
        <ModalAddFileInClass />
      </Modal>

      <Modal
        onCancel={() => handleModal("baiTap")}
        width={900}
        title="Tạo bài tập cho mỗi lớp"
        open={activeModal.baiTap}
      >
        <ModalAddPracticeInClass />
      </Modal>
    </DefaultLayout>
  );
};

export default ClassroomTeacher;
