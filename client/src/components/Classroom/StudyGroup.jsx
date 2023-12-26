import Title from "../Home/Title";
import add from "../../assets/add.png";
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Modal,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaFilePowerpoint } from "react-icons/fa6";
import { PiListNumbersBold } from "react-icons/pi";
import {
  AiFillDelete,
  AiFillEdit,
  AiFillPlusCircle,
  AiOutlinePlus,
} from "react-icons/ai";
import { useCallback, useEffect, useState } from "react";

import note from "../../assets/note.gif";
import PageTitleSmall from "../global/PageTitleSmall";
import request from "../../utils/request";
import { useParams } from "react-router-dom";
import { BiNotepad } from "react-icons/bi";
import fire from "../../assets/fire_big.png";
const StudyGroup = () => {
  const [active, setActive] = useState({ modal: false, isInProgress: false });
  const [item, setItem] = useState([]);
  const [dataGroup, setDataGroup] = useState([]);
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    const newGroupedData = {};
    console.log("1");
    for (const item of dataGroup) {
      const key = `${item.subjectGroupID}_${item.studyGroupID}`;

      if (!newGroupedData[key]) {
        newGroupedData[key] = {
          subjectGroupID: item.subjectGroupID,
          studyGroupID: item.studyGroupID,
          studyGroupName: item.studyGroupName,
          studyGroupDayCreate: item.studyGroupDayCreate,
          studyGroupIsDelete: item.studyGroupIsDelete,
          studyGroupDayClose: item.studyGroupDayClose,
          limitMember: item.limitMember,
          limitGroup: item.limitGroup,
          Children: [],
        };
      }

      const child = {
        studyGroupDetailID: item.studyGroupDetailID,
        detailName: item.detailName,
        dayCreate: item.dayCreate,
        Members: [
          {
            memberID: item.memberID,
            memberName: item.memberName,
            MSSV: item.MSSV,
            memberSex: item.memberSex,
          },
        ],
      };

      newGroupedData[key].Children.push(child);
    }

    const result = Object.values(newGroupedData);

    setGroupedData(result);
  }, [dataGroup]);

  console.log(groupedData);
  const { classCode } = useParams();

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const res = await request.post(`studygroup/getall/${classCode}`);
        setDataGroup(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);

  console.log('data', dataGroup)

  useEffect(() => {
    const now = new Date();
    const close = new Date("2023-10-1");
    console.log(close, "close");

    if (now >= close) {
      setActive({ ...active, isInProgress: false });
    } else {
      setActive({ ...active, isInProgress: true });
    }
  }, [groupedData]);

  console.log(dataGroup, "ccc");

  const handleOpenAdd = (type) => {
    if (type == "addmodal") {
      setActive({ ...active, modal: !active.modal });
    }
  };

  console.log(item, active.isInProgress);
  return (
    <div>
      <PageTitleSmall title="nhóm học tập" />

      {active.isInProgress ? (
        <div className="relative w-full flex my-4">
          <img
            src={fire}
            alt=""
            className="w-12 h-18 object-cover absolute right-2 -top-10"
          />
          <h1 className="bg-gradient-to-r to-red-500 from-orange-500 px-3 py-2 rounded-sm text-white w-full font-bold text-base ">
            Việc chọn nhóm học tập của sinh viên đang được diễn ra
          </h1>
        </div>
      ) : (
        <div className="justify-end flex my-4 gap-3">
          <button
            onClick={() => handleOpenAdd("addmodal")}
            className="ICON bg-yellow-100 text-orange-500"
          >
            <BiNotepad />
            Chỉnh sửa
          </button>
          <button
            onClick={() => handleOpenAdd("addmodal")}
            className="ICON bg-lime-50 text-green-500"
          >
            <BiNotepad />
            Xác nhận tạo nhóm học tập
          </button>
        </div>
      )}

      <Divider />
      <div className="flex flex-wrap gap-4 ">
        {dataGroup.length > 0 &&
          dataGroup.map((item, index) => (
            <BoxStudyGroup props={item} index={index} />
          ))}
      </div>

      <pre>{JSON.stringify(groupedData, null, 2)}</pre>

      <Modal
        title="Tạo nhóm học tập"
        width={500}
        onCancel={() => handleOpenAdd("addmodal")}
        open={active.modal}
      >
        <ModalAddStudyGroup handleClose={handleOpenAdd} />
      </Modal>

      {/* <Modal title={item?.studyGroupName}>
        <ModalStudyGroup item={item} />
      </Modal> */}
    </div>
  );
};

