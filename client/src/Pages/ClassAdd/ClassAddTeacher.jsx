import React, { useState } from "react";
import DefaultLayout from "../../Layout/DefaultLayout";
import ImgCrop from "antd-img-crop";
import { FacebookOutlined, MessageOutlined } from "@ant-design/icons";
import { DatePicker, Divider, Input, Modal, Switch, Tabs, Upload } from "antd";
import { dataAddClass, dataRequireAddClass } from "../../constants";
import { GiCancel } from "react-icons/gi";
import { AiFillCheckCircle } from "react-icons/ai";
import CreateClassAuto from "../../components/Classroom/CreateClassAuto";
import CreateClassHand from "../../components/Classroom/CreateClassHand";

import PageHeading from "../../components/global/PageHeading";
const ClassAddTeacher = () => {
  const items = [
    {
      key: "1",
      label: "Tạo lớp thủ công",
      children: <CreateClassHand />,
    },
    {
      key: "2",
      label: "Tạo lớp tự động",
      children: <CreateClassAuto />,
    },
  ];
  const onChange = (key) => {
    console.log(key);
  };

  return (
    <DefaultLayout>
      <PageHeading title='Thêm lớp học' desc='Nơi thêm lớp thủ công hoặc tự động'/>
      <div className="w-full flex gap-2 flex-col ">
        <div className="">
          <Tabs
            type="card"
            defaultActiveKey="1"
            items={items}
            onChange={onChange}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ClassAddTeacher;
