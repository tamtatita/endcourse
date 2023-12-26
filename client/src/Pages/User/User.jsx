import React, { useEffect, useState } from "react";
import DefaultLayout from "../../Layout/DefaultLayout";
import PageHeading from "../../components/global/PageHeading";

import { useSelector } from "react-redux";
import request from "../../utils/request";
import { TimeMysql } from "../../utils/Common";
import { MdEdit, MdOutlineBlock } from "react-icons/md";
import { DatePicker, Form, Input, Modal, Switch, message } from "antd";
const User = () => {
  const [values, setValues] = useState([]);
  const currentUser = useSelector((state) => state.user);
  const role = currentUser[0]?.role;
  const [active, setActive] = useState({ edit: false, data: [] });

  const handleActive = (type, data) => {
    if (type == "edit") {
      setActive({ ...active, edit: !active.edit, data: data });
    }
  };

  useEffect(() => {
    const fetchAPI = async () => {
      const dataSubmit = {
        role: currentUser[0].role,
        userID: currentUser[0]?.teacherID || currentUser[0]?.memberID,
      };
      try {
        const res = await request.post("action/get/user", dataSubmit);
        console.log(res);
        setValues(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);

  return (
    <DefaultLayout>
      <PageHeading
        title={
          role == "teacher" ? "THÔNG TIN GIẢNG VIÊN" : "THÔNG TIN SINH VIÊN"
        }
        desc={`Nơi chỉnh sửa thông tin cá nhân của ${
          role == "teacher" ? "giảng viên" : "sinh viên"
        } `}
      />

      <div className="flex flex-col w-1/2 bg-gray-50">
        {values &&
          values.length > 0 &&
          values.map((item) => (
            <>
              <div className="flex p-2 ">
                <h1 className="w-1/2 font-semibold ">Tên đăng nhập</h1>
                <span>{item.teacherEmail || item.memberEmail}</span>
              </div>

              <div className="flex p-2">
                <h1 className="w-1/2 font-semibold ">Họ và tên</h1>
                <span>{item.teacherName || item.memberName || "Không có"}</span>
              </div>

              <div className="flex p-2">
                <h1 className="w-1/2 font-semibold ">
                  {item.teacherID ? "Mã giảng viên" : "Mã sinh viên"}
                </h1>
                <span>{item.teacherCode || item.MSSV || "Không có"}</span>
              </div>

              <div className="flex p-2">
                <h1 className="w-1/2 font-semibold ">Ngày sinh</h1>
                <span>{TimeMysql(item.teacherBirth || item.memberBirth)}</span>
              </div>

              <div className="flex p-2">
                <h1 className="w-1/2 font-semibold ">Trường</h1>
                <span>
                  {item.teacherSchool || item.memberSchool || "Không có"}
                </span>
              </div>

              <div className="flex p-2">
                <h1 className="w-1/2 font-semibold ">Ngày tạo tài khoản</h1>
                <span>
                  {TimeMysql(item.teacherDayCreate || item.memberDayCreate)}
                </span>
              </div>
              <Modal
                open={active.edit}
                onCancel={() => handleActive("edit", item)}
                title="Chỉnh sửa thông tin cá nhân"
              >
                <ModalEdit
                  user={currentUser}
                  handleClose={handleActive}
                  data={item}
                  role={role}
                />
              </Modal>
            </>
          ))}

        <div className="flex gap-3 my-3">
          <button
            onClick={() => handleActive("edit")}
            className="ICON bg-yellow-500 text-black"
          >
            {" "}
            <MdEdit />
            Đổi thông tin
          </button>
          <button className="ICON bg-red-500 text-white">
            <MdOutlineBlock />
            Xóa tài khoản
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

const ModalEdit = ({ user, data, role, handleClose }) => {
  const onFinish = async (values) => {
    const dataSubmit = {
      ...(role === "teacher"
        ? { teacherName: values?.teacherName }
        : { memberName: values?.memberName }),
      ...(role === "teacher"
        ? { teacherCode: values?.teacherCode }
        : { MSSV: values?.MSSV }),
      ...(role === "teacher"
        ? { teacherBirth: values?.teacherBirth }
        : { memberBirth: values?.memberBirth }),

      ...(role === "teacher"
        ? { teacherTelephone: values?.teacherTelephone }
        : { memberTelephone: values?.memberTelephone }),
      ...(role === "teacher"
        ? { teacherSchool: values?.teacherSchool }
        : { memberSchool: values?.memberSchool }),
      ...(role === "teacher"
        ? { teacherSex: values?.teacherSex == true ? 1 : 0 }
        : { memberSex: values?.memberSex == true ? 1 : 0 }),
      ...(role === "teacher"
        ? { teacherID: user[0]?.teacherID }
        : { memberID: user[0]?.memberID }),
    };
    console.log("success", dataSubmit);
    const res = await request.patch("action/edit/user", dataSubmit);
    console.log(res, "res");
    if (res.status == 201) {
      message.success("Đã cập nhật thành công");
      handleClose("edit");
    } else {
      message.error("đã có lỗi xảy ra");
    }
  };
  console.log(data, "data");
  const [form] = Form.useForm();
  return (
    <div className="">
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          ...(role === "teacher"
            ? { teacherName: data?.teacherName }
            : { memberName: data?.memberName }),

          ...(role === "teacher"
            ? { teacherCode: data?.teacherCode }
            : { MSSV: data?.MSSV }),

          ...(role === "teacher"
            ? { teacherSchool: data?.teacherSchool }
            : { memberSchool: data?.memberSchool }),
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          rules={[
            {
              required: true,
              message: "Hãy nhập tên!",
            },
          ]}
          label="Họ và tên"
          name={`${role == "teacher" ? "teacherName" : "memberName"}`}
        >
          <Input value={data?.memberName || data?.teacherName} />
        </Form.Item>

        <Form.Item
          rules={[
            {
              required: true,
              message: "Hãy nhập Code!",
            },
          ]}
          name={`${role == "teacher" ? "teacherCode" : "MSSV"}`}
          label={`${role == "teacher" ? "Mã giảng viên" : "Mã sinh viên"}`}
        >
          <Input value={data?.teacherCode || data?.MSSV} />
        </Form.Item>

        <Form.Item
          rules={[
            {
              required: true,
              message: "Hãy nhập SDT!",
            },
          ]}
          name={`${role == "teacher" ? "teacherSDT" : "memberSDT"}`}
          label="SDT"
        >
          <Input value={data?.teacherSDT || data?.memberSDT} />
        </Form.Item>

        <Form.Item
          rules={[
            {
              required: true,
              message: "Hãy chọn giới tính!",
            },
          ]}
          name={`${role == "teacher" ? "teacherSex" : "memberSex"}`}
          label="Giới tính"
        >
          <Switch checkedChildren="Nữ" unCheckedChildren="Nam" defaultChecked />
        </Form.Item>

        <Form.Item
          rules={[
            {
              required: true,
              message: "Hãy chọn ngày sinh!",
            },
          ]}
          style={{ width: "100%" }}
          className="w-full"
          name={`${role == "teacher" ? "teacherBirth" : "memberBirth"}`}
          label="Ngày sinh"
        >
          <DatePicker style={{ width: "100%" }} className="w-full" />
        </Form.Item>

        <Form.Item
          rules={[
            {
              required: true,
              message: "Hãy nhập trường!",
            },
          ]}
          name={`${role == "teacher" ? "teacherSchool" : "memberSchool"}`}
          label="Trường"
        >
          <Input value={data?.teacherSchool || data?.memberSchool} />
        </Form.Item>

        <Form.Item>
          <button
            className="ICON bg-purple-500 text-white"
            type="primary"
            htmlType="submit"
          >
            Chỉnh sửa
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default User;
