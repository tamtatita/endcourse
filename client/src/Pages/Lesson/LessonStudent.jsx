import React from "react";
import DefaultLayout from "../../Layout/DefaultLayout";
import { Button, Tabs } from "antd";

const LessonStudent = () => {
  const datamonhoc = [
    { key: 1, children: "", label: "Công nghệ phần mềm" },
    { key: 2, children: "", label: "cấu trúc dữ liệu" },
    { key: 3, children: "", label: "Cơ sở dữ liệu" },
    { key: 4, children: "", label: "hệ thống thông tin doanh nghiệp" },
  ];
  

  return (
    <DefaultLayout>
      
      <div className="">
        <div className="flex items-end justify-end">
          <Button type="primary">Thêm môn học</Button>
        </div>

        <div className="flex flex-col w-1/4">
          <h1 className="text-gray-900 font-semibold text-lg">
            Các môn học có sẵn
          </h1>
          <div className="">
            <Tabs
              items={datamonhoc}
              tabPosition="left"
              style={{
                backgroundColor: "white",
                textTransform: "capitalize",
                fontSize: "20px",
              }}
              type="card"
            ></Tabs>
          </div>
        </div>

        <div className="w-3/4"></div>
      </div>
     
    </DefaultLayout>
  );
};

export default LessonStudent;
