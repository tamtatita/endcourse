import React, { useEffect, useState } from "react";
import DefaultLayout from "../../Layout/DefaultLayout";
import { MdOutlineClass } from "react-icons/md";
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import { IoHandLeft } from "react-icons/io5";
import { formatISO, addWeeks } from "date-fns";
import { DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import { BiRightArrow, BiSubdirectoryRight } from "react-icons/bi";
import { IoMdRemove } from "react-icons/io";
import {
  AiFillDelete,
  AiFillEdit,
  AiFillSave,
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
import { BiSolidAddToQueue } from "react-icons/bi";
import { BsPlusCircleFill } from "react-icons/bs";
import request from "../../utils/request";
import { useAuth } from "../../contexts/AuthContext";
import GanttComponent from "../../components/Lesson/GanttComponent";
import { useSelector } from "react-redux";
import { FaAngleDoubleDown, FaSave } from "react-icons/fa";
const LessonPlanTeacher = () => {
  const currentUser = useSelector((state) => state.user);
  const [dataSubjectName, setDataSubjectName] = useState([]);
  const [dataLessonPlan, setDataLessonPlan] = useState([]);
  const [dataGrouped, setDataGrouped] = useState([]);
  const dataSubmit = { teacherID: currentUser[0].teacherID };
  const [open, setOpen] = useState({
    edit: false,
    drawer: false,
    subjectID: "",
    action: false,
    add: false,
    selectClass: false,
    lessonPlanID: "",
  });
  const [openItems, setOpenItems] = useState({});
  const [edit, setEdit] = useState({ big: null, small: null });

  const [reload, setReload] = useState(false);
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const res = await request.post("subject/get/name", dataSubmit);
        console.log(res, "res name");
        setDataSubjectName(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAPI();
  }, []);
  const handleOpenForm = (formType, itemId) => {
    setEdit((prevEdit) => ({
      ...prevEdit,
      [formType]: itemId,
    }));
  };

  // Dùng hàm này để đóng cửa sổ khi cần
  const handleCloseForm = (formType) => {
    setEdit((prevEdit) => ({
      ...prevEdit,
      [formType]: null,
    }));
  };

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const res = await request.post("lessonplan/get/all2", dataSubmit);
        console.log(res, "res lessonplan");
        setDataLessonPlan(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAPI();
  }, [reload]);

  const handleReload = () => {
    setReload(!reload);
  };

  const { TabPane } = Tabs;
  const showDrawer = (type, id) => {
    if (type == "edit") {
      setOpen({ ...open, edit: !open.edit, subjectID: id });
    } else if (type == "drawer") {
      setOpen({ ...open, drawer: !open.drawer });
    } else if (type == "action") {
      setOpen({ ...open, action: !open.action });
    } else if (type == "big") {
      setEdit({ ...edit, big: !edit.big });
    } else if (type == "small") {
      setEdit({ ...edit, small: !edit.small });
    } else if (type == "selectClass") {
      setOpen({ ...open, selectClass: !open.selectClass, lessonPlanID: id });
    }
  };

  const handleToggleItem = (itemId) => {
    // Copy state cũ
    const newOpenItems = { ...openItems };

    // Toggle trạng thái của item
    newOpenItems[itemId] = !newOpenItems[itemId];

    // Cập nhật state mới
    setOpenItems(newOpenItems);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (dataLessonPlan.length > 0) {
      const groupedData = dataLessonPlan?.reduce((acc, current) => {
        let existingItem = acc.find(
          (item) => item.lessonplanID === current.lessonplanID
        );

        if (existingItem) {
          let existingChapter = existingItem.Chapters.find(
            (ch) => ch.chapterProgressID === current.chapterProgressID
          );

          if (existingChapter) {
            existingChapter.Children.push({
              chapterProgressIndexID: current.chapterProgressIndexID,
              chapterProgressIndexName: current.chapterProgressIndexName,
              chapterProgressIndexSTT: current.chapterProgressIndexSTT,
              chapterProgressIndexWeeks: current.chapterProgressIndexWeeks,
            });
          } else {
            existingItem.Chapters.push({
              chapterProgressID: current.chapterProgressID,
              chapterProgressName: current.chapterProgressName,
              chapterProgressStatus: current.chapterProgressStatus,
              chapterProgressIndex: current.chapterProgressIndex,
              Children: [
                {
                  chapterProgressIndexID: current.chapterProgressIndexID,
                  chapterProgressIndexName: current.chapterProgressIndexName,
                  chapterProgressIndexSTT: current.chapterProgressIndexSTT,
                  chapterProgressIndexWeeks: current.chapterProgressIndexWeeks,
                },
              ],
            });
          }
        } else {
          acc.push({
            lessonplanID: current.lessonplanID,
            lessonplanName: current.lessonplanName,
            subjectID: current.subjectID,
            subjectName: current.subjectName,
            Chapters: [
              {
                chapterProgressID: current.chapterProgressID,
                chapterProgressName: current.chapterProgressName,
                chapterProgressStatus: current.chapterProgressStatus,
                chapterProgressIndex: current.chapterProgressIndex,
                Children: [
                  {
                    chapterProgressIndexID: current.chapterProgressIndexID,
                    chapterProgressIndexName: current.chapterProgressIndexName,
                    chapterProgressIndexSTT: current.chapterProgressIndexSTT,
                    chapterProgressIndexWeeks:
                      current.chapterProgressIndexWeeks,
                  },
                ],
              },
            ],
          });
        }

        return acc;
      }, []);

      setDataGrouped(groupedData);
    }
  }, [dataLessonPlan]);

  const handleModal = (type) => {
    if (type == "edit") {
      setOpen({ ...open, edit: !open.edit });
    }
  };

  const handleDeleteChapterIndex = async (id) => {
    try {
      const res = await request.delete(`lessonplan/delete/${id}`);
      console.log(res);
      if (res.data.affectedRows == 1) {
        message.success("Đã xóa chỉ mục chương thành công");
        handleReload();
      } else {
        message.error("Đã có lỗi xảy ra");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddChapterIndex = async (values, id) => {
    console.log(values);
    try {
      const data = {
        name: values.chapterProgressIndexName,
        week: values.chapterProgressIndexWeeks,
        id: id,
      };
      console.log(data, "data submit");
      const res = await request.post("lessonplan/add/chapterindex", data);
      console.log(res);
      if (res.data.affectedRows == 1) {
        message.success("Đã thêm 1 chỉ mục thành công");
        handleReload();
        handleToggleItem(id);
      } else {
        message.error("Đã có lỗi xảy ra");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOK = async () => {};

  const handleDeleteChapterProgress = async (id) => {
    try {
      const res = await request.delete(
        `lessonplan/delete/chapterprogress/${id}`
      );
      console.log(res);
      if (res.data.affectedRows == 1) {
        message.success("Đã xóa 1 chương môn học thành công");
        handleReload();
      } else {
        message.error("Đã có lỗi xảy ra");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditChapterProgress = async (values, id) => {
    try {
      const data = { name: values.name, id: id };
      console.log("data", data);
      const res = await request.patch("lessonplan/edit/chapterprogress", data);
      console.log(res);
      if (res.data.affectedRows == 1) {
        message.success("Đã đổi tên chương môn học thành công");
        handleReload();
        handleCloseForm("big");
      } else {
        message.error("Đã có lỗi xảy ra");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditChapterProgressIndex = async (values, id) => {
    try {
      const data = { name: values.name, week: values.week, id: id };
      console.log("data", data);
      const res = await request.patch("lessonplan/update/chapterindex", data);
      console.log(res);
      if (res.data.affectedRows == 1) {
        message.success("Đã đổi tên chỉ mục thành công");
        handleReload();
        handleCloseForm("small");
      } else {
        message.error("Đã có lỗi xảy ra");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(dataGrouped, "open items");

  return (
    <DefaultLayout>
      <PageHeading
        title="KHỞI TẠO giáo án"
        desc="Nơi cập nhật chương trình giảng dạy cho giảng viên"
      />
      <div className="my-4 flex justify-end  w-full gap-3 items-center">
        <button
          className="bg-green-600 px-4 py-2 rounded-sm text-base font-semibold text-white flex items-center gap-3"
          onClick={() => showDrawer("drawer")}
        >
          <AiOutlinePlus />
          Tạo giáo án mới
        </button>
      </div>
      <div className="flex flex-col">
        <Drawer
          title="Tạo giáo án"
          placement="right"
          onClose={onClose}
          open={open.drawer}
          size="large"
        >
          <div className="">
            <AddDrawer reload={handleReload} />
          </div>
        </Drawer>
        <div className="">
          <Tabs tabPosition="left" type="card">
            {dataGrouped?.map((item) => (
              <TabPane
                key={item?.lessonplanID}
                tab={`${item?.lessonplanName} `}
              >
                <>
                  <div className="w-full h-screen border-[1px] border-purple-200 rounded-lg p-3 overflow-y-scroll ">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showDrawer("edit", item?.lessonplanID)}
                        className={`ICON bg-white text-black shadow-lg shadow-gray-300 `}
                      >
                        <BsPlusCircleFill />
                        Thêm chương
                      </button>

                      <button
                        onClick={() => showDrawer("action")}
                        className={`ICON w-fit   shadow-lg shadow-gray-300 my-4 ${
                          open.action
                            ? "bg-blue-600 text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        <IoHandLeft />
                        Action
                      </button>

                      <button
                        onClick={() =>
                          showDrawer("selectClass", item?.lessonplanID)
                        }
                        className={`ICON w-fit   shadow-lg shadow-gray-300 my-4 ${
                          open.selectClass
                            ? "bg-red-600 text-white"
                            : "bg-white text-black"
                        }`}
                      >
                        <MdOutlineClass />
                        Chọn lớp
                      </button>

                      <button className='bg-red-500 text-white shadow-sm ICON float-right flex items-end justify-end'>
                        Xóa giáo án
                      </button>
                    </div>

                    {/* CHỌN TIẾN ĐỘ */}
                    <div className="mt-1 p-4  rounded-md text-gray-900 ">
                      <div className="">
                        {dataGrouped.length > 0 &&
                          dataGrouped
                            .sort(
                              (a, b) =>
                                a.chapterProgressIndex - b.chapterProgressIndex
                            )
                            .map((lesson) => {
                              if (item?.lessonplanID == lesson?.lessonplanID) {
                                return (
                                  <div
                                    key={lesson.lessonplanID}
                                    className="bg-[#F5F5F5] mb-3 p-3 rounded-md"
                                  >
                                    {lesson?.Chapters?.sort(
                                      (a, b) =>
                                        a.chapterProgressIndex -
                                        b.chapterProgressIndex
                                    ).map((chapter) => (
                                      <div
                                        key={chapter.chapterProgressID}
                                        className="pl-6 text-sm font-semibold  "
                                      >
                                        <div className="flex items-center gap-4">
                                          {edit.big ===
                                          chapter.chapterProgressID ? (
                                            <div className="">
                                              <Form
                                                initialValues={{
                                                  name: chapter.chapterProgressName,
                                                }}
                                                onFinish={(values) =>
                                                  handleEditChapterProgress(
                                                    values,
                                                    chapter.chapterProgressID
                                                  )
                                                }
                                              >
                                                <div className="flex items-center gap-3">
                                                  <Form.Item
                                                    label="Tên chương"
                                                    name="name"
                                                    rules={[
                                                      {
                                                        required: true,
                                                        message:
                                                          "Please input your name!",
                                                      },
                                                    ]}
                                                  >
                                                    <Input
                                                      style={{
                                                        flex: 1,
                                                        width: "100%",
                                                      }}
                                                      value={
                                                        chapter.chapterProgressName
                                                      }
                                                    />
                                                  </Form.Item>

                                                  <Form.Item>
                                                    <button
                                                      className="bg-cyan-600 text-white p-1 rounded-sm"
                                                      type="primary"
                                                      htmlType="submit"
                                                    >
                                                      Lưu
                                                    </button>
                                                  </Form.Item>

                                                  <Form.Item>
                                                    <button
                                                      onClick={() =>
                                                        handleCloseForm("big")
                                                      }
                                                      className="bg-red-600 text-white p-1 rounded-sm"
                                                    >
                                                      Đóng
                                                    </button>
                                                  </Form.Item>
                                                </div>
                                              </Form>
                                            </div>
                                          ) : (
                                            <h1 className="font-bold text-base">
                                              {chapter.chapterProgressName}
                                            </h1>
                                          )}
                                          {open.action && (
                                            <div className="flex gap-3">
                                              <Tooltip title="Thêm 1 chỉ mục">
                                                <button
                                                  onClick={() =>
                                                    handleToggleItem(
                                                      chapter.chapterProgressID
                                                    )
                                                  }
                                                  className="p-1 rounded-sm bg-blue-600 text-white"
                                                >
                                                  <FaAngleDoubleDown />
                                                </button>
                                              </Tooltip>

                                              <Tooltip title="Đổi tên chương">
                                                <button
                                                  onClick={() =>
                                                    handleOpenForm(
                                                      "big",
                                                      chapter.chapterProgressID
                                                    )
                                                  }
                                                  className="p-1 rounded-sm bg-yellow-200 text-orange-600"
                                                >
                                                  <AiFillEdit />
                                                </button>
                                              </Tooltip>

                                              <Popconfirm
                                                title="Xóa 1 chương môn học"
                                                description="Bạn có chắc muốn xóa 1 chương môn học không, điều này sẽ xóa luôn của chỉ mục của chương ?"
                                                onConfirm={() =>
                                                  handleDeleteChapterProgress(
                                                    chapter.chapterProgressID
                                                  )
                                                }
                                              >
                                                <Tooltip title="Xóa chương môn">
                                                  <button className="p-1 rounded-sm bg-red-100 text-red-600">
                                                    <AiFillDelete />
                                                  </button>
                                                </Tooltip>
                                              </Popconfirm>
                                            </div>
                                          )}
                                        </div>
                                        <ul>
                                          {chapter?.Children?.map(
                                            (chapterIndex) =>
                                              edit.small !==
                                              chapterIndex.chapterProgressIndexID ? (
                                                <div
                                                  key={
                                                    chapterIndex.chapterProgressIndexID
                                                  }
                                                  className="flex items-center border-b-[1px] border-gray-200 pt-3 pb-2"
                                                >
                                                  <img
                                                    src={indexImg}
                                                    alt=""
                                                    className="mr-3"
                                                  />
                                                  <li
                                                    className="w-2/3 truncate"
                                                    key={
                                                      chapterIndex.chapterProgressIndexID
                                                    }
                                                  >
                                                    {
                                                      chapterIndex.chapterProgressIndexName
                                                    }
                                                  </li>
                                                  <div className="flex items-center justify-between w-1/3">
                                                    {chapterIndex.chapterProgressIndexWeeks ? (
                                                      <Tag color="purple-inverse">
                                                        Tuần:
                                                        {" " +
                                                          chapterIndex.chapterProgressIndexWeeks}
                                                      </Tag>
                                                    ) : (
                                                      <Tag color="red-inverse">
                                                        {
                                                          chapterIndex?.chapterProgressIndexID
                                                        }
                                                      </Tag>
                                                    )}

                                                    {open.action && (
                                                      <div className="flex items-center gap-3">
                                                        <Tooltip title="Chỉnh sửa chỉ mục">
                                                          <button
                                                            onClick={() =>
                                                              handleOpenForm(
                                                                "small",
                                                                chapterIndex.chapterProgressIndexID
                                                              )
                                                            }
                                                            className="p-1 rounded-sm bg-yellow-500 text-white"
                                                          >
                                                            <AiFillEdit />
                                                          </button>
                                                        </Tooltip>

                                                        <Tooltip title="Xóa chỉ mục">
                                                          <Popconfirm
                                                            title="Xóa chỉ mục"
                                                            description="Bạn có muốn xóa chỉ mục này chứ "
                                                            onConfirm={() =>
                                                              handleDeleteChapterIndex(
                                                                chapterIndex.chapterProgressIndexID
                                                              )
                                                            }
                                                          >
                                                            <button className="p-1 rounded-sm bg-red-500 text-white">
                                                              <AiFillDelete />
                                                            </button>
                                                          </Popconfirm>
                                                        </Tooltip>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="bg-gray-200 p-2 my-2 gap-3 flex">
                                                  <Form
                                                    onFinish={(values) =>
                                                      handleEditChapterProgressIndex(
                                                        values,
                                                        chapterIndex.chapterProgressIndexID
                                                      )
                                                    }
                                                    initialValues={{
                                                      name: chapterIndex.chapterProgressIndexName,
                                                      week: chapterIndex.chapterProgressIndexWeeks,
                                                    }}
                                                    style={{ width: "100%" }}
                                                  >
                                                    <div className="flex gap-3 w-full">
                                                      <Form.Item
                                                        style={{ flex: 1 }}
                                                        label="Tên"
                                                        name="name"
                                                        rules={[
                                                          {
                                                            required: true,
                                                            message:
                                                              "Please input your name!",
                                                          },
                                                        ]}
                                                      >
                                                        <Input
                                                          value={
                                                            chapterIndex.chapterProgressIndexName
                                                          }
                                                        />
                                                      </Form.Item>

                                                      <Form.Item
                                                        label="Tuần"
                                                        name="week"
                                                        rules={[
                                                          {
                                                            required: true,
                                                            message:
                                                              "Please input your week!",
                                                          },
                                                        ]}
                                                      >
                                                        <InputNumber
                                                          value={
                                                            chapterIndex.chapterProgressIndexWeeks
                                                          }
                                                        />
                                                      </Form.Item>

                                                      <Form.Item>
                                                        <button
                                                          className="bg-cyan-600 text-white p-1 rounded-sm"
                                                          type="primary"
                                                          htmlType="submit"
                                                        >
                                                          Lưu
                                                        </button>
                                                      </Form.Item>

                                                      <Form.Item>
                                                        <button
                                                          onClick={() =>
                                                            handleCloseForm(
                                                              "small"
                                                            )
                                                          }
                                                          className="bg-red-600 text-white p-1 rounded-sm"
                                                        >
                                                          Hủy
                                                        </button>
                                                      </Form.Item>
                                                    </div>
                                                  </Form>
                                                </div>
                                              )
                                          )}
                                        </ul>

                                        {openItems[
                                          chapter.chapterProgressID
                                        ] && (
                                          <div className="bg-gray-200 shadow-lg shadow-gray-300 my-2  text-white w-full">
                                            <Form
                                              name="basic"
                                              initialValues={{
                                                remember: true,
                                              }}
                                              onFinish={(values) =>
                                                handleAddChapterIndex(
                                                  values,
                                                  chapter.chapterProgressID
                                                )
                                              }
                                            >
                                              <div className="flex items-center w-full justify-between text-white p-2 gap-3">
                                                <Form.Item
                                                  style={{
                                                    width: "100%",
                                                    flex: 1,
                                                    color: "white",
                                                  }}
                                                  label="Tên"
                                                  name="chapterProgressIndexName"
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message:
                                                        "Please input your username!",
                                                    },
                                                  ]}
                                                >
                                                  <Input
                                                    style={{
                                                      width: "100%",
                                                      flex: 1,
                                                    }}
                                                  />
                                                </Form.Item>

                                                <Form.Item
                                                  label="Tuần"
                                                  name="chapterProgressIndexWeeks"
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message:
                                                        "Please input your username!",
                                                    },
                                                  ]}
                                                >
                                                  <InputNumber />
                                                </Form.Item>

                                                <Form.Item>
                                                  <button
                                                    className="p-1 bg-cyan-600 text-white rounded-sm"
                                                    type="primary"
                                                    htmlType="submit"
                                                  >
                                                    Thêm mới
                                                  </button>
                                                </Form.Item>

                                                <Form.Item>
                                                  <button
                                                    onClick={() =>
                                                      handleToggleItem(
                                                        chapter.chapterProgressID
                                                      )
                                                    }
                                                    className="bg-red-600 text-white p-1 rounded-sm"
                                                  >
                                                    Hủy
                                                  </button>
                                                </Form.Item>
                                              </div>
                                            </Form>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                );
                              }
                            })}
                      </div>
                    </div>
                  </div>
                </>
              </TabPane>
            ))}
          </Tabs>
        </div>
        <Modal
          width={800}
          title="Thêm giáo án giảng dạy"
          open={open.edit}
          onCancel={() => handleModal("edit")}
        >
          <ModalAdd
            reload={handleReload}
            handleClose={handleModal}
            id={open.subjectID}
          />
        </Modal>

        <Modal
          open={open.selectClass}
          onCancel={() => showDrawer("selectClass")}
          onOk={() => handleOK()}
          title="Chọn các lớp sẽ dạy theo giáo án"
        >
          <ModalChooseClass
            lessonplanID={open.lessonPlanID}
            id={open.lessonPlanID}
          />
        </Modal>
      </div>
    </DefaultLayout>
  );
};

const ModalChooseClass = ({ id, lessonplanID }) => {
  const [options, setOptions] = useState([]);
  const [format, setFormat] = useState([]);
  const currentUser = useSelector((state) => state.user);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const data = { teacherID: currentUser[0].teacherID };
        const dataCheck = { lessonplanID: id };
        const res = await request.post("subjectgroup/all/listgroup", data);
        const resCheck = await request.post(
          "lessonplan/check/exist",
          dataCheck
        );
        console.log(res, "res ffetch");
        console.log(resCheck, "res check");

        const transformedData = res?.data?.map((item) => ({
          value: item.subjectGroupID,
          label: `${item.subjectName}, Thứ ${item.subjectGroupDay}, Tiết ${item.subjectGroupCount} Nhóm: ${item.subjectGroupNameGroup}`,
        }));

        const updatedData = transformedData?.map((item) => {
          const isMatching = resCheck.data.some(
            (apiItem) => apiItem.subjectGroupID === item.value
          );
          return { ...item, checked: isMatching };
        });

        setFormat(updatedData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, [reload, lessonplanID]);

  console.log(format, "format");

  const handleReloadForm = () => {
    setReload(!reload);
  };

  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
  };
  const unSubscript = async (value) => {
    console.log(value);
    try {
      const dataSubmit = { lessonplanID: id, subjectGroupID: value };
      const res = await request.patch("lessonplan/unsubscript", dataSubmit);
      console.log(res, "res ");
      if (res.data.changedRows == 1) {
        message.success("Đã hủy đăng ký giáo án cho lớp thành công");
        handleReloadForm();
      } else {
        message.error("Đã có lỗi xảy ra");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const subscript = async (value) => {
    console.log(value);
    try {
      const dataSubmit = { lessonplanID: id, subjectGroupID: value };
      const res = await request.patch("lessonplan/subscript", dataSubmit);
      console.log(res, "res ");
      if (res.data.changedRows == 1) {
        message.success("Đã đăng ký giáo án cho lớp thành công");
        handleReloadForm();
      } else {
        message.error("Đã có lỗi xảy ra");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="">
      {format.map((item) => (
        <div key={item.value} className="">
          <Popconfirm
            title={`Bạn xác định ${
              item.checked ? "hủy sử dụng giáo án" : "đăng ký giáo án "
            } này cho lớp ${item.label}?`}
            description={`${
              item.checked
                ? "Gỡ giáo án ra khỏi lớp"
                : "Cho lớp sử dụng giáo án này"
            }`}
            onConfirm={
              item.checked
                ? () => unSubscript(item.value)
                : () => subscript(item.value)
            }
            okText={item.checked ? "Hủy đăng ký" : "Đăng ký"}
            cancelText="Không"
          >
            <Checkbox checked={item.checked}>{item.label}</Checkbox>
          </Popconfirm>
        </div>
      ))}
    </div>
  );
};

const ModalAdd = ({ reload, handleClose, id }) => {
  const [form] = Form.useForm();
  const [submit, setSubmit] = useState(false);
  useEffect(() => {
    const onFinish = async () => {
      console.log("chạy hàm on finish");
      if (submit) {
        console.log("chạy trong s");
        try {
          const items = form.getFieldValue();

          const dataSubmit = {
            lessonplanID: id,
            items,
            type: "part",
          };
          console.log(dataSubmit, "data submit");
          const res = await request.post("lessonplan/insert/part", dataSubmit);
          console.log(res, "res ============");
          if (res.status == 200) {
            message.success("Đã thêm các chương thành công");
            reload();
            setSubmit(false);
            handleClose("edit");
          } else {
            message.error("Đã có lỗi xảy ra");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    onFinish();
  }, [submit]);

  const handleSubmit = () => {
    setSubmit(!submit);
  };

  return (
    <div className="h-[400px] overflow-y-scroll">
      <Form
        className="w-full"
        form={form}
        // onFinish={() => onFinishs()}
        name="dynamic_form_complex"
        autoComplete="off"
        initialValues={{
          items: [{}],
        }}
      >
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <div
              style={{
                display: "flex",
                rowGap: 16,
                flexDirection: "column",
                width: "100%",
              }}
            >
              {fields.map((field) => (
                <Card
                  size="small"
                  title={`Chương ${field.name + 1}`}
                  key={field.key}
                  style={{ marginBottom: 10 }}
                  extra={
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  }
                >
                  <div className="flex items-center w-full gap-3">
                    <Form.Item
                      style={{ flex: 1 }}
                      label="Tên chương"
                      name={[field.name, "chapterProgressName"]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Vị trí"
                      name={[field.name, "chapterProgressSTT"]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </div>

                  {/* Nest Form.List */}
                  <Form.Item label="Tên chỉ mục">
                    <Form.List name={[field.name, "list"]}>
                      {(subFields, subOpt) => (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 16,
                          }}
                        >
                          {subFields.map((subField) => (
                            <Space key={subField.key}>
                              <Form.Item
                                noStyle
                                name={[
                                  subField.name,
                                  "chapterProgressIndexName",
                                ]}
                              >
                                <Input placeholder="Tên chỉ mục" />
                              </Form.Item>
                              <Form.Item
                                noStyle
                                name={[
                                  subField.name,
                                  "chapterProgressIndexWeeks",
                                ]}
                              >
                                <InputNumber placeholder="Tuần" />
                              </Form.Item>
                              <button
                                className="ICON_FULL text-white bg-red-500"
                                onClick={() => {
                                  subOpt.remove(subField.name);
                                }}
                              >
                                <AiFillDelete />
                              </button>
                            </Space>
                          ))}
                          <button
                            className="ICON bg-gray-200 text-black w-fit"
                            onClick={() => subOpt.add()}
                          >
                            <BsPlusCircleFill />
                            Thêm chỉ mục chương
                          </button>
                        </div>
                      )}
                    </Form.List>
                  </Form.Item>
                </Card>
              ))}

              <button
                className="ICON w-fit bg-cyan-600 text-black my-4"
                onClick={() => add()}
              >
                <BsPlusCircleFill />
                Thêm chương mới
              </button>
            </div>
          )}
        </Form.List>

        <Form.Item label=" " colon={false}>
          <button
            className="ICON flex text-center justify-center w-full bg-purple-600 text-white"
            onClick={() => handleSubmit()}
            htmlType="submit"
          >
            Lưu chỉnh sửa
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

const AddDrawer = ({ reload }) => {
  const [dataSubject, setDataSubject] = useState([]);
  const [submit, setSubmit] = useState(false);
  const [form] = Form.useForm();
  const [name, setName] = useState("");
  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    const onFinish = async () => {
      console.log("chạy hàm on finish");
      if (submit) {
        console.log("chạy trong s");
        try {
          const items = form.getFieldValue();
          const dataSubmit = {
            name: name,
            items,
            type: "full",
            teacherID: currentUser[0].teacherID,
          };
          console.log(dataSubmit, "data submit");
          const res = await request.post("lessonplan/insert/part", dataSubmit);
          console.log(res, "res ============");
          if (res.status == 200) {
            message.success("Đã thêm giáo án thành công");
            reload();
            setSubmit(false);
            handleClose("edit");
          } else {
            message.error("Đã có lỗi xảy ra");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    onFinish();
  }, [submit]);

  const handleActiveSubmit = () => {
    setSubmit(!submit);
  };

  return (
    <div className="w-full bg-gray-100 p-3">
      <div className=" flex flex-col my-4 ">
        <h2 className="font-semibold text-sm whitespace-nowrap">Tên giáo án</h2>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <Form
        className="w-full"
        form={form}
        // onFinish={onFinish}
        name="dynamic_form_complex"
        autoComplete="off"
        initialValues={{
          items: [{}],
        }}
      >
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <div
              style={{
                display: "flex",
                rowGap: 16,
                flexDirection: "column",
                width: "100%",
              }}
            >
              {fields.map((field) => (
                <Card
                  size="small"
                  title={`Phần ${field.name + 1}`}
                  key={field.key}
                  style={{ marginBottom: 10 }}
                  extra={
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  }
                >
                  <Form.Item
                    label="Tên chương"
                    name={[field.name, "chapterProgressName"]}
                  >
                    <Input />
                  </Form.Item>

                  {/* Nest Form.List */}
                  <Form.Item label="Tên chỉ mục">
                    <Form.List name={[field.name, "list"]}>
                      {(subFields, subOpt) => (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 16,
                          }}
                        >
                          {subFields.map((subField) => (
                            <Space key={subField.key}>
                              <Form.Item
                                noStyle
                                name={[
                                  subField.name,
                                  "chapterProgressIndexName",
                                ]}
                              >
                                <Input placeholder="Tên chỉ mục" />
                              </Form.Item>
                              <Form.Item
                                noStyle
                                name={[
                                  subField.name,
                                  "chapterProgressIndexWeeks",
                                ]}
                              >
                                <InputNumber placeholder="Tuần" />
                              </Form.Item>
                              <button
                                className="ICON_FULL text-white bg-red-500"
                                onClick={() => {
                                  subOpt.remove(subField.name);
                                }}
                              >
                                <AiFillDelete />
                              </button>
                            </Space>
                          ))}
                          <button
                            className="ICON bg-gray-200 text-gray-800 w-fit"
                            onClick={() => subOpt.add()}
                          >
                            <BsPlusCircleFill />
                            Thêm chỉ mục chương
                          </button>
                        </div>
                      )}
                    </Form.List>
                  </Form.Item>
                </Card>
              ))}

              <button
                className="ICON w-fit bg-cyan-500 text-white"
                onClick={() => add()}
              >
                <BsPlusCircleFill />
                Thêm chương mới
              </button>
            </div>
          )}
        </Form.List>

        <Form.Item label=" " colon={false}>
          <button
            className="ICON w-full bg-blue-600 text-white shadow-sm shadow-gray-300 my-3 flex justify-center"
            onClick={() => handleActiveSubmit()}
            htmlType="submit"
          >
            <FaSave />
            Lưu giáo án
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default LessonPlanTeacher;
