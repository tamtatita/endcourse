import React, { useEffect, useState } from "react";
import DefaultLayout from "../../Layout/DefaultLayout";
import { Divider, Space, Table, Tag } from "antd";
import AnalystsItem from "../../components/TimeStamp/Home/AnalystsItem";
import ScheduleTable from "../../components/Schedule/ScheduleTable";
import ClassItem from "../../components/Home/ClassItem";
import ClassDetailAnalyst from "../../components/Classroom/ClassDetailAnalyst";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import illu from "../../assets/illu.jpg";
import Title from "../../components/Home/Title";
import AcademicAchievement from "../../components/Home/AcademicAchievement";
import UnreadDocuments from "../../components/Home/UnreadDocuments";
import ClassLists from "../../components/Home/ClassList/ClassListTeacher";
import useColumnSearch from "../../hooks/useColumnSearch";
import Practice from "../../components/Home/Practice";
import request from "../../utils/request";
import { useAuth } from "../../contexts/AuthContext";
import ClassListStudent from "../../components/Home/ClassList/ClassListStudent";
import { useSelector } from "react-redux";
const HomePageStudent = () => {
  const currentUser = useSelector((state) => state.user);
  console.log(currentUser, "555");
  const [dataPractice, setDataPractice] = useState([]);
  useEffect(() => {
    const fetchAPI = async () => {
      const dataSubmit = { userID: currentUser[0].memberID };
      try {
        const res = await request.post("practice/home/practice", dataSubmit);
        console.log(res);
        setDataPractice(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);

  return (
    <DefaultLayout>
      <div className="w-full px-2">
        <div className="flex gap-4">
          {/* LEFT */}
          <div className="w-2/3">
            {/* DANH SÁCH LỚP HỌC */}
            <div className="">
              <Title title="Danh sách lớp học" />
              <ClassListStudent />
            </div>
            <Divider />
          </div>

          {/* RIGHT */}
          <div className="w-1/3">
            <Title title="Bài tập" />
            {dataPractice?.length == 0 ? (
              <div className="">
                <h4 className="font-semibold text-center text-blue-900 ">
                  Hiện không có bài tập gì hết
                </h4>
                <img src={illu} alt="" />
              </div>
            ) : (
              <div className="flex flex-col gap-3 overflow-y-scroll h-[400px] border-gray-100 border-2 p-2">
                {dataPractice.map((item) => (
                  <Practice props={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default HomePageStudent;
