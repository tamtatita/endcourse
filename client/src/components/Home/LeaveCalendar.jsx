import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import request from "../../utils/request";
import { Empty } from "antd";

const LeaveCalendar = () => {
  const [data, setData] = useState([]);
  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAPI = async () => {
      const dataSubmit = { teacherID: currentUser[0].teacherID };
      try {
        const res = await request.post("leave/reminder", dataSubmit);
        console.log(res);
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);

  console.log(data, "data");
  return (
    <div class="relative max-w-2xl">
      {data && data.length > 0 ? (
        data.map((item) => (
          <>
            <div
              class={`absolute top-0 h-full border-r-2 border-gray-500 left-3`}
            ></div>
            <ul class="space-y-2">
              <li>
                <div class="flex items-center">
                  <span
                    class={`w-6 h-6 ${
                      item.compensationScheduleID == null
                        ? "bg-red-500"
                        : "bg-green-500"
                    } rounded-full z-10`}
                  ></span>
                  <h5 class="ml-4 font-bold text-gray-600">
                    {item.subjectName + " Nhóm " + item.subjectGroupNameGroup}
                  </h5>
                </div>
                <div class="ml-12 pb-4">
                  <p className="text-sm text-gray-500 ">
                    {item.compensationScheduleID == null
                      ? `Tuần thứ ${item.teachingStatusWeek} bạn chưa tạo lịch học bù, hãy tạo lịch bù cho lớp để không trễ tiến độ`
                      : `Bạn đã tạo lịch học bù, lớp học sẽ bù vào tuần thứ ${item.week}`}
                  </p>
                </div>
              </li>
            </ul>
          </>
        ))
      ) : (
       <Empty />
      )}
    </div>
  );
};

export default LeaveCalendar;