const ModalAddStudyGroup = ({ handleClose }) => {
  const { classCode } = useParams();
  const [show, setShow] = useState({
    day: false,
    totalGroup: false,
    totalMember: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    if (name === "showDatePicker") {
      setShow({ ...show, day: checked });
    } else if (name === "limitGroup") {
      setShow({ ...show, totalGroup: checked });
    } else if (name === "limitMembers") {
      setShow({ ...show, totalMember: checked });
    }
  };
  const onFinish = async (values) => {
    console.log("Success:", values);
    const data = {
      studyGroupName: values.studyGroupName,
      studyGroupDayClose: values.studyGroupDayClose,
      limitMember: values.studyGroupLimitMember,
      limitGroup: values.studyGroupLimitGroup,
    };
    console.log(data.studyGroupDayClose, "NGÀY GIỜ");
    try {
      const res = await request.post(`studygroup/add/${classCode}`, data);
      message.success(
        "Bạn đã tạo các nhóm lớp thành công, việc còn lại là chờ sinh viên vào các nhóm đó"
      );
      setTimeout(() => {
        handleClose("addmodal");
      }, 2000);
      handleClose("addmodal");
    } catch (error) {
      message.error("Đã có lỗi xảy ra khi thêm ");
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onChange = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  };
  return (
    <div className="">
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Tên nhóm"
          name="studyGroupName"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input placeholder="Nhóm cơ sở dữ liệu - Nhóm 3" />
        </Form.Item>

        <div className="flex flex-col">
          <Checkbox
            name="showDatePicker"
            checked={show.day}
            onChange={handleCheckboxChange}
          >
            Hiển thị ngày đóng Form
          </Checkbox>

          {show.day && (
            <Form.Item name="studyGroupDayClose" label="Chọn ngày">
              <DatePicker showTime onChange={onChange} />
            </Form.Item>
          )}

          <Checkbox
            name="limitGroup"
            checked={show.totalGroup}
            onChange={handleCheckboxChange}
          >
            Giới hạn số lượng nhóm ?
          </Checkbox>

          {show.totalGroup && (
            <Form.Item
              name="studyGroupLimitGroup"
              label="Số lượng giới hạn nhóm"
            >
              <InputNumber />
            </Form.Item>
          )}

          <Checkbox
            name="limitMembers"
            checked={show.totalMember}
            onChange={handleCheckboxChange}
          >
            Giới hạn thành viên trong 1 nhóm ?
          </Checkbox>

          {show.totalMember && (
            <Form.Item
              name="studyGroupLimitMember"
              label="Số lượng giới hạn thành viên"
            >
              <InputNumber />
            </Form.Item>
          )}
        </div>

        <Form.Item>
          <button
            className="ICON text-white bg-cyan-500 my-4"
            htmlType="submit"
          >
            <AiFillPlusCircle />
            Tạo Nhóm
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

const ModalStudyGroup = ({ item }) => {
  // Hàm tính điểm trung bình cho một sinh viên
  function tinhDiemTrungBinh(baiTap) {
    if (baiTap.length === 0) return 0; // Tránh chia cho 0
    const tongDiem = baiTap.reduce(
      (total, practice) => total + practice.diem,
      0
    );
    return (tongDiem / baiTap.length).toFixed(2); // Làm tròn đến 2 chữ số thập phân
  }
  const dataGhiChu = [
    { id: 1, desc: "Nhóm này đã nộp bài đâu tiên", ngayTao: "23/2/2023" },
    { id: 2, desc: "Nhóm này đã nộp bài đâu tiên", ngayTao: "23/2/2023" },
    { id: 3, desc: "Nhóm này đã nộp bài đâu tiên", ngayTao: "23/2/2023" },
    { id: 4, desc: "Nhóm này đã nộp bài đâu tiên", ngayTao: "23/2/2023" },
    { id: 5, desc: "Nhóm này đã nộp bài đâu tiên", ngayTao: "23/2/2023" },
    {
      id: 6,
      desc: "Nhóm này đã nộp bài đâu tiên nha quý zị",
      ngayTao: "23/2/2023",
    },
  ];
  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center justify-end gap-3">
        <Tooltip title="Thêm thành viên">
          <button className="p-2 rounded-full bg-cyan-100 text-cyan-500 ">
            <AiOutlinePlus />
          </button>
        </Tooltip>
        <Tooltip title="Chỉnh sửa tên nhóm">
          <button className="p-2 rounded-full bg-yellow-100 text-orange-500 ">
            <AiFillEdit />
          </button>
        </Tooltip>

        <Tooltip title="Xóa nhóm học tập">
          <button className="p-2 rounded-full bg-red-100 text-red-500 ">
            <AiFillDelete />
          </button>
        </Tooltip>
      </div>

      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="flex gap-2 min-w-full py-2 sm:px-6 lg:px-8">
            {/* GHI CHÚ */}
            <div className="w-[20%] bg-yellow-200  justify-between flex-col flex p-2 relative">
              <div className="flex items-center gap-4 h-[50px]">
                <img src={note} alt="" className="h-20 w-10 object-contain" />
                <h4 className="text-base font-bold">Ghi chú nhóm</h4>
              </div>
              <div className="flex flex-col gap-5 relative overflow-y-scroll overflow-x-hidden my-4 h-[200px]">
                {dataGhiChu.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white relative px-1 py-2 rounded-md font-semibold text-gray-900 "
                  >
                    <h1>{item.desc}</h1>
                    <Tag
                      color="green-inverse"
                      className="absolute -top-3 -right-3"
                    >
                      {item.ngayTao}
                    </Tag>
                  </div>
                ))}
              </div>
              <div className="">
                <Input placeholder="Nhập ghi chú" />
              </div>
            </div>
            {/* TABLE */}
            <div className="overflow-hidden w-[80%]">
              <table className="min-w-full text-center text-sm font-light">
                <thead className="border-b box-primary font-semibold text-white ">
                  <tr>
                    <th scope="col" className=" px-6 py-4">
                      MSSV
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Tên thành viên
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Bài tập
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Điểm trung bình
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {item?.children?.map((index) => (
                    <tr className="border-b dark:border-neutral-500 text-black font-semibold text-base">
                      <td className="whitespace-nowrap  px-6 py-4 font-medium">
                        {index.mssv}
                      </td>
                      <td className="whitespace-nowrap  px-6 py-4">
                        {index.tenThanhVien}
                      </td>
                      <td className="whitespace-nowrap  px-6 py-4">
                        <div className="">
                          {index?.baiTap?.map((practice) => (
                            <ul className="flex items-center gap-2 text-black w-[350px] justify-between">
                              <li className="w-[60%] max-w-[60%] truncate">
                                {practice?.tenBaiTap}
                              </li>
                              <Tag className="w-[10%]" color="red-inverse">
                                {practice?.diem}
                              </Tag>

                              <Tag className="w-[20%]" color="yellow-inverse">
                                {practice?.ngayNop}
                              </Tag>
                            </ul>
                          ))}
                        </div>
                      </td>
                      <td className="whitespace-nowrap  px-6 py-4">
                        <Tag color="#33334F">
                          {tinhDiemTrungBinh(index.baiTap)}
                        </Tag>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BoxStudyGroup = ({ props, index }) => {
  const {
    studyGroupDetailID,
    detailName,
    dayCreate,
    Children,
    Members,
    memberName,
  } = props;

  const items = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          Xóa nhóm học tập
        </a>
      ),
    },
  ];
  return (
    <div
      // onClick={() => handleActiveModal(item)}
      key={studyGroupDetailID}
      className=" shadow-lg bg-[#33334F] cursor-pointer text-white shadow-gray-300 w-[24%] mb-2 px-3 py-5 rounded-md h-[200px] "
    >
      <div className="flex items-center justify-between mb-2 bg-white p-2 rounded-sm ">
        <h4 className="font-extrabold text-lg uppercase   text-[#F5234B]">
          {detailName}
        </h4>
        <Dropdown
          menu={{
            items,
          }}
          placement="bottomLeft"
        >
          <button className="p-2 rounded-full  bg-gray-500">
            {<BsThreeDotsVertical />}
          </button>
        </Dropdown>
      </div>
      <div className="flex justify-between items-center">
        <Tag className="font-semibold text-base" color="green">
          Thành viên: {Members?.length}
        </Tag>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between my-3">
          <div className="gap-3 flex items-center font-semibold">
            <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 w-fit">
              <FaFilePowerpoint />
            </div>
            <h4>Điểm trung bình {memberName}</h4>
          </div>
          <div className="">
            <span className="font-bold text-base">
              {/* {item.diemTrungBinh} */}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="gap-3 flex items-center font-semibold">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600 w-fit">
              <PiListNumbersBold />
            </div>
            <h4>Số bài tập</h4>
          </div>
          <div className="">
            <span className="font-bold text-base">
              {/* {item.soLuongBaiTap} */}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyGroup;
