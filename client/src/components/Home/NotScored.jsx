import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import request from "../../utils/request";
import { Link } from "react-router-dom";

const NotScored = () => {
  const [data, setData] = useState([]);
  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAPI = async () => {
      const dataSubmit = { teacherID: currentUser[0].teacherID };
      try {
        const res = await request.post("confirmation/not/scored", dataSubmit);
        console.log(res);
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);

  return (
    <div className="font-sans">
      <div className="flex flex-col gap-3">
        {data &&
          data.length > 0 &&
          data.map((item) => (
            <Link to="/progress">
              <div className="bg-gray-100 text-gray-800 rounded-sm p-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold ">{item?.subjectName}</span>

                  <div className="px-2 py-1 bg-red-500 text-white rounded-sm">
                    <span>Tuần {item.teachingStatusWeek}</span>
                  </div>
                </div>
                <h1>{`Nhóm: ${item.subjectGroupNameGroup} | Thứ: ${item.subjectGroupDay} | Tiết: ${item.subjectGroupCount}  `}</h1>
                <p className="text-sm italic">
                  Bạn chưa chấm công tiến độ ở tuần này
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default NotScored;
