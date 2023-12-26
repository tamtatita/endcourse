import { Form, Input, Tag, message } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { BsArrowRightSquareFill, BsFillSendFill } from "react-icons/bs";
import request from "../../utils/request";
import { useAuth } from "../../contexts/AuthContext";
import { useSelector } from "react-redux";

const JoinNewClass = ({ handleClose, reload }) => {
  const currentUser = useSelector((state) => state.user);
  const memberID = currentUser[0].memberID;

  const onFinish = async (values) => {
    const dataGroup = { subjectgroupID: values.codeClass };
    console.log("Success:", values);

    try {
      const res = await request.post("/subjectgroup/search", dataGroup);
      console.log(res);
      if (res.status == 201) {
        message.success("Đã tìm thấy lớp");
        setData(res.data);
      } else if (res.status === 300) {
        message.error("Không có lớp tồn tại");
      }
    } catch (error) {
      message.error("Không có lớp tồn tại");
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const [data, setData] = useState([]);
  const [submit, setSubmit] = useState(false);
  const [classCode, setClassCode] = useState("");

  const handleJoinClass = async () => {
    if (submit == true) {
      const dataSubmit = { memberID: memberID };
      try {
        const res = await request.post(
          `subjectgroup/join/${classCode}`,
          dataSubmit
        );
        console.log(res?.status);
        if (res.status == 201) {
          message.success("Bạn đã vào lớp học thành công");
          handleClose("join");
          reload(true);
        } else if (res?.status == 208) {
          message.error("Bạn đã tham gia lớp học");
        }
      } catch (error) {
        console.log(error);
      }
      console.log("đã chạy hàm");
    }
  };

  useEffect(() => {
    handleJoinClass();
  }, [submit]);

  console.log("sumit", submit);

  return (
    <div>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
        }}
        className="w-full"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <h1>Hãy nhập mã lớp học vào</h1>
        <Form.Item
          className="w-full"
          name="codeClass"
          rules={[
            {
              required: true,
              message: "Hãy nhập mã lớp học!",
            },
          ]}
        >
          <Input
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            className="w-full"
            style={{ width: "100%", flex: 1 }}
          />
        </Form.Item>

        <Form.Item>
          <button
            className="ICON bg-blue-600 text-white w-full items-center flex justify-center"
            htmlType="submit"
          >
            <BsFillSendFill />
            Gửi
          </button>
        </Form.Item>
      </Form>

      <div className="flex items-center gap-4 w-full">
        {data &&
          data.length > 0 &&
          data?.map((item) => (
            <div className="text-white box-primary w-2/3">
              <div className="font-semibold p-2 rounded-sm">
                <div className="flex justify-center my-1">
                  <h1 className="uppercase text-base">{item.subjectName}</h1>
                </div>
                <div className="bg-white text-black rounded-sm px-2 py-1 ">
                  <h1>Mã lớp: {item.subjectGroupID}</h1>
                  <h1> Giáo viên: {item.teacherName}</h1>
                </div>
                <div className="flex items-center justify-between py-1">
                  <Tag color="green-inverse">Thứ: {item.subjectGroupDay}</Tag>
                  <Tag color="red-inverse">Tiết: {item.subjectGroupCount}</Tag>
                </div>
              </div>
            </div>
          ))}

        {data.length > 0 && (
          <button
            disabled={data.length == 0}
            onClick={() => setSubmit(!submit)}
            className="ICON bg-yellow-100 text-orange-500 h-fit "
          >
            <BsArrowRightSquareFill />
            Vào lớp
          </button>
        )}
      </div>
    </div>
  );
};

export default JoinNewClass;
