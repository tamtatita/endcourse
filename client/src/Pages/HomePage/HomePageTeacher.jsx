import React, { useEffect, useState } from "react";
import DefaultLayout from "../../Layout/DefaultLayout";
import { Checkbox, Divider, Space, Table, Tag } from "antd";
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
import { useSelector } from "react-redux";
import LeaveCalendar from "../../components/Home/LeaveCalendar";
import DelayProgress from "../../components/Classroom/DelayProgress";
import NotScored from "../../components/Home/NotScored";
const HomePageTeacher = () => {
  const [getColumnSearchProps] = useColumnSearch();
  const currentUser = useSelector((state) => state.user);
  const [practices, setPractices] = useState([]);

  const [dataAnalyst, setDataAnalyst] = useState({
    tongMon: 0,
    tongNhom: 0,
    tongBuoiNghi: 0,
    tongSoSinhVien: 0,
  });

  const data = { userID: currentUser[0].teacherID || currentUser[0].memberID };

  // CÀO THÔNG TIN TỔNG QUAN
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const tongMon = await request.post("total/subject", data);
        const tongNhom = await request.post("total/subjectgroup", data);
        const tongBuoiNghi = await request.post("total/leave", data);

        setDataAnalyst({
          ...dataAnalyst,
          tongMon: tongMon.data,
          tongNhom: tongNhom.data,
          tongBuoiNghi: tongBuoiNghi.data,

        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);

  console.log(dataAnalyst, 'tổng')

  // CÀO THÔNG TIN BÀI TẬP
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        // const res = await request.post("practice/home/practice", data);
        console.log(res, "res practice");
        setPractices(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAPI();
  }, []);

  console.log(practices);
  console.log("re-render home");

  return (
    <DefaultLayout>
      <div className="w-full px-2">
        {/* OVERVIEW */}
        <Title title="tổng quan" />
        <div className="flex items-center justify-between gap-4 ">
          <ClassDetailAnalyst
            // desc="tổng các môn dạy"
            title="Tổng số môn dạy "
            data={dataAnalyst && dataAnalyst.tongMon?.result}
          />
          <ClassDetailAnalyst
            title="Tổng số lớp dạy"
            // desc="Tổng các nhóm lớp dạy"
            data={dataAnalyst && dataAnalyst.tongNhom?.result}
          />
          <ClassDetailAnalyst
            title="Tổng buổi nghỉ bù"
            // desc="Tổng các thành viên các nhóm"
            data={dataAnalyst && dataAnalyst.tongBuoiNghi?.result}
          />

          
        </div>

        <div className="flex gap-4">
          {/* LEFT */}
          <div className="w-2/3  ">
            {/* DANH SÁCH LỚP HỌC */}
            <div className="">
              <Title title="Danh sách lớp học" />

              <ClassLists />
            </div>
            <Divider />

            {/* TÀI LIỆU */}
            <div className="">
              <Title title="TRỄ TIẾN ĐỘ MÔN" />
              <div className="h-[400px] overflow-hidden hover:overflow-y-scroll px-3">
                <DelayProgress />
              </div>
            </div>
            <Divider />
          </div>

          {/* RIGHT */}
          <div className="w-1/3">
            {/* <Title title="Bài tập" /> */}
            {/* {practices.length == 0 ? (
              <div className="">
                <h4 className="font-semibold text-center text-blue-900 ">
                  Hiện không có bài tập gì hết
                </h4>
                <img src={illu} alt="" />
              </div>
            ) : (
              <div className="flex flex-col gap-3 overflow-y-scroll h-[400px] border-gray-100 border-2 p-2">
                {practices &&
                  practices.length > 0 &&
                  practices.map((item) => <Practice props={item} />)}
              </div>
            )} */}

            <div className="">
              <Title title="NGHỈ BÙ" />
              <div className="h-[400px] overflow-y-scroll">
                <LeaveCalendar />
              </div>
            </div>

            <div className="">
              <Title title="Chưa chấm công giảng dạy" />
              <div className="h-[400px] overflow-y-scroll">
                <NotScored />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default HomePageTeacher;
