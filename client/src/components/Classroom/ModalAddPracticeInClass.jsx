import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Tag,
  Upload,
  message,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import groupData from "../../utils/Common";
import request from "../../utils/request";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../firebase-config";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useAuth } from "../../contexts/AuthContext";
import { useSelector } from "react-redux";

const ModalAddPracticeInClass = () => {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const selectFileRef = useRef(null);
  const [selectFile, setSelectFile] = useState("");

  const currentUser = useSelector((state) => state.user);

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectFile(readerEvent.target.result);
    };
  };
  const compareTime = (time) => {
    // Lấy thời gian hiện tại
    const currentTime = new Date();

    // Chuyển đổi kiểu thời gian cụ thể sang đối tượng Date
    const specificTime = new Date(time);

    // So sánh thời gian hiện tại với thời gian cụ thể
    if (currentTime < specificTime) {
      return "future";
    } else {
      return "inprogress";
    }
  };
  useEffect(() => {
    const fetchAllDataClass = async () => {
      const dataSubmit = {
        userID: currentUser[0].teacherID,
        role: currentUser[0].role,
        status: 1,
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

  useEffect(() => {
    // Group data by maMonHoc and tenNhom when the component mounts
    const groupedData = groupData(data);
    setGroupedData(groupedData);
  }, [data]);

  const handleCheckboxChange = (classId) => {
    console.log(classId, "classID");
    // Kiểm tra xem lớp đã được chọn hay chưa
    if (selectedClasses.includes(classId)) {
      // Nếu đã được chọn, loại bỏ nó khỏi mảng selectedClasses
      setSelectedClasses(selectedClasses.filter((id) => id !== classId));
    } else {
      // Nếu chưa được chọn, thêm nó vào mảng selectedClasses
      setSelectedClasses([...selectedClasses, classId]);
    }
  };

  const { RangePicker } = DatePicker;
  const onFinish = async (values) => {
    const date = new Date();
    console.log("Success:", values);
    if (selectFile == "" && currentUser !== null) {
      message.error("Chưa chọn file");
    } else {
      const fileRef = ref(
        storage,
        `practices/${currentUser[0].teacherID}/${date}`
      );

      if (selectFile) {
        await uploadString(fileRef, selectFile, "data_url").then(async () => {
          const downloadURL = await getDownloadURL(fileRef);
          console.log("đường dẫn", downloadURL);
          const dataSubmit = {
            title: values.namePractice,
            dayOpen: values.day[0],
            dayClose: values.day[1],
            status: "inprogress",
            subjectGroupID: selectedClasses,
            file: downloadURL,
            teacherID: currentUser[0].teacherID,
          };

          const res = await request.post(`practice/add`, dataSubmit);
          console.log(res, "sau khi res");
          if (res.status === 201) {
            message.success("Đã tạo bài tập cho các lớp thành công");
          } else {
            message.error("Lỗi xảy ra khi tạo bài tập");
          }
        });
      }
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="">
      <Form
        className="w-full flex gap-3"
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div className="w-1/2 ">
          <div className="">
            <h4 className="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 my-3">
              Nhập tiêu đề bài tập
            </h4>
            <Form.Item
              name="namePractice"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập tên tiêu đề bài tập!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="">
            <h4 className="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 my-3">
              Chọn file ảnh cần gửi
            </h4>
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
                SVG, PNG, JPG or GIF (MAX. 800x400px).
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <div className="">
            <h4 className="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 my-3">
              Chọn ngày bắt đầu và ngày kết thúc nộp bài tập
            </h4>
            <Form.Item
              name="day"
              rules={[
                {
                  required: true,
                  message: "Hãy điền ngày!",
                },
              ]}
            >
              <RangePicker showTime />
            </Form.Item>
          </div>

          <div className="">
            <h4 className="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 my-3">
              Chọn các lớp được nhận bài tập
            </h4>
          </div>

          <div className="h-[300px] overflow-y-scroll">
            {groupedData.map((classroom) => (
              <div key={classroom.subjectID} className="">
                <Tag className="font-bold text-base" color="#33334F">
                  {classroom.subjectName}
                </Tag>
                <div className="flex flex-col mx-5 my-3">
                  <Form.Item name="checkbox">
                    {classroom.children.map((item) => (
                      <Checkbox
                        key={item.subjectGroupID}
                        className="font-semibold test-base"
                        onChange={() =>
                          handleCheckboxChange(item.subjectGroupID)
                        }
                        checked={selectedClasses.includes(item.subjectGroupID)}
                      >
                        Thứ: {item.subjectGroupDay} - Tiết:{" "}
                        {item.subjectGroupStart} - Nhóm:{" "}
                        {item.subjectGroupNameGroup}
                      </Checkbox>
                    ))}
                  </Form.Item>
                </div>
              </div>
            ))}
          </div>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default ModalAddPracticeInClass;
