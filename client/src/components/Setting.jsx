import {
  Divider,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Switch,
  message,
} from "antd";
import React from "react";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import {
  optionThu,
  optionHocKi,
  optionNamHoc,
  optionSoTiet,
  optionTietBatDau,
} from "../constants/index";
import request from "../utils/request";
import { FaRegStopCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";

const Setting = ({ data }) => {
  const { classCode } = useParams();
  // const [form] = useFo
  console.log(data, "data");

  const options = [];
  for (let i = 1; i < 21; i++) {
    options.push({
      label: `Tuần ${i}`,
      value: i,
    });
  }

  const weeks = data[0]?.subjectGroupWeeks
    .split(",")
    .map((week) => parseInt(week, 10));

  const filteredOptions = options.filter((option) =>
    weeks?.includes(option.value)
  );

  console.log(filteredOptions, "filteredOptions");

  const onFinish = async (values) => {
    const dataSubmit = {
      subjectGroupWeeks: values.subjectGroupWeeks,
      subjectName: values.subjectName,
      subjectGroupDay: values.subjectGroupDay,
      subjectGroupStart: values.subjectGroupStart,
      subjectGroupCount: values.subjectGroupCount,
      subjectGroupSemester: values.subjectGroupSemester,
      subjectGroupSchoolYear: values.subjectGroupSchoolYear,
      subjectGroupPractice: values.subjectGroupPractice,
      subjectGroupCredit: values.subjectGroupCredit,
      subjectGroupClass: values.subjectGroupClass,
      subjectGroupNameGroup: values.subjectGroupNameGroup,
      subjectGroupID: data[0].subjectGroupID,
    };
    console.log(dataSubmit, "data submit");
    try {
      const res = await request.patch("subjectgroup/update/info", dataSubmit);
      if (res.data.affectedRows == 1) {
        message.success("Đã cập nhật thành công thông tin lớp học");
      } else {
        message.error("Đã có lỗi xảy ra");
      }
      console.log(res, "res");
    } catch (error) {
      console.log(error);
    }
  };

  const dataSubmit = { subjectGroupID: classCode };
  const handleNgungDay = async () => {
    try {
      const res = await request.patch("subjectgroup/ngungday", dataSubmit);
      console.log(res, "res");
      if (res.data.changedRows == 1) {
        message.success("Đã ngừng dạy lớp thành công");
      } else {
        message.error("Đã có lỗi xảy ra");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await request.patch("subjectgroup/delete", dataSubmit);
      if (res.data.changedRows == 1) {
        message.success("Đã ngừng dạy lớp thành công");
      } else {
        message.error("Đã có lỗi xảy ra");
      }
      console.log(res, "res");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="w-full bg-white p-5">
        <div className="flex items-center gap-3 my-4 justify-end">
          <Popconfirm
            title="Xác nhận ngừng dạy lớp này"
            description="Bạn xác nhận ngừng dạy lớp này ?"
            onConfirm={handleNgungDay}
            okText="Có"
            cancelText="Không"
          >
            <button className="ICON bg-gray-200 text-gray-800 ">
              <FaRegStopCircle />
              Ngừng dạy
            </button>
          </Popconfirm>
          <Popconfirm
            title="Xóa lớp học"
            description="Bạn muốn xóa lớp học này chứ, dữ liệu liên quan sẽ bị xóa sạch ?"
            onConfirm={confirmDelete}
            okText="Xóa"
            cancelText="Không"
          >
            <button className="ICON bg-red-500 text-white ">
              <MdDelete />
              Xóa lớp học
            </button>
          </Popconfirm>
        </div>
        <Form
          // form={form}
          labelCol={{
            span: 10,
          }}
          wrapperCol={{
            span: 20,
          }}
          onFinish={onFinish}
          initialValues={{
            subjectName: data[0]?.subjectName,
            subjectGroupNameGroup: data[0]?.subjectGroupNameGroup,
            subjectGroupDay: data[0]?.subjectGroupDay,
            subjectGroupStart: data[0]?.subjectGroupStart,
            subjectGroupCount: data[0]?.subjectGroupCount,
            subjectGroupSemester: data[0]?.subjectGroupSemester,
            subjectGroupSchoolYear: data[0]?.subjectGroupSchoolYear,
            subjectGroupPractice: data[0]?.subjectGroupPractice,
            subjectGroupCredit: data[0]?.subjectGroupCredit,
            subjectGroupClass: data[0]?.subjectGroupClass,
            subjectGroupWeeks: data[0]?.subjectGroupWeeks,
            IDSubject: data[0]?.IDSubject,
          }}
          layout="horizontal"
        >
          <div className="w-full flex items-center">
            <Form.Item
              name="subjectName"
              className=" flex-1 justify-start items-start"
              label="Tên môn"
            >
              <Input style={{ flex: 1 }} placeholder="Tên môn học" />
            </Form.Item>

            <Form.Item
              name="IDSubject"
              className="w-1/3 justify-start items-start"
              label="Mã môn học "
            >
              <Input placeholder="Ví dụ: 862401" />
            </Form.Item>
          </div>

          <div className="flex w-full items-center">
            <Form.Item name="subjectGroupDay" className="w-1/3" label="Thứ">
              <Select defaultValue={optionThu[0]} options={optionThu} />
            </Form.Item>

            <Form.Item
              name="subjectGroupStart"
              className="w-1/3"
              label="Tiết bắt đầu"
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
            >
              <Select defaultValue={optionSoTiet[0]} options={optionSoTiet} />
            </Form.Item>
          </div>

          <div className="flex w-full items-center">
            <Form.Item
              name="subjectGroupSemester"
              className="w-1/3"
              label="Học kì"
            >
              <Select defaultValue={optionHocKi[0]} options={optionHocKi} />
            </Form.Item>

            <Form.Item
              name="subjectGroupSchoolYear"
              className="w-1/3"
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
              name="subjectGroupNameGroup"
              className="w-1/3 justify-start items-start"
              label="Tên nhóm"
            >
              <InputNumber placeholder="Ví dụ: 1" />
            </Form.Item>
          </div>
          <Form.Item
            name="subjectGroupWeeks"
            className="w-1/3"
            label="Thực hành"
            valuePropName="checked"
          >
            <Select
              mode="multiple"
              allowClear
              style={{
                width: "100%",
              }}
              placeholder="Please select"
              // onChange={handleChange}
              options={options}
              defaultValue={filteredOptions}
            />
          </Form.Item>

          <Form.Item>
            <button
              className="ICON  bg-orange-500 text-white"
              type="primary"
              htmlType="submit"
            >
              <MdEdit />
              Sửa lớp
            </button>
          </Form.Item>
        </Form>

        <Divider />
      </div>
    </div>
  );
};

export default Setting;
