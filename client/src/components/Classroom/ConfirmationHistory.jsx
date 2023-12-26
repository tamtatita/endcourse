import React, { useEffect, useState } from "react";
import { GiCancel } from "react-icons/gi";
import PageTitleSmall from "../global/PageTitleSmall";
import { useSelector } from "react-redux";
import request from "../../utils/request";
import { useParams } from "react-router-dom";
import { TimeMysql } from "../../utils/Common";
import moment from "moment-timezone";
const ConfirmationHistory = () => {
  const [data, setData] = useState([]);

  const { classCode } = useParams();

  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAPI = async () => {
      const dataSubmit = { subjectGroupID: classCode };
      try {
        const res = await request.post("leave/history", dataSubmit);
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
    <div>
      <body className="">
        <div className="p-4 mt-4">
          <PageTitleSmall title="lịch sử xác nhận tiến độ giảng dạy" />
          <div className="container my-4">
            <div className="flex flex-col md:grid grid-cols-12 text-gray-50">
              {data &&
                data.length > 0 &&
                data?.map((item) => (
                  <div className="flex md:contents">
                    <div className="col-start-2 col-end-3 mr-10 md:mx-auto relative">
                      <div className="h-full w-6 flex items-center justify-center">
                        <div
                          className={`h-full w-1 ${
                            item?.teachingStatus == "Đã dạy"
                              ? "bg-green-500"
                              : "bg-red-500"
                          } ${item?.currentWeek > item?.chapterProgressIndexWeeks && 'bg-orange-500'} pointer-events-none`}
                        ></div>
                      </div>
                      <div
                        className={`p-2 w-6 h-6 absolute top-1/2 -mt-3 rounded-full ${
                          item.teachingStatus == "Đã dạy"
                            ? "bg-green-500"
                            : "bg-red-500"
                        } ${item?.currentWeek > item?.chapterProgressIndexWeeks && 'bg-orange-500'} shadow text-center`}
                      >
                        {/* <GiCancel /> */}
                      </div>
                    </div>
                    <div
                      className={`${
                        item.teachingStatus == "Đã dạy"
                          ? "bg-green-500"
                          : "bg-red-500"
                      } ${item?.currentWeek > item?.chapterProgressIndexWeeks && 'bg-orange-500'} col-start-3 col-end-12 p-4 rounded-md my-4 mr-auto shadow-md w-full`}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold font-sans text-lg  mb-1 text-gray-800 bg-white px-3 py-1 rounded-sm">
                          Tuần dạy thứ {item?.currentWeek}:
                        </h3>
                        <span>{TimeMysql(item?.confirmationDay)}</span>
                      </div>
                      <div className="leading-tight text-justify w-full font-sans flex items-center gap-2">
                        Bạn đã xác nhận dạy:{" "}
                        <h1 className="font-bold text-base">
                          {item?.chapterProgressIndexName}
                        </h1>
                      </div>
                      {item?.currentWeek > item?.chapterProgressIndexWeeks && (
                          <h1 className='font-sans '>Tuy nhiên, đã bị trễ theo như kế hoạch là {item?.currentWeek - item?.chapterProgressIndexWeeks} tuần</h1>
                        )}
                    </div>
                  </div>
                ))}

              {/* <div className="flex md:contents">
                <div className="col-start-2 col-end-4 mr-10 md:mx-auto relative">
                  <div className="h-full w-6 flex items-center justify-center">
                    <div className="h-full w-1 bg-red-500 pointer-events-none"></div>
                  </div>
                  <div className="w-6 h-6 absolute top-1/2 -mt-3 rounded-full bg-red-500 shadow text-center">
                    <i className="fas fa-times-circle text-white"></i>
                  </div>
                </div>
                <div className="bg-red-500 col-start-4 col-end-12 p-4 rounded-xl my-4 mr-auto shadow-md w-full">
                  <h3 className="font-semibold text-lg mb-1 text-gray-50">
                    Cancelled
                  </h3>
                  <p className="leading-tight text-justify">
                    Customer cancelled the order
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </body>
    </div>
  );
};

export default ConfirmationHistory;
