import React, { useEffect, useState } from "react";
import DefaultLayout from "../../Layout/DefaultLayout";
import Title from "../../components/Home/Title";
import PointChart from "../../components/Chart/PointChart";

import certificate from "../../assets/certificate.png";
import star from "../../assets/star.png";
import PageHeading from "../../components/global/PageHeading";
import overdue from "../../assets/overdue.png";
import { Progress, Select, Tooltip } from "antd";
import request from "../../utils/request";
import { useSelector } from "react-redux";
import AnalystWeek from "../../components/Classroom/AnalystWeek";

const StatisticalTeacher = () => {
  const currentUser = useSelector((state) => state.user);

  const [dataSubjectName, setDataSubjectName] = useState([]);
  const [selectSubject, setSelectSubject] = useState(null);
  const [dataProgress, setDataProgress] = useState([]);
  const [object, setObject] = useState({ name: "" });
  useEffect(() => {
    const fetchAPI = async () => {
      const dataSubmit = {
        teacherID: currentUser[0].teacherID,
      };
      try {
        const res = await request.post("subject/get/name", dataSubmit);
        console.log(res);

        const data = res.data;
        const result = data.map((item) => ({
          label: `${item.subjectName} - ${item.IDSubject}`,
          value: item.subjectID.toString(),
        }));
        setDataSubjectName(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);

  useEffect(() => {
    if (selectSubject !== null) {
      const fetchAPI = async () => {
        const dataSubmit = {
          subjectID: selectSubject,
        };
        console.log(dataSubmit, "data submit");
        try {
          const res = await request.post("analyst/progress", dataSubmit);
          console.log(res);
          setDataProgress(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchAPI();
    }
  }, [selectSubject]);

  const handleSelectChange = (selectedOption) => {
    setSelectSubject(selectedOption);
    const valueName = dataSubjectName?.filter(
      (item) => item.value == selectedOption
    );
    setObject({ ...object, name: valueName[0].label });
  };

  console.log(selectSubject, "selectSubject");
  console.log(dataSubjectName, "progress");
  return (
    <DefaultLayout>
      <PageHeading
        title="Thống kê"
        desc="Nơi thống kê tiến độ của mỗi môn học"
      />
      <div className="">
        <h3 className="text-base font-semibold">Chọn môn </h3>
        <Select
          style={{
            width: 300,
          }}
          options={
            dataSubjectName && dataSubjectName.length > 0 && dataSubjectName
          }
          onChange={handleSelectChange} // Gọi hàm xử lý khi giá trị thay đổi
          value={selectSubject} // Thiết lập giá trị của Select từ state
        />
      </div>
      <div className="flex items-start gap-2">
        <div className="w-full">
          <Title title={`Tiến độ môn ${object.name}`} />
          <PointChart data={dataProgress} x="name" y="progress" />
        </div>
      </div>

      <div className="">
        <div className="w-full">
          <AnalystWeek />
        </div>
      </div>
    </DefaultLayout>
  );
};

const Overdue = ({ min, max }) => {
  console.log("min", min);
  return (
    <div className="flex gap-3 flex-col">
      <Title title="phân tích tiến độ" />
      <div className="flex items-center gap-3">
        <img src={overdue} alt="" />
        <h1 className="text-red-500 bg-red-50 font-semibold text-base px-4 py-2 rounded-sm">
          Có lớp đã bị trễ tiến độ so với kế hoạch{" "}
        </h1>
      </div>
      <div className="flex w-full">
        {/* MIN */}
        <div className="p-3  flex flex-col w-1/2 ">
          <div className="">
            <div className="bg-white h-40 w-full mb-4 shadow-md shadow-gray-300 border-[1px] border-gray-300 p-2 rounded-md flex flex-col justify-between">
              <div
                style={{ backgroundColor: "red" }}
                className="flex items-center gap-3 text-white rounded-sm p-2 font-semibold"
              >
                <h1>Thứ: {min?.thu}</h1>
                <h1>Tiết: {min?.tietBatDau}</h1>
              </div>

              <div className="flex justify-center items-center mt-3 gap-3">
                <h1 className="font-extrabold text-base uppercase">
                  Nhóm {min?.tenNhom}
                </h1>
                {min?.thucHanh == 1 && (
                  <Tooltip title="Thực hành">
                    <img src={star} alt="" />
                  </Tooltip>
                )}
              </div>

              {/* Tiến độ */}
              <div className="px-2 text-base font-semibold">
                <Progress percent={min.tienDo} size="small" />
              </div>
            </div>
          </div>
        </div>

        {/* MAX  */}
        <div className="p-3  flex flex-col w-1/2 ">
          <div className="">
            <div className="bg-white h-40 w-full mb-4 shadow-md shadow-gray-300 border-[1px] border-gray-300 p-2 rounded-md flex flex-col justify-between">
              <div
                style={{ backgroundColor: "#45f542" }}
                className="flex items-center gap-3 text-white rounded-sm p-2 font-semibold"
              >
                <h1>Thứ: {min?.thu}</h1>
                <h1>Tiết: {min?.tietBatDau}</h1>
              </div>

              <div className="flex justify-center items-center mt-3 gap-3">
                <h1 className="font-extrabold text-base uppercase">
                  Nhóm {min?.tenNhom}
                </h1>
                {min?.thucHanh == 1 && (
                  <Tooltip title="Thực hành">
                    <img src={star} alt="" />
                  </Tooltip>
                )}
              </div>

              {/* Tiến độ */}
              <div className="px-2 text-base font-semibold">
                <Progress percent={min.tienDo} size="small" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NGUYÊN NHÂN */}
      <div className="bg-red-50 text-red-600">
        <h1>Nguyên nhân: </h1>
      </div>
    </div>
  );
};

const OnTime = (min, max) => {
  return (
    <div className="flex items-center gap-3">
      <img
        className="w-20 h-20 object-cover"
        src={certificate}
        alt="certificate"
      />
      <h1 className="text-base font-bold text-gray-800">
        Tiến độ của môn diễn ra đúng với kế hoạch
      </h1>
    </div>
  );
};
export default StatisticalTeacher;
