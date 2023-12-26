import { Empty, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { BsCalendar2XFill } from "react-icons/bs";
import request from "../../utils/request";
import { useSelector } from "react-redux";
import { TimeMysql } from "../../utils/Common";
import NotData from "../global/NotData";

const DelayProgress = () => {
  const [dataProgress, setDataProgress] = useState([]);
  const [groupedData, setGroupedData] = useState([]);

  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAPI = async () => {
      const dataSubmit = { teacherID: currentUser[0].teacherID };
      try {
        const res = await request.post("progress/delay", dataSubmit);
        console.log(res, "res delay");
        setDataProgress(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);

  useEffect(() => {
    // Function to group data
    const groupData = () => {
      const grouped = dataProgress?.reduce((acc, item) => {
        // Group by subjectID
        const existingSubject = acc.find(
          (subject) => subject.subjectID === item.subjectID
        );
        if (existingSubject) {
          console.log("Lọt vào key trùng subjectID");

          // Group by subjectGroupID
          const existingGroup = existingSubject.children.find(
            (group) => group.subjectGroupID === item.subjectGroupID
          );
          if (existingGroup) {
            console.log("Lọt vào key trùng subjectgroupid");
            // Group by chapterID
            const existingChapter = existingGroup.dataTaught.find(
              (chapter) => chapter.chapterID === item.chapterID
            );
            if (existingChapter) {
              console.log("Lọt vào key trùng chapterid");

              // Group by confirmationID
              const existingConfirmation = existingChapter.dataIndex.find(
                (confirmation) =>
                  confirmation.confirmationID === item.confirmationID
              );
              if (existingConfirmation) {
                console.log("Lọt vào key trùng confirm");

                // Update existing confirmation data
                existingConfirmation.dataIndex.push({
                  confirmationID: item.confirmationID,
                  chapterProgressIndexWeeks: item.chapterProgressIndexWeeks,
                  confirmationDay: item.confirmationDay,
                  chapterProgressIndexID: item.chapterProgressIndexID,
                  chapterProgressIndexName: item.chapterProgressIndexName,
                  chapterProgressIndexSTT: item.chapterProgressIndexSTT,
                  currentWeek: item.currentWeek,
                });
              } else {
                // Add new confirmation data
                existingChapter.dataIndex.push({
                  confirmationID: item.confirmationID,
                  chapterProgressIndexWeeks: item.chapterProgressIndexWeeks,
                  confirmationDay: item.confirmationDay,
                  chapterProgressIndexID: item.chapterProgressIndexID,
                  chapterProgressIndexName: item.chapterProgressIndexName,
                  chapterProgressIndexSTT: item.chapterProgressIndexSTT,
                  currentWeek: item.currentWeek,
                });
              }
            } else {
              // Add new chapter data
              existingGroup.dataTaught.push({
                chapterID: item.chapterID,
                chapterName: item.chapterName,
                chapterIndex: item.chapterIndex,
                dataIndex: [
                  {
                    confirmationID: item.confirmationID,
                    chapterProgressIndexWeeks: item.chapterProgressIndexWeeks,
                    confirmationDay: item.confirmationDay,
                    chapterProgressIndexID: item.chapterProgressIndexID,
                    chapterProgressIndexName: item.chapterProgressIndexName,
                    chapterProgressIndexSTT: item.chapterProgressIndexSTT,
                    currentWeek: item.currentWeek,
                  },
                ],
              });
            }
          } else {
            // Add new subjectGroup data
            existingSubject.children.push({
              subjectGroupID: item.subjectGroupID,
              subjectGroupNameGroup: item.subjectGroupNameGroup,
              subjectGroupDay: item.subjectGroupDay,
              subjectGroupStart: item.subjectGroupStart,
              subjectGroupClass: item.subjectGroupClass,
              dataTaught: [
                {
                  chapterID: item.chapterID,
                  chapterName: item.chapterName,
                  chapterIndex: item.chapterIndex,
                  dataIndex: [
                    {
                      confirmationID: item.confirmationID,
                      chapterProgressIndexWeeks: item.chapterProgressIndexWeeks,
                      confirmationDay: item.confirmationDay,
                      chapterProgressIndexID: item.chapterProgressIndexID,
                      chapterProgressIndexName: item.chapterProgressIndexName,
                      chapterProgressIndexSTT: item.chapterProgressIndexSTT,
                      currentWeek: item.currentWeek,
                    },
                  ],
                },
              ],
            });
          }
        } else {
          // Add new subject data
          acc.push({
            subjectID: item.subjectID,
            subjectName: item.subjectName,
            IDSubject: item.IDSubject,
            children: [
              {
                subjectGroupID: item.subjectGroupID,
                subjectGroupNameGroup: item.subjectGroupNameGroup,
                subjectGroupDay: item.subjectGroupDay,
                subjectGroupStart: item.subjectGroupStart,
                subjectGroupClass: item.subjectGroupClass,
                dataTaught: [
                  {
                    chapterID: item.chapterID,
                    chapterName: item.chapterName,
                    chapterIndex: item.chapterIndex,
                    dataIndex: [
                      {
                        confirmationID: item.confirmationID,
                        chapterProgressIndexWeeks:
                          item.chapterProgressIndexWeeks,
                        confirmationDay: item.confirmationDay,
                        chapterProgressIndexID: item.chapterProgressIndexID,
                        chapterProgressIndexName: item.chapterProgressIndexName,
                        chapterProgressIndexSTT: item.chapterProgressIndexSTT,
                        currentWeek: item.currentWeek,
                      },
                    ],
                  },
                ],
              },
            ],
          });
        }
        return acc;
      }, []);

      setGroupedData(grouped);
    };

    // Call the function to group data
    groupData();
  }, [dataProgress]);

  console.log(groupedData, "= grouped");

  return (
    <div>
      {groupedData.length > 0 ? (
        <h1>Hiện đã có môn bị trễ tiến độ tuần</h1>
      ) : (
        <Empty />
      )}
      {groupedData &&
        groupedData.length > 0 &&
        groupedData.map((item) => (
          <div key={item.subjectID} className="">
            <h2 className="bg-red-500 text-white px-3 py-2 rounded-sm w-fit">
              {item.subjectName} - {item.IDSubject}
            </h2>
            <div className="">
              {item.children.map((group) => (
                <div
                  key={group.subjectGroupID}
                  className="flex flex-col gap-3 my-2"
                >
                  <div className="flex gap-3">
                    <div className="ICON_FULL bg-red-100 text-rose-500">
                      <BsCalendar2XFill />
                    </div>
                    <div className="flex gap-3 bg-red-100 text-rose-500 px-4 rounded-full py-1 font-semibold">
                      <h4>Nhóm: {group.subjectGroupNameGroup}</h4>
                      <h4>Thứ: {group.subjectGroupDay}</h4>
                      <h4>Tiết: {group.subjectGroupStart}</h4>
                      <h4>Tên lớp: {group.subjectGroupClass}</h4>
                    </div>
                  </div>

                  <div className="flex flex-col ml-5 ">
                    {group.dataTaught.map((taught) => (
                      <div
                        className=" gap-2 flex flex-col"
                        key={taught.chapterID}
                      >
                        <h4>{taught.chapterName}</h4>
                        <div className="flex flex-col gap-3">
                          {taught.dataIndex.map((index) => (
                            <div
                              className="bg-gray-100 p-3 rounded-sm"
                              key={index.confirmationID}
                            >
                              <h1>
                                Tên chỉ mục giáo án:{" "}
                                <span className="font-bold text-base">
                                  {index.chapterProgressIndexName}
                                </span>
                              </h1>
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <h1>
                                    Tuần dự định:{" "}
                                    <span className="font-bold text-base">
                                      {index?.chapterProgressIndexWeeks}
                                    </span>
                                  </h1>

                                  <h1>
                                    Hiện tại:{" "}
                                    <span className="font-bold text-base ">
                                      {index.currentWeek}
                                    </span>
                                  </h1>
                                </div>

                                <h1 className="bg-red-500 text-white px-3 py-1  rounded-sm">
                                  Số tuần trễ:{" "}
                                  <span className="font-bold text-base">
                                    {index.currentWeek -
                                      index.chapterProgressIndexWeeks}
                                  </span>
                                </h1>
                              </div>

                              <span className='flex items-center gap-2'>
                                Ngày xác nhận:{" "}
                                <p className="font-bold">
                                  {TimeMysql(index.confirmationDay)}
                                </p>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default DelayProgress;
