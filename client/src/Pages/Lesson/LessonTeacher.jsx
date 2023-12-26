import { CaretRightOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Checkbox,
  Collapse,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  message,
  theme,
} from "antd";
import DefaultLayout from "../../Layout/DefaultLayout";
import Title from "../../components/Home/Title";
import PageHeading from "../../components/global/PageHeading";
import pdf from "../../assets/pdf_big.png";
import doc from "../../assets/doc_big.png";
import xlsx from "../../assets/xlsx_big.png";
import ppt from "../../assets/ppt_big.png";
import image from "../../assets/image.png";



import { FaPlus, FaShareAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import request from "../../utils/request";
import {
  getDownloadURL,
  ref,
  uploadString,
  deleteObject,
  getStorage,
} from "firebase/storage";
import { storage } from "../../../firebase-config";
import groupData from "../../utils/Common";
const LessonTeacher = () => {
  const [state, setState] = useState({ delete: false, open: false });
  const [data, setData] = useState([]);
  const currentUser = useSelector((state) => state.user);
  const [grouped, setGrouped] = useState([]);

  useEffect(() => {
    const fetchAPI = async () => {
      const dataSubmit = { teacherID: currentUser[0].teacherID };
      try {
        const res = await request.post("document/get/store", dataSubmit);
        console.log(res);
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);

  console.log(data, "data document");

  const handleModal = (type) => {
    if (type == "delete") {
      setState({ ...state, delete: !state.delete });
    } else if (type == "open") {
      setState({ ...state, open: !state.open });
    }
  };

  useEffect(() => {
    // Gộp dữ liệu dựa trên subjectID khi dữ liệu mới (data) thay đổi
    const groupedData =
      data.length > 0 &&
      data &&
      data?.reduce((acc, currentItem) => {
        const {
          subjectID,
          teacherID,
          subjectName,
          IDSubject,
          folderID,
          folderName,
          ...rest
        } = currentItem;

        if (!acc[subjectID]) {
          acc[subjectID] = {
            subjectID,
            teacherID,
            subjectName,
            IDSubject,
            children: [],
          };
        }
        const existingFolder = acc[subjectID].children.find(
          (child) => child.folderID === folderID
        );

        if (existingFolder) {
          // Nếu folder đã tồn tại, thêm dữ liệu vào folder đó
          existingFolder.data.push(rest);
        } else {
          // Nếu folder chưa tồn tại, tạo folder mới
          acc[subjectID].children.push({
            folderID: folderID,
            folderName: folderName,
            data: [rest],
          });
        }

        return acc;
      }, {});

    setGrouped(Object.values(groupedData)); // Chuyển đối tượng thành mảng khi cập nhật state
  }, [data]);

  const getItems = () =>
    grouped.length > 0 &&
    grouped &&
    grouped?.map((item) => ({
      key: item.subjectID.toString(),
      label: item.subjectName,
      children: <ChildrenBox data={item.children} state={state.delete} />,
    }));

  console.log(grouped, "grouped");
  const handleDataSubmit = (submittedData) => {
    setData((prevData) => [
      ...prevData,
      {
        subjectID: submittedData.subjectID,
        folderName: submittedData.folderName,
        documentLink: submittedData.documentLink,
        documentName: submittedData.documentName,
      },
    ]);
  };
  return (
    <DefaultLayout>
      <PageHeading
        title="danh sách bài giảng, tài liệu"
        desc="Danh sách bài giảng mà giảng viên lưu trữ"
      />

      <div className="my-3 flex items-center gap-3">
        <button
          onClick={() => handleModal("open")}
          className="ICON bg-green-500 text-white"
        >
          <FaPlus />
          Lưu trữ file
        </button>

        <button
          onClick={() => handleModal("delete")}
          className="ICON bg-red-500 text-white"
        >
          <MdDelete />
          Xóa File
        </button>
      </div>

      <div className="">
        <Collapse
          bordered={false}
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          items={getItems()}
        />
      </div>

      <Modal
        open={state.open}
        onCancel={() => handleModal("open")}
        title="Thêm file"
      >
        <ModalAddLesson
          teacherID={currentUser[0].teacherID}
          handleClose={handleModal}
          onSubmit={handleDataSubmit}
        />
      </Modal>
    </DefaultLayout>
  );
};

const ModalAddLesson = ({ teacherID, handleClose, onSubmit }) => {
  const [dataSubject, setDataSubject] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [dataFolder, setDataFolder] = useState([]);
  const selectFileRef = useRef(null);
  const [action, setAction] = useState({ add: false, reload: false });
  const [selectFile, setSelectFile] = useState("");
  const [fileName, setFileName] = useState("");
  const handleButtonClick = (type) => {
    handleClose(type);
  };

  const handleAction = (type) => {
    if (type == "add") {
      setAction({ ...action, add: !action.add });
    } else if (type == "reload") {
      setAction({ ...action, reload: !action.reload });
    }
  };

  useEffect(() => {
    const fetchAPI = async () => {
      const dataSubmit = { teacherID: teacherID };
      try {
        const res = await request.post("subject/get/name", dataSubmit);
        console.log(res);
        setDataSubject(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);

  useEffect(() => {
    const fetchAPI = async () => {
      const dataSubmit = { subjectID: selectedSubject };
      try {
        const res = await request.post("folder/get/name", dataSubmit);
        console.log(res);
        setDataFolder(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, [selectedSubject, action.reload]);

  console.log(selectedSubject, "data subject");
  console.log(dataFolder, "folder");
  const onFinish = async (values) => {
    console.log("Success:", values);
    if (selectFile == "") {
      message.error("Chưa chọn file");
    } else {
      const date = new Date();
      const fileRef = ref(storage, `documents/${teacherID}/${fileName}`);

      if (selectFile) {
        await uploadString(fileRef, selectFile, "data_url").then(async () => {
          const downloadURL = await getDownloadURL(fileRef);
          console.log("đường dẫn", downloadURL);
          const dataSubmit = {
            subjectID: values.subjectID,
            folderName: values.folderName,
            documentName: fileName,
            documentLink: downloadURL,
          };

          const res = await request.post(`document/add/store`, dataSubmit);
          console.log(res, "sau khi res");
          if (res.status === 200) {
            message.success("Đã thêm 1 tài liệu thành công");

            onSubmit(dataSubmit);
            handleButtonClick("open");
          } else {
            message.error("Lỗi xảy ra khi thêm tài liệu");
          }
        });
      }
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleSelectChange = (value) => {
    setSelectedSubject(value);
  };
  const addImageToPost = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (readerEvent) => {
        setSelectFile(readerEvent.target.result);
        // Lấy tên của file
        const fileName = file.name;
        setFileName(fileName);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleAddFolder = async (values) => {
    console.log(values);

    try {
      const res = await request.post("document/add/folder", values);
      console.log(res);
      if (res.data.affectedRows == 1) {
        message.success("Đã tạo thư mục thành công");
        handleAction("add");
        handleAction("reload");
      } else {
        message.error("Đã có lỗi xảy ra");
      }
    } catch (error) {
      console.log(error);
    }
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
          label="Chọn môn"
          name="subjectID"
          rules={[
            {
              required: true,
              message: "Hãy chọn tên môn!",
            },
          ]}
        >
          <Select value={selectedSubject} onChange={handleSelectChange}>
            {dataSubject.map((item) => (
              <Select.Option value={item.subjectID}>
                {item.subjectName} - {item.IDSubject}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div className="flex items-start gap-2 w-full justify-between">
          <Form.Item
            rules={[
              {
                required: true,
                message: "Hãy chọn tên thư mục!",
              },
            ]}
            style={{ width: "50%" }}
            label="Tên thư mục"
            name="folderName"
          >
            <Select>
              {dataFolder?.map((item) => (
                <Select.Option defaultActiveKey value={item?.folderID || null}>
                  {item?.folderName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <button
            type="button"
            onClick={() => handleAction("add")}
            className="ICON h-fit bg-blue-600 text-white"
          >
            Tạo thư mục mới
          </button>
        </div>

        <div className="pl-10">
          <div className="">
            <label
              class="block mb-2 text-sm font-medium text-gray-900 "
              for="file_input"
            >
              Upload file
            </label>
            <input
              class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 "
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              ref={selectFileRef}
              onChange={addImageToPost}
            />
            <p
              class="mt-1 text-sm text-gray-500 dark:text-gray-300"
              id="file_input_help"
            >
              PNG
            </p>
          </div>
        </div>

        <Form.Item>
          <button className="ICON  bg-purple-600 text-white" htmlType="submit">
            Gửi tài liệu
          </button>
        </Form.Item>
      </Form>

      <Modal
        open={action.add}
        onCancel={() => handleAction("add")}
        title="Thêm thư mục mới"
      >
        <Form name="basic" onFinish={handleAddFolder} autoComplete="off">
          <Form.Item
            label="Chọn môn"
            name="subjectID"
            rules={[
              {
                required: true,
                message: "Hãy chọn tên môn!",
              },
            ]}
          >
            <Select value={selectedSubject} onChange={handleSelectChange}>
              {dataSubject.map((item) => (
                <Select.Option value={item.subjectID}>
                  {item.subjectName} - {item.IDSubject}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: "Hãy nhập tên thư mục!",
              },
            ]}
            label="Tên thư mục"
            name="folderName"
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <button className="ICON  bg-blue-600 text-white" htmlType="submit">
              Tạo thư mục
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const ChildrenBox = ({ data, state }) => {
  const currentUser = useSelector((state) => state.user);

  const [active, setActive] = useState({ share: false, documentID: [] });
  const handleModal = (type, id) => {
    if (type == "share") {
      setActive({ ...active, share: !active.share, documentID: id });
    }
  };

  const confirmDeleteFolder = async (e, id, name) => {
    console.log(id, "MÃ folder");
    try {
      const data = { folderID: id };
      const res = await request.delete("document/folder", data);
      if (res.status == 200) {
        message.success("Đã xóa thư mục thành công");
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra");
    }
  };

  const confirmDeleteFile = async (e, id, name) => {
    console.log(id, "MÃ Document", name, "name");
    message.success("Click on Yes");
    try {
      const teacherID = currentUser[0].teacherID;
      console.log(teacherID, "mã id");
      const storage = getStorage();
      const desertRef = ref(storage, `documents/${teacherID}/${name}`);

      deleteObject(desertRef)
        .then(() => {
          // File deleted successfully
          console.log("success");
        })
        .catch((error) => {
          console.log(error);
        });

      try {
        const data = { documentID: id };
        const res = await request.delete("document/document", data);
        console.log(res, "mysql");
        if (res.status == 200) {
          message.success("Đã xóa file thành công");
        }
      } catch (error) {
        message.error("Đã có lỗi xảy ra", error);
      }
    } catch (error) {
      console.log("Lỗi xóa file:", error);
    }
  };
  console.log(data, "data children");
  return (
    <div className="w-full bg-white  items-center gap-3 flex-wrap">
      {data.length > 0 &&
        data &&
        data?.map((item) => (
          <div className="flex flex-col">
            <div className="flex gap-3 items-center p-2">
              <div className="bg-gray-200 text-gray-800 rounded-md font-bold px-4 py-2 my-4 w-fit">
                <h1>{item?.folderName}</h1>
              </div>
              {state && (
                <Popconfirm
                  title="Xóa thư mục"
                  description="Bạn có chắc muốn xóa thư mục này ?"
                  onConfirm={(e) => confirmDeleteFolder(e, item.folderID)}
                  okText="Xóa"
                  cancelText="Không"
                >
                  <button className="ICON bg-red-100 text-red-500 h-fit">
                    <MdDelete />
                    Xóa thư mục
                  </button>
                </Popconfirm>
              )}
            </div>
            <div className="flex gap-3 items-center">
              {item.data?.map((file) => (
                <div
                  key={file.documentID}
                  className="w-1/5 shadow-lg shadow-gray-300 border-gray-300 border-[1px]  p-3 rounded-sm relative"
                >
                  <div className="mb-2 ">
                    <h1 className="truncate w-full font-serif font-semibold">
                      {file.documentName}
                    </h1>
                  </div>
                  <a href={file.documentLink} className="">
                    <img
                      src={
                        file.documentName.includes("pdf")
                          ? pdf
                          : file.documentName.includes("docx")
                          ? doc
                          : file.documentName.includes("ppt")
                          ? ppt
                          : file.documentName.includes("jpg")
                          ? image
                          : ''
                      }
                      alt=""
                    />
                  </a>
                  <div className="">
                    {state && (
                      <Popconfirm
                        title="Xóa file"
                        description="Bạn có chắc muốn xóa file này ?"
                        onConfirm={(e) =>
                          confirmDeleteFile(
                            e,
                            file.documentID,
                            file.documentName
                          )
                        }
                        okText="Xóa"
                        cancelText="Không"
                      >
                        <button className="ICON_FULL bg-red-500 text-white absolute top-8 right-3">
                          <MdDelete />
                        </button>
                      </Popconfirm>
                    )}

                    {/* <button
                      onClick={() => handleModal("share", file)}
                      className="ICON_FULL bg-cyan-500 text-white absolute bottom-3 right-3"
                    >
                      <FaShareAlt />
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      <Modal
        width={900}
        open={active.share}
        onCancel={() => handleModal("share")}
        title="Chia sẻ dữ liệu"
      >
        <div className="">
          <ModalShare
            handleClose={handleModal}
            documentID={active.documentID}
          />
        </div>
      </Modal>
    </div>
  );
};

const ModalShare = ({ documentID, handleClose }) => {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const currentUser = useSelector((state) => state.user);
  const [check, setCheck] = useState({ submit: false });
  const onChange = (event) => {
    const { checked, value } = event.target;

    // Nếu checkbox được tích, thêm giá trị vào mảng, ngược lại loại bỏ giá trị khỏi mảng
    setCheckedItems((prevCheckedItems) => {
      if (checked) {
        return [...prevCheckedItems, value];
      } else {
        return prevCheckedItems.filter((item) => item !== value);
      }
    });
  };

  const handleActive = (type) => {
    if (type == "submit") {
      setCheck({ ...check, submit: !check.submit });
    }
  };

  useEffect(() => {
    const submitForm = async () => {
      try {
        const dataSubmit = {
          documentID: documentID.documentID,
          subjectGroupID: checkedItems,
        };
        const res = await request.post("/document/share", dataSubmit);
        console.log(res, "res submit");
        if (res.status == 200) {
          message.success("Đã gửi tài liệu cho lớp thành công");
          handleClose("share");
        } else {
          message.error("Đã có lỗi xảy ra");
        }
      } catch (error) {
        console.log(error);
      }
    };
    submitForm();
  }, [check.submit]);
  useEffect(() => {
    const fetchAllDataClass = async () => {
      const dataSubmit = {
        userID: currentUser[0].teacherID,
        role: currentUser[0].role,
      };
      try {
        const res = await request.post("subjectgroup/getall", dataSubmit);
        console.log(res, "res");
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllDataClass();
  }, []);
  console.log("check", checkedItems);

  useEffect(() => {
    // Group data by maMonHoc and tenNhom when the component mounts
    const groupedData = groupData(data);
    setGroupedData(groupedData);
  }, [data]);
  console.log("grouped,", groupedData);
  console.log(documentID, "document");
  return (
    <div className="">
      <div className="w-full flex">
        <div className="w-1/2">
          <h1 className="uppercase font-bold text-purple-600">
            Chia sẽ file cho các lớp học
          </h1>
          <div className="bg-gray-100 p-2 rounded-sm mr-2">
            <h1 className="font-semibold">{documentID.documentName}</h1>
            <img src={pdf} alt="" />
          </div>
        </div>
        <div className="w-1/2">
          <h1 className="uppercase font-bold text-purple-600">Chọn lớp</h1>
          {groupedData?.map((item) => (
            <div className="">
              <h1 className="bg-gray-100 font-semibold text-base p-1">
                {item.subjectName} - {item.IDSubject}
              </h1>
              <div className="flex flex-col">
                {item.children.map((index) => (
                  <div className="ml-4 mt-1">
                    <Checkbox
                      checked={checkedItems.includes(index.subjectGroupID)}
                      value={index.subjectGroupID}
                      key={index.subjectGroupID}
                      onChange={onChange}
                    >
                      Nhóm: {index.subjectGroupNameGroup} - Thứ:{" "}
                      {index.subjectGroupDay} - Tiết {index.subjectGroupStart}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => handleActive("submit")}
        className="ICON text-white bg-blue-600"
      >
        Gửi file nào
      </button>
    </div>
  );
};

export default LessonTeacher;
