import React, { useEffect, useState } from "react";
import DefaultLayout from "../../Layout/DefaultLayout";
import {
  Button,
  DatePicker,
  Drawer,
  Input,
  InputNumber,
  Radio,
  Space,
  Table,
  Tabs,
  Tag,
} from "antd";
import { formatISO, addWeeks } from "date-fns";
import { DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import { BiSubdirectoryRight } from "react-icons/bi";
import { IoMdRemove } from "react-icons/io";
import {
  AiFillDelete,
  AiFillEdit,
  AiOutlinePlus,
  AiOutlineSave,
} from "react-icons/ai";
import { BsClipboardPlus } from "react-icons/bs";
import PageHeading from "../../components/global/PageHeading";
import Title from "../../components/Home/Title";
import check from "../../assets/check.png";
import uncheck from "../../assets/uncheck.png";
import inprogress from "../../assets/inprogress.png";
import indexImg from "../../assets/index.png";
import { FaChartGantt } from "react-icons/fa6";
const LessonPlanStudent = () => {
  const data = [
    { id: 1, tenMonHoc: "Cơ sở dữ liệu", soTuanDay: 2 },
    { id: 2, tenMonHoc: "Cơ sở dữ liệu phân tán", soTuanDay: 5 },
    { id: 3, tenMonHoc: "Hệ quản trị cơ sở dữ liệu", soTuanDay: 2 },
    { id: 4, tenMonHoc: "Cơ sở lập trình", soTuanDay: 2 },
  ];
  const [open, setOpen] = useState(false);
  const { TabPane } = Tabs;
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const columns = [
    { key: "name", dataIndex: "name", title: "Tên Chương" },
    { key: "children", dataIndex: "children", title: "Mô tả" },
    { key: "tuanDuDinh", dataIndex: "tuanDuDinh", title: "Tuần dự định dạy" },
    {
      key: "status",
      dataIndex: "status",
      title: "Trạng thái",
      render: (status) => (
        <img
          src={status == 1 ? check : status == 2 ? inprogress : uncheck}
          alt="status_icon"
        />
      ),
    },
  ];

  const dataLesson = [
    {
      id: "4322",
      name: "Tổng quan cơ sở dữ liệu",
      status: 1,
      children: [
        { id: 31, desc: "Học về mở đầu", tuanDuDinh: "Tuần 1" },
        { id: 3341, desc: "Học về mở đầu", tuanDuDinh: "Tuần 2" },
        {
          id: 34321,
          desc: "Học về mở đầu cajjjjjjjjjjjjjjj fuuwwwwwwwwww",
          tuanDuDinh: "Tuần 3",
        },
      ],
      tuanDuDinh: "Tuần 1",
    },
    {
      id: "432243",
      name: "Tổng quan cơ sở dữ liệu",
      status: 1,
      children: [
        { id: 3331, desc: "Học về mở đầu", tuanDuDinh: "Tuần 1" },
        { id: 334321, desc: "Học về mở đầu", tuanDuDinh: "Tuần 2" },
        {
          id: 34321,
          desc: "Học về mở đầu cajjjjjjjjjjjjjjj fuuwwwwwwwwww",
          tuanDuDinh: "Tuần 3",
        },
      ],
      tuanDuDinh: "Tuần 1",
    },
  ];
  return (
    <DefaultLayout>
      <PageHeading
        title="KHỞI TẠO giáo án"
        desc="Nơi cập nhật chương trình giảng dạy cho giảng viên"
      />
      <div className="flex flex-col">
        <div className="my-4 flex justify-end  w-full gap-3 items-center">
          <button className="bg-yellow-400 px-4 py-2 rounded-sm text-base font-semibold text-black flex items-center gap-2">
            <FaChartGantt />
            Xem biểu đồ Gantt
          </button>
          <button
            className="bg-green-400 px-4 py-2 rounded-sm text-base font-semibold text-white flex items-center gap-3"
            onClick={() => showDrawer()}
          >
            <AiOutlinePlus />
            Tạo giáo án mới
          </button>
        </div>
        <Drawer
          title="Tạo giáo án"
          placement="right"
          onClose={onClose}
          open={open}
          size="large"
        >
          <div className="">
            <AddDrawer />
          </div>
        </Drawer>
        <div className="">
          <Tabs tabPosition="left" type="card">
            {data.map((item) => (
              <TabPane key={item.id} tab={item.tenMonHoc}>
                <div className="w-full h-screen border-[1px] border-purple-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold text-lg text-gray-800">
                      Bạn đang chọn môn:{" "}
                    </h1>
                    <span className="font-bold text-lg bg-purple-100 px-3 py-1 rounded-sm text-purple-500 capitalize">
                      {item.tenMonHoc}
                    </span>
                  </div>

                  {/* CHỌN TIẾN ĐỘ */}
                  <div className="mt-1 p-4  rounded-md text-gray-900 ">
                    <div className="">
                      {dataLesson.map((item) => (
                        <div className="bg-[#F5F5F5] mb-3 p-3 rounded-md">
                          <h1 className="font-bold text-base uppercase">
                            {item.name}
                          </h1>
                          <div className="pl-6 italic text-sm font-semibold  ">
                            <ul>
                              {item.children.map((index) => (
                                <div className="flex items-center border-b-[1px] border-gray-200 pt-3 pb-2">
                                  <img src={indexImg} alt="" className="mr-3" />
                                  <li className="w-1/2 truncate" key={index.id}>
                                    {index.desc}
                                  </li>
                                  <div className="flex items-center justify-between w-1/2">
                                    <Tag color="purple-inverse">
                                      {index.tuanDuDinh}
                                    </Tag>
                                    <div className="flex items-center gap-3">
                                      <button className="p-1 rounded-sm bg-yellow-500 text-white">
                                        <AiFillEdit />
                                      </button>
                                      <button className="p-1 rounded-sm bg-red-500 text-white">
                                        <AiFillDelete />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
    </DefaultLayout>
  );
};

const AddDrawer = () => {
  const data = [
    { id: 1, tenMonHoc: "Cơ sở dữ liệu", soTuanDay: 2 },
    { id: 2, tenMonHoc: "Cơ sở dữ liệu phân tán", soTuanDay: 5 },
    { id: 3, tenMonHoc: "Hệ quản trị cơ sở dữ liệu", soTuanDay: 2 },
    { id: 4, tenMonHoc: "Cơ sở lập trình", soTuanDay: 2 },
  ];

  const chooseProgress = [{ id: 2, name: "Tiến độ theo chương môn học" }];

  const [value, setValue] = useState(1);
  const [open, setOpen] = useState(false);

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const [dataDate, setDataDate] = useState({
    startDate: "",
    numberOfWeek: 15,
    endDate: "",
  });
  const handleStartDateChange = (date, dateString) => {
    setDataDate({ ...dataDate, startDate: dateString });
    // calculateEndDate(dataDate.startDate, dataDate.numberOfWeek)
  };

  const handleNumberOfWeeksChange = (value) => {
    setDataDate({ ...dataDate, numberOfWeek: value });
    // calculateEndDate(dataDate.startDate, value);
  };
  let caculatePercent = (1 / dataDate.numberOfWeek) * 100;
  const percentProgress = caculatePercent.toFixed(2) || 0;
  useEffect(() => {
    if (dataDate.startDate && dataDate.numberOfWeek) {
      const startDate = new Date(dataDate.startDate);
      const endDate = addWeeks(startDate, dataDate.numberOfWeek);
      setDataDate((prevState) => ({
        ...prevState,
        endDate: formatISO(endDate, { representation: "date" }),
      }));
    }
    if (dataDate.startDate == "") {
      setDataDate({ ...dataDate, endDate: "" });
    }
  }, [dataDate.startDate, dataDate.numberOfWeek]);

  const [inputs, setInputs] = useState([{ id: 1, indices: [] }]);

  const addInput = () => {
    const newInput = { id: inputs.length + 1, indices: [] };
    setInputs([...inputs, newInput]);
  };

  const addIndex = (inputId) => {
    const updatedInputs = inputs.map((input) => {
      if (input.id === inputId) {
        const newIndex = input.indices.length + 1;
        return { ...input, indices: [...input.indices, newIndex] };
      }
      return input;
    });
    setInputs(updatedInputs);
  };

  // Hàm xử lý sự kiện thay đổi giá trị của Input
  const handleInputChange = (index, value) => {
    const updatedInputList = [...inputList];
    updatedInputList[index].value = value;
    setInputList(updatedInputList);
  };

  // Hàm xử lý sự kiện xóa Input
  // const removeInput = (index) => {
  //   const updatedInputList = [...inputList];
  //   updatedInputList.splice(index, 1);
  //   setInputList(updatedInputList);
  // };

  const removeInput = (inputId) => {
    const updatedInputs = inputs.filter((input) => input.id !== inputId);
    setInputs(updatedInputs);
  };

  const removeIndex = (inputId, index) => {
    const updatedInputs = inputs.map((input) => {
      if (input.id === inputId) {
        const updatedIndices = input.indices.filter((idx) => idx !== index);
        return { ...input, indices: updatedIndices };
      }
      return input;
    });
    setInputs(updatedInputs);
  };

  const tinhTienDoChuong = (1 / inputs.length) * 100;
  const phanTramTienDoChuong = tinhTienDoChuong.toFixed(2);

  return (
    <div className="">
      <div className="w-full h-[400px] overflow-y-scroll">
        <h1 className="font-bold text-white text-xl my-2 uppercase ">
          Tạo mới chương môn học
        </h1>

        <div className="w-full">
          {inputs.map((input, index) => (
            <div className="flex w-full items-center gap-4 " key={index + 1}>
              <div className="flex flex-col text-black  w-full justify-start bg-white my-1 rounded-lg p-4">
                <span>Chương {index + 1} </span>
                <Input
                  className="w-[360px]"
                  placeholder={`Nhập tên chương ${index + 1}`}
                />
                {input.indices.map((index) => (
                  <div
                    className="ml-8 flex items-center gap-3 w-[360px] my-2"
                    key={index}
                  >
                    <div className="p-2 rounded-full bg-yellow-400 text-white">
                      {<BiSubdirectoryRight />}
                    </div>
                    <Input
                      placeholder={`Chỉ mục ${index} của chương ${input.id}`}
                    />
                    <button
                      className="p-2 rounded-full text-red-500 bg-red-100"
                      onClick={() => removeIndex(input.id, index)}
                    >
                      <AiFillDelete />
                    </button>
                  </div>
                ))}
              </div>
              <Space>
                <button
                  className=" px-3 py-2 rounded-md font-semibold bg-green-500 text-white flex items-center gap-2"
                  onClick={() => addIndex(index + 1)}
                >
                  <BsClipboardPlus />
                  Thêm chỉ mục
                </button>

                <button
                  className="p-2 rounded-full text-white bg-red-500"
                  onClick={() => removeInput(input.id)}
                >
                  <AiFillDelete />
                </button>
              </Space>
              {/* {input.indices.map((index) => (
                                    <input
                                      key={index}
                                      type="text"
                                      placeholder={`Chỉ mục ${index} của Input ${input.id}`}
                                    />
                                  ))} */}
            </div>
          ))}

          <div className="bg-white rounded-md text-purple-500 my-5 text-center py-3 font-semibold text-lg">
            <h5>
              Cứ qua mỗi chương, tiến độ môn học sẽ tăng{" "}
              <span className="text-red-500 font-extrabold">
                {phanTramTienDoChuong}%
              </span>
            </h5>
          </div>
          <div className="flex items-center justify-between">
            <button
              className=" px-3 py-2 rounded-md font-semibold bg-cyan-500 text-white flex items-center gap-2"
              onClick={addInput}
            >
              <AiOutlinePlus />
              Thêm chương mới
            </button>

            <button
              className=" px-3 py-2 rounded-md font-semibold bg-yellow-500 text-white flex items-center gap-2"
              onClick={addInput}
            >
              <AiOutlineSave />
              Lưu cấu hình
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanStudent;
