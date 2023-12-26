import React, { useState } from "react";
import {
  optionSoTiet,
  optionThu,
  optionTietBatDau,
  optionHocKi,
  optionNamHoc,
} from "../../constants";
import ImgCrop from "antd-img-crop";
import { MdAdd } from "react-icons/md";
import { FacebookOutlined, MessageOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  Switch,
  Tabs,
  Tooltip,
  Upload,
  message,
} from "antd";
import { dataAddClass, dataRequireAddClass } from "../../constants";
import { GiCancel } from "react-icons/gi";
import { AiFillCheckCircle, AiFillQuestionCircle } from "react-icons/ai";
import request from "../../utils/request";
import { useSelector } from "react-redux";
const CreateClassHand = () => {
  const title = "font-semibold text-gray-900 text-lg";
  const desc = "text-md text-gray-700";
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm();

  const [state, setState] = useState([
    {
      key: "chanHocSinhRoiLop",
      title: "Chặn học sinh tự ý rời lớp",
      desc: "Tính năng này giúp giáo viên quản lý số lượng thành viên trong lớp tốt hơn tránh tình trạng học sinh tự ý thoát khỏi lớp",
      isCheck: false,
    },
    {
      key: "pheDuyet",
      title: "Phê duyệt học sinh",
      desc: "Phê duyệt học sinh tránh tình trạng người lạ vào lớp học mà không có sự cho phép của bạn",
      isCheck: false,
    },
    {
      key: "xemBangDiem",
      title: "Cho phép học sinh xem bảng điểm",
      desc: "Học sinh sẽ được xem bảng điểm của các thành viên trong lớp",
      isCheck: false,
    },
    {
      key: "tatHoatDongBangTin",
      title: "Tắt hoạt động bảng tin",
      desc: "Học sinh không thể đăng bài, bình luận",
      isCheck: false,
    },
    {
      key: "hanCheGiaoVienPhu",
      title: "Hạn chế giáo viên phụ",
      desc: "Giáo viên đồng hành chỉ được phép xem tài nguyên của mình tạo ra trong lớp, bao gồm: Bài tập, bài giảng, tài liệu",
      isCheck: false,
    },
    {
      key: "maBaoVe",
      title: "Mã bảo vệ",
      desc: "Yêu cầu học sinh nhập mã bảo vệ mới cho vào lớp học",
      isCheck: false,
    },
    { key: "TenMonHoc", require: true, title: "Tên môn học", flag: true },
    { key: "thu", require: true, title: "Thứ", flag: true },
    { key: "tietBatDau", require: true, title: "Tiết bắt đầu", flag: true },
    { key: "soTiet", require: true, title: "Số tiết", flag: true },
    { key: "nhomMonHoc", require: true, title: "Nhóm môn học", flag: true },
    { key: "tenLopHoc", require: true, title: "Tên lớp học", flag: true },
  ]);

  const currentUser = useSelector((state) => state.user);

  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      const teacherID = currentUser[0].teacherID;
      const res = await request.post(`subjectgroup/hand/${teacherID}`, values);
      console.log(res);
      if (res.status === 200) {
        message.success("Đã thêm lớp thành công");

        form.resetFields();
      } else {
        message.error("Đã có lỗi xảy ra");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const options = [];
  for (let i = 1; i < 21; i++) {
    options.push({
      label: `Tuần ${i}`,
      value: i,
    });
  }

  return (
    <div>
      <div className="w-full flex gap-2">
        <div className="w-full bg-white p-5">
          <Form
            form={form}
            labelCol={{
              span: 10,
            }}
            wrapperCol={{
              span: 20,
            }}
            onFinish={onFinish}
            layout="horizontal"
          >
            <div className="w-full flex items-center">
              <Form.Item
                name="subjectName"
                className="w-1/3 justify-start items-start"
                label="Tên môn"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập tên môn!",
                  },
                ]}
              >
                <Input placeholder="Tên môn học" />
              </Form.Item>

              <Form.Item
                name="IDSubject"
                className="w-1/3 justify-start items-start"
                label="Mã môn học "
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập mã môn học!",
                  },
                ]}
              >
                <Input placeholder="Ví dụ: 862401" />
              </Form.Item>

              <Form.Item
                name="subjectGroupNameGroup"
                className="w-1/3 justify-start items-start"
                label="Tên nhóm"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập tên nhóm!",
                  },
                ]}
              >
                <InputNumber placeholder="Ví dụ: 1" />
              </Form.Item>
            </div>

            <div className="flex w-full items-center">
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập thứ dạy!",
                  },
                ]}
                name="subjectGroupDay"
                className="w-1/3"
                label="Thứ"
              >
                <Select defaultValue={optionThu[0]} options={optionThu} />
              </Form.Item>

              <Form.Item
                name="subjectGroupStart"
                className="w-1/3"
                label="Tiết bắt đầu"
                rules={[
                  {
                    required: true,
                    message: 'Hãy nhập tiết bắt đầu!',
                  },
                ]}
              >
                <Select
                  defaultValue={optionTietBatDau[0]}
                  options={optionTietBatDau}
                />
              </Form.Item>

              <Form.Item
                name="subjectGroupCount"
                className="w-1/3"
                label="Số tiết"
                rules={[
                  {
                    required: true,
                    message: 'Hãy nhập số tiết!',
                  },
                ]}
              >
                <Select defaultValue={optionSoTiet[0]} options={optionSoTiet} />
              </Form.Item>
            </div>

            <div className="flex w-full items-center">
              <Form.Item
                name="subjectGroupSemester"
                className="w-1/3"
                label="Học kì"
                rules={[
                  {
                    required: true,
                    message: 'Hãy nhập học kỳ!',
                  },
                ]}
              >
                <Select defaultValue={optionHocKi[0]} options={optionHocKi} />
              </Form.Item>

              <Form.Item
                name="subjectGroupSchoolYear"
                className="w-1/3"
                rules={[
                  {
                    required: true,
                    message: 'Hãy nhập năm học!',
                  },
                ]}
                label="Năm học"
              >
                <Select defaultValue={optionNamHoc[0]} options={optionNamHoc} />
              </Form.Item>

              <Form.Item
                name="subjectGroupPractice"
                className="w-1/3"
                label="Thực hành"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </div>

            <div className="flex w-full items-center">
              <Form.Item
                name="subjectGroupCredit"
                className="w-1/3"
                label="Số tín chỉ"
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="subjectGroupClass"
                className="w-1/3"
                label="Mã lớp dạy"
              >
                <Input placeholder="Ví dụ: DKP1201" />
              </Form.Item>

              <Form.Item
                name="subjectGroupWeeks"
                className="w-1/3"
                label="Tuần dạy"
                valuePropName="checked"
                rules={[
                  {
                    required: true,
                    message: 'Hãy chọn các tuần dạy!',
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: "100%",
                  }}
                  placeholder="Please select"
                  // defaultValue={["a10", "c12"]}
                  // onChange={handleChange}
                  options={options}
                />
              </Form.Item>
            </div>

            <Form.Item>
              <button
                className="ICON w-full bg-blue-600 text-white"
                type="primary"
                htmlType="submit"
              >
                <MdAdd />
                Tạo lớp
              </button>
            </Form.Item>
          </Form>

          <Divider />
        </div>
      </div>
    </div>
  );
};

export default CreateClassHand;
