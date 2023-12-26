import {
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Tag,
  Tooltip,
  message,
} from "antd";
import { GiHamburgerMenu } from "react-icons/gi";
import request from "../../utils/request";
import React, { useEffect, useState } from "react";
import { BiNotepad } from "react-icons/bi";
import PageTitleSmall from "../global/PageTitleSmall";
import CONVERT from "../../hooks/useConvertDayTime";
import { useParams } from "react-router-dom";
import { BsCardChecklist, BsFillBoxFill, BsFlag } from "react-icons/bs";
import list from "../../assets/list.png";
import {
  AiFillDelete,
  AiFillEdit,
  AiFillFlag,
  AiOutlineDelete,
  AiOutlineOrderedList,
  AiOutlinePlus,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import light from "../../assets/idea.png";
import { dataTag } from "../../constants";
import { FaSave, FaThList } from "react-icons/fa";
import { TimeMysql } from "../../utils/Common";
import moment from "moment-timezone";
import { MdDelete, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";

const { TextArea } = Input;
const NoteClassroom = () => {
  const [dataNote, setDataNote] = useState([]);
  const [active, setActive] = useState({
    detail: false,
    add: false,
    todolist: false,
    typeBoard: true,
    reload: false,
  });
  const currentUser = useSelector((state) => state.user);

  const [reload, setReload] = useState(false);
  const [itemNote, setItemNote] = useState([]);
  const [dataCell, setDataCell] = useState([]);
  const { classCode } = useParams();

  useEffect(() => {
    fetchAPI();
    console.log("render =====");
    setReload(false);
  }, [reload]);

  const fetchAPI = async () => {
    console.log("load hàm reload trong fetch");
    const dataSubmit = { teacherID: currentUser[0].teacherID };
    try {
      const dataNotes = await request.post(
        `note/getall/${classCode}`,
        dataSubmit
      );
      setDataNote(dataNotes.data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(dataNote, "data note");

  const handleCloseModal = () => {
    setActive({ ...active, detail: false });
  };

  const handleOpenAdd = () => {
    setActive({ ...active, add: true });
  };
  const handleCloseAdd = () => {
    setActive({ ...active, add: false });
  };
  console.log(itemNote, "hhh");

  const handleReload = () => {
    console.log("load hàm reload");
    setReload(true);
  };
  const onFinish = async (values) => {
    const dataSubmit = {
      noteTag: values?.noteTag,
      noteDesc: values?.noteDesc,
      teacherID: currentUser[0].teacherID,
    };
    try {
      const res = await request.post(`note/add/${classCode}`, dataSubmit);
      console.log("res", res);
      if (res.data.affectedRows == 1) {
        message.success("Đã thêm ghi chú thành công. ");
        handleReload();
        setTimeout(() => {
          handleCloseAdd();
        }, 2000);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi thêm ghi chú");
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  console.log(active.reload, "reload");

  return (
    <div>
      <PageTitleSmall title="ghi chú" />
      {/* header */}
      <div className="flex my-4 items-center justify-between">
        <div className=""></div>
        <div className="justify-end flex items-center gap-3">
          <button
            onClick={() => handleOpenAdd()}
            className="px-4 py-2 rounded-md bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 flex items-center gap-3"
          >
            <BiNotepad />
            Thêm ghi chú
          </button>
        </div>
      </div>
      {/* content */}
      <div className="flex flex-wrap justify-between h-[500px] overflow-y-scroll">
        <div className="flex flex-col w-full px-2">
          {dataNote &&
            dataNote.length > 0 &&
            dataNote.map((item) => (
              <BoardComponent
                classCode={classCode}
                reload={handleReload}
                dataNote={item}
                dataCell={dataCell}
              />
            ))}
        </div>

        <Modal
          width={900}
          title="Nội dung ghi chú"
          open={active.detail}
          onCancel={() => handleCloseModal()}
        >
          <div className="">
            <div className="flex items-center gap-3 justify-end my-3">
              <Tooltip title="Chỉnh sửa ghi chú">
                <button
                  onClick={() => setDataCell(itemNote)}
                  className="p-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-500 "
                >
                  <AiFillEdit />
                </button>
              </Tooltip>

              <Tooltip title="Xóa ghi chú">
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  onConfirm={() => confirm()}
                  okText="Xóa"
                  cancelText="Không"
                >
                  <button className="p-2 rounded-md bg-red-500 text-white hover:bg-red-500 ">
                    <AiFillDelete />
                  </button>
                </Popconfirm>
              </Tooltip>
            </div>
            <div className="flex items-start justify-between">
              <div className="flex flex-col w-fit gap-3">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <h1>Ngày ghi: </h1>
                  <Tag color="lime">
                    <CONVERT type="full" dayTime={itemNote?.noteDayCreate} />
                  </Tag>
                </div>

                {itemNote?.noteDayChange !== itemNote?.noteDayCreate && (
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <h1>Ngày chỉnh: </h1>
                    <Tag color="error">
                      <CONVERT
                        type="full"
                        dayTime={itemNote?.noteDayChange || "Không có"}
                      />
                    </Tag>
                  </div>
                )}
              </div>
              <div className="">
                <Tag
                  color={
                    itemNote?.noteTag == "Chung"
                      ? "lime"
                      : itemNote?.noteTag == "Ôn thi"
                      ? "cyan-inverse"
                      : itemNote?.noteTag == "Kiểm tra"
                      ? "yellow-inverse"
                      : itemNote?.noteTag == "Dặn dò"
                      ? "purple-inverse"
                      : "red-inverse"
                  }
                  className="font-bold text-lg"
                >
                  {itemNote?.noteTag}
                </Tag>
              </div>
            </div>

            {/* CONTENT */}
            <div className="h-[200px] overflow-y-scroll my-3">
              <span>{itemNote?.noteDesc}</span>
            </div>
          </div>
        </Modal>

        <Modal
          width={500}
          title="Tạo ghi chú mới"
          open={active.add}
          onCancel={handleCloseAdd}
        >
          <div className=" w-full ">
            <div className="flex p-2 border-[1px] border-gray-300 my-3">
              <div className="w-full mr-3 box-primary text-white">
                <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
                  <Tag color="lime-inverse" className="mx-3 mt-2 ">
                    Thẻ Tag
                  </Tag>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Hãy chọn thẻ Tag !",
                      },
                    ]}
                    name="noteTag"
                  >
                    {/* TAG */}

                    <div className="text-black p-3 bg-white m-3 rounded-md">
                      <Radio.Group className="">
                        <Radio value="Chung">Chung</Radio>
                        <Radio value="Ôn thi">Ôn thi</Radio>
                        <Radio value="Dặn dò">Dặn dò</Radio>
                        <Radio value="Kiểm tra">Kiểm tra</Radio>
                        <Radio value="Nghỉ bù">Nghỉ bù</Radio>
                        <Radio value="Tiến độ">Tiến độ</Radio>
                      </Radio.Group>
                    </div>
                  </Form.Item>

                  <Form.Item
                    name="noteDesc"
                    rules={[
                      {
                        required: true,
                        message: "Hãy nhập nội dung !",
                      },
                    ]}
                  >
                    <div className="p-3">
                      <Tag color="lime-inverse" className="my-2">
                        Nhập ghi chú
                      </Tag>

                      <TextArea
                        rows={4}
                        placeholder="Nhập ghi chú"
                        // maxLength={6}
                      />
                    </div>
                  </Form.Item>

                  <Form.Item>
                    <button
                      className="ICON flex text-center justify-center w-full bg-blue-600 text-white"
                      type="primary"
                      htmlType="submit"
                    >
                      <FaSave />
                      Lưu
                    </button>
                  </Form.Item>
                </Form>
              </div>

              {/* <div className="w-1/2">
                {active.todolist && (
                  <div className="box-primary text-white px-3 py-4">
                    <div className="flex items-center justify-between">
                      <h1 className="font-bold text-lg  ">
                        Tạo Todo list quản lý các tác vụ thôi nào
                      </h1>
                      <img src={light} alt="" />
                    </div>

                    <div className="">
                      <div className="flex flex-col">
                        <span>Tiêu đề</span>
                        <Input placeholder="Nhập tiêu đề " />
                      </div>

                      <div className="mt-3">
                        {todos?.map((todo, index) => (
                          <div
                            className="flex items-center justify-between mb-2 border-b-[1px] border-gray-200 pb-2"
                            key={index}
                          >
                            <div className="flex">
                              <div
                                className={`p-1 mr-2 rounded-sm ${
                                  todo.priority == 1
                                    ? "bg-red-500"
                                    : todo.priority == 2
                                    ? "bg-yellow-500"
                                    : "bg-cyan-500"
                                } text-white`}
                              >
                                <AiFillFlag className="" />
                              </div>

                              <div className="">
                                <Checkbox
                                  checked={todo.isCheck}
                                  onChange={() => handleToggleTodo(index)}
                                >
                                  <span
                                    className="text-white"
                                    style={{
                                      textDecoration: todo.isCheck
                                        ? "line-through"
                                        : "none",
                                    }}
                                  >
                                    {todo.name}
                                  </span>
                                </Checkbox>
                              </div>
                            </div>

                            <button
                              className="p-2 rounded-md bg-white border-red-500 text-red-500"
                              onClick={() => handleDeleteTodo(index)}
                            >
                              <AiOutlineDelete />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 mb-3">
                        <button
                          onClick={() => handleAddTodo()}
                          className="p-2 rounded-md flex items-center gap-2 bg-green-100 text-green-600 font-semibold"
                        >
                          <AiOutlinePlus />
                          Thêm công việc
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

const BoardComponent = ({ dataCell, classCode, reload, dataNote }) => {
  const [edit, setEdit] = useState(false);

  // XÓA GHI CHÚ
  const confirm = async (e) => {
    const idNote = dataNote?.noteID;
    console.log(idNote, "id note");
    const res = await request.delete(`note/delete/${classCode}/${idNote}`);
    if (res.status === 200) {
      console.log(res);
      message.success(`Đã xóa ghi chú thành công`);
      reload();
    } else {
      message.warning(`Đã có lỗi xảy ra khi xóa ghi chú `);
    }
  };
  const DetrucTime = (time) => {
    return moment(time).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY hh:mm:ss");
  };

  console.log(edit, "edit");

  const onFinishEdit = async (values) => {
    console.log("Success:", values);
    try {
      const dataSubmit = {
        noteID: dataNote?.noteID,
        noteTag: values.noteTag,
        noteDesc: values.noteDesc,
      };
      const res = await request.patch("note/edit", dataSubmit);
      console.log(res, "res");
      if (res.data.changedRows == 1) {
        message.success("Bạn đã cập nhật thành công ghi chú");
        reload();
        handleCloseModal();
      } else {
        message.error("Đã có lỗi xảy ra");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setEdit(!edit);
  };
  const { TextArea } = Input;
  return (
    <div className="h-fit w-full">
      <div className="w-full  flex flex-col justify-between  bg-white  rounded-lg border border-gray-300 mb-6 py-3 px-4">
        <div>
          <div className="flex justify-between">
            <h4
              className={`${
                dataNote?.noteTag == "Dặn dò"
                  ? "bg-lime-500"
                  : dataNote?.noteTag == "Ôn thi"
                  ? "bg-purple-500"
                  : dataNote?.noteTag == "Chung"
                  ? "bg-yellow-500"
                  : dataNote?.noteTag == "Nghỉ bù"
                  ? "bg-red-500"
                  : dataNote?.noteTag == "Tiến độ"
                  ? "bg-cyan-600"
                  : dataNote?.noteTag == "Kiểm tra"
                  ? "bg-orange-500"
                  : ""
              } text-white font-bold mb-3 px-4 py-2 rounded-md`}
            >
              {dataNote?.noteTag}
            </h4>

            <p className="font-bold text-base">
              {DetrucTime(dataNote?.noteDayCreate)}
            </p>
          </div>
          <p className="text-gray-800  text-sm font-sans">
            {dataNote?.noteDesc}
          </p>
        </div>
        <div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => setEdit(!edit)}
              className="ICON_FULL bg-gray-200 text-black"
            >
              <MdEdit />
            </button>

            <Popconfirm
              title="Xóa ghi chú?"
              description="Bạn có muốn xóa ghi chú này chứ ?"
              onConfirm={confirm}
              okText="Yes"
              cancelText="No"
            >
              <button className="ICON_FULL bg-gray-200 text-black">
                <MdDelete />
              </button>
            </Popconfirm>
          </div>
        </div>

        <Modal
          open={edit}
          onCancel={handleCloseModal}
          title="Chỉnh sửa ghi chú"
        >
          <div className="">
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                noteTag: dataNote?.noteTag,
                noteDesc: dataNote?.noteDesc,
              }}
              onFinish={onFinishEdit}
            >
              <Form.Item
                label="Thẻ Tag"
                name="noteTag"
                rules={[
                  {
                    required: true,
                    message: "Cần trường thẻ Tag!",
                  },
                ]}
              >
                <Select
                  defaultValue="Chung"
                  options={[
                    {
                      value: "Chung",
                      label: "Chung",
                    },
                    {
                      value: "Ôn thi",
                      label: "Ôn thi",
                    },
                    {
                      value: "Dặn dò",
                      label: "Dặn dò",
                    },
                    {
                      value: "Kiểm tra",
                      label: "Kiểm tra",
                    },
                    {
                      value: "Nghỉ bù",
                      label: "Nghỉ bù",
                    },
                    {
                      value: "Tiến độ",
                      label: "Tiến độ",
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Nội dung"
                name="noteDesc"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập nội dung!",
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item>
                <button
                  className="ICON bg-cyan-600 text-white"
                  type="primary"
                  htmlType="submit"
                >
                  Lưu chỉnh sửa
                </button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default NoteClassroom;
