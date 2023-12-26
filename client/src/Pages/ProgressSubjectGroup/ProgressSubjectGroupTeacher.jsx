import DefaultLayout from "../../Layout/DefaultLayout";
import { LuCalendarClock } from "react-icons/lu";
import {
  colors,
  dataProgress,
  optionSoTiet,
  optionThu,
  optionTietBatDau,
} from "../../constants";
import { IoMdSend } from "react-icons/io";
import star from "../../assets/star.png";
import {
  Divider,
  Modal,
  Pagination,
  Progress,
  Tabs,
  Tooltip,
  Tag,
  Space,
  Popconfirm,
  Checkbox,
  message,
  Input,
  Form,
  Select,
  InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import PageHeading from "../../components/global/PageHeading";
import PageTitleSmall from "../../components/global/PageTitleSmall";
import Title from "../../components/Home/Title";
import { BiSkipNext } from "react-icons/bi";
import { useSelector } from "react-redux";
import request from "../../utils/request";
import {
  AiFillBackward,
  AiFillCaretRight,
  AiFillNotification,
  AiOutlineMinus,
  AiOutlinePlus,
} from "react-icons/ai";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { FaAngleLeft } from "react-icons/fa";
const ProgressSubjectGroupTeacher = () => {
  const [dataCell, setDataCell] = useState([]);
  const [active, setActive] = useState({ open: false, subjectName: "" });

  const currentUser = useSelector((state) => state.user);
  const [maxTeachingStatusWeek, setMaxTeachingStatusWeek] = useState(null);
  const [selectedDataClass, setSelectedDataClass] = useState(1);
  const [data, setData] = useState([]);
  const [parsedData, setParsedData] = useState([]);
  const [filterData, setFilterData] = useState([]); // Lấy ra 1 item tương ứng với tuần
  const [formattedData, setFormattedData] = useState([]);
  const [result, setResult] = useState([]);
  const [dataNew, setDataNew] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const dataSubmit = { teacherID: currentUser[0].teacherID };
        const resTest = await request.post("progress/test", dataSubmit);
        console.log(resTest, "res test");
        setData(resTest.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, [reload]);

  useEffect(() => {
    const maxWeek = Math.max(...data?.map((item) => item.teachingStatusWeek));
    setMaxTeachingStatusWeek(maxWeek);
    const parsedData = data?.map((item) => {
      return {
        ...item,
        dataClass: JSON.parse(item.dataClass),
        schedules: JSON.parse(item.schedules),
      };
    });
    setParsedData(parsedData);
  }, [data, selectedDataClass]);

  useEffect(() => {
    if (!parsedData) {
      // Add any additional handling for when parsedData is undefined or null
      return;
    }

    let newData = [...parsedData];

    parsedData?.forEach((item, index) => {
      const { teachingStatusWeek, schedules, dataClass } = item;

      if (schedules && schedules.length > 0) {
        schedules?.forEach((schedule, scheduleIndex) => {
          const {
            week,
            status,
            compensationScheduleThu,
            subjectGroupID,
            subjectID,
            subjectName,
            compensationScheduleID,
            ...res
          } = schedule;

          if (teachingStatusWeek !== week) {
            // Create a new schedule object
            const newSchedule = {
              compensationScheduleThu: compensationScheduleThu,
              compensationScheduleID: compensationScheduleID,
              status: status,
              week: week,
              subjectGroupID: subjectGroupID,
              subjectID: subjectID,
              subjectName: subjectName,
              ...res,
            };

            const existingItems = parsedData?.filter((item) => {
              return item.teachingStatusWeek === week;
            });

            if (existingItems && existingItems?.length > 0) {
              // If there are existing items, add newSchedule to their schedules
              existingItems?.forEach((existingItem) => {
                if (!existingItem.schedules) {
                  existingItem.schedules = []; // Initialize the array if it doesn't exist
                }

                existingItem?.schedules?.push(newSchedule);
              });
              if (item?.schedules) {
                item?.schedules?.splice(scheduleIndex, 1);
              }
            }
          }
        });
      }
    });
    console.log("new data", newData);
    // chưa có hàm xóa object cũ

    setFormattedData(newData);
  }, [parsedData, reload]);

  console.log(parsedData, "parsedData");

  useEffect(() => {
    if (selectedDataClass >= 0 && formattedData.length > 0) {
      // Clone the formattedData[selectedDataClass] to avoid modifying the original array
      const week = { ...formattedData[selectedDataClass - 1] };

      // Merge schedules into dataClass
      week.dataClass = [...week?.dataClass, ...(week?.schedules || [])];

      // Tạo một đối tượng để lưu trữ dữ liệu đã được lọc
      const resultMap = {};

      // Lặp qua mảng dữ liệu
      week?.dataClass?.forEach((item) => {
        // Nếu subjectID chưa tồn tại trong resultMap, thêm nó vào và tạo một mảng con (Children)
        if (!resultMap[item.subjectID]) {
          resultMap[item.subjectID] = {
            subjectName: item.subjectName,
            subjectID: item.subjectID,
            children: [],
          };
        }

        // Thêm mục vào mảng con (Children) của subjectID tương ứng
        resultMap[item.subjectID].children.push({
          subjectGroupID: item.subjectGroupID,
          subjectGroupNameGroup: item.subjectGroupNameGroup,
          subjectGroupStart: item.subjectGroupStart,
          subjectGroupDay: item.subjectGroupDay || item.compensationScheduleThu,
          Progress: item.Progress,
          status: item?.status,
          teachingStatus: item?.teachingStatus,
          teachingStatusID: item?.teachingStatusID,
          compensationScheduleID: item?.compensationScheduleID,
          week: item?.week,
        });
      });

      // Chuyển đổi đối tượng resultMap thành mảng để có kết quả mong muốn
      const output = Object.values(resultMap);

      setResult(output);
    }
  }, [formattedData, selectedDataClass, reload]);

  const handleButtonClick = (week) => {
    setSelectedDataClass(week);
    setFilterData(parsedData[week]);
  };

  const handleReload = () => {
    setReload(!reload);
  };

  const itemsModal = [
    {
      label: "Xác nhận chưa dạy",
      key: 1,
      children: (
        <ModalLeave
          reload={handleReload}
          data={dataCell}
          week={selectedDataClass}
          name={active.subjectName}
        />
      ),
    },
    {
      label: "Xác nhận đã dạy",
      key: 2,
      children: (
        <ModalProgress
          reload={handleReload}
          data={dataCell}
          week={selectedDataClass}
        />
      ),
    },
  ];

  const handleModal = (type, data, name) => {
    if (type == "open") {
      setActive({ ...active, open: !active.open, subjectName: name });
      setDataCell(data);
    }
  };

  // console.log(parsedData, "parsed");
  console.log(data, "data");
  console.log(result, "result");

  return (
    <DefaultLayout>
      <PageHeading
        title="Nơi đánh dấu tiến độ giảng dạy"
        desc="Giảng viên có thể đánh dấu đã dạy, đánh dấu nghỉ bù"
      />
      <div className="">
        {/* PAGINATION */}
        <div className="gap-2 flex flex-col ">
          <div className="">
            <div className="flex ">
              {dataProgress.map((item) => (
                <div key={item.id} className="flex w-1/6 gap-2 items-center">
                  <div
                    style={{ backgroundColor: item.color }}
                    className={` border-[1px] border-gray-300 h-8 w-8 rounded-sm gap-2`}
                  ></div>
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          <Title title="SỐ tuần dạy" />

          <div className="flex gap-3">
            {Array.from({ length: maxTeachingStatusWeek }, (_, index) => (
              <button
                className={`ICON_FULL bg-gray-200 text-black h-10 w-10 text-center flex items-center justify-center ${
                  selectedDataClass == index + 1 && "bg-red-500 text-white"
                }`}
                key={index + 1}
                onClick={() => handleButtonClick(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div>
            <Divider />
            <Title title="Danh sách các nhóm theo tuần học" />
            <div className="flex gap-3">
              {result &&
                result?.length > 0 &&
                result.map((item, index) => (
                  <div className="flex flex-col w-[15%]">
                    <div
                      // style={{ backgroundColor: colors[index].text }}
                      className={`my-2 uppercase flex items-center justify-center text-center p-2 rounded-sm h-20 text-gray-800 bg-gray-200  font-bold test-base `}
                    >
                      <h1>{item?.subjectName}</h1>
                    </div>
                    {item?.children?.map((classGroup) => (
                      <div
                        onClick={() =>
                          handleModal("open", classGroup, item?.subjectName)
                        }
                        className={`h-40 w-full mb-4 shadow-md shadow-gray-300 border-[1px] border-gray-300 p-2 rounded-md flex flex-col justify-between ${
                          classGroup?.status == "Đã tạo lịch"
                            ? "bg-[#9333ea] text-white"
                            : classGroup?.teachingStatus === "Đã dạy"
                            ? "bg-[#a3e635] text-gray-800"
                            : classGroup?.teachingStatus === "Xin nghỉ"
                            ? "bg-rose-500 text-white"
                            : classGroup?.teachingStatus === "Đã tạo lịch"
                            ? "bg-[#FFFF66] text-gray-800"
                            : ""
                        } `}
                      >
                        {/* <h4>{item?.children[]}</h4> */}
                        <div
                          // style={{ backgroundColor: colors[index].text }}
                          className="flex box-primary items-center justify-between  text-white rounded-sm p-2 font-semibold"
                        >
                          <h1>Thứ: {classGroup.subjectGroupDay}</h1>
                          <h1>Tiết: {classGroup.subjectGroupStart}</h1>
                        </div>
                        <div className="flex justify-center items-center mt-3 gap-3">
                          <h1 className="font-extrabold text-base uppercase">
                            Nhóm: {classGroup.subjectGroupNameGroup}
                          </h1>
                          {classGroup.subjectGroupPractice == 1 && (
                            <Tooltip title="Thực hành">
                              <img src={star} alt="" />
                            </Tooltip>
                          )}
                        </div>
                        {classGroup?.status == "Đã tạo lịch" ? (
                          <div className=""></div>
                        ) : (
                          <div className="px-1 text-base bg-white rounded-sm font-semibold">
                            <Progress
                              percent={classGroup?.Progress.toFixed(2)}
                              size="small"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        width={1000}
        open={active.open}
        onCancel={() => handleModal("open")}
        title="Chấm công tiến độ"
      >
        <div className="">
          <Tabs type="card" items={itemsModal}></Tabs>
        </div>
      </Modal>
    </DefaultLayout>
  );
};

const ModalProgress = ({ reload, data, week }) => {
  const currentUser = useSelector((state) => state.user);
  const [reloading, setReload] = useState(false);
  const [dataGrouped, setDataGrouped] = useState([]);
  const [dataCheck, setDataCheck] = useState([]);
  const [dataLessonPlan, setDataLessonPlan] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const { classCode } = useParams();
  const [dataSubject, setDataSubject] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  console.log(data?.subjectGroupID, "data submit ======");

  const handleOk = async (id) => {
    console.log("id; ", id);
    const dataSubmit = {
      subjectGroupID: data?.subjectGroupID,
      currentWeek: week,
      chapterProgressIndexID: id,
    };
    try {
      const res = await request.post("confirmation/check", dataSubmit);
      if (res.status == 201) {
        message.success("Đã xác nhận thành công");
        setReload(!reloading);
        reload();
      } else {
        message.error("Đã có lỗi xảy ra");
      }
      console.log(res, "res");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchAPI = async () => {
      const dataSubmit = {
        teacherID: currentUser[0].teacherID,
        subjectGroupID: data?.subjectGroupID,
      };
      const dataCheck = { subjectGroupID: data?.subjectGroupID };
      try {
        const res = await request.post("lessonplan/get/all", dataSubmit);

        const resCheck = await request.post(
          "confirmation/get/check",
          dataCheck
        );

        setDataLessonPlan(res.data);
        setDataCheck(resCheck.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAPI();
  }, [reload, data]);

  useEffect(() => {
    // Duyệt qua mảng data
    const mergedArray = dataLessonPlan?.map((item) => {
      // Tìm phần tử trong dataCheck có cùng chapterProgressIndexID
      const matchingItem = dataCheck?.find(
        (checkItem) =>
          checkItem.chapterProgressIndexID === item.chapterProgressIndexID
      );

      // Nếu có phần tử trùng khớp, ghép dữ liệu
      if (matchingItem) {
        return {
          ...item,
          confirmationID: matchingItem.confirmationID,
          confirmationDay: matchingItem.confirmationDay,
          isTaught: matchingItem.isTaught,
          currentWeek: matchingItem.currentWeek,
        };
      }

      // Nếu không có phần tử trùng khớp, giữ nguyên item
      return item;
    });

    // Cập nhật state với mảng đã được ghép
    setMergedData(mergedArray);
    console.log(mergedArray, "merged");
  }, [dataLessonPlan, dataCheck, data]);

  useEffect(() => {
    if (mergedData.length > 0) {
      const groupedData = mergedData?.reduce((acc, current) => {
        let existingItem = acc.find(
          (item) => item.lessonplanID === current.lessonplanID
        );

        if (existingItem) {
          let existingChapter = existingItem.Chapters.find(
            (ch) => ch.chapterProgressID === current.chapterProgressID
          );

          if (existingChapter) {
            existingChapter.Children.push({
              chapterProgressIndexID: current.chapterProgressIndexID,
              chapterProgressIndexName: current.chapterProgressIndexName,
              chapterProgressIndexSTT: current.chapterProgressIndexSTT,
              chapterProgressIndexWeeks: current.chapterProgressIndexWeeks,
              isTaught: current.isTaught,
              currentWeek: current.currentWeek,
            });
          } else {
            existingItem.Chapters.push({
              chapterProgressID: current.chapterProgressID,
              chapterProgressName: current.chapterProgressName,
              chapterProgressStatus: current.chapterProgressStatus,
              chapterProgressIndex: current.chapterProgressIndex,
              Children: [
                {
                  chapterProgressIndexID: current.chapterProgressIndexID,
                  chapterProgressIndexName: current.chapterProgressIndexName,
                  chapterProgressIndexSTT: current.chapterProgressIndexSTT,
                  chapterProgressIndexWeeks: current.chapterProgressIndexWeeks,
                  isTaught: current.isTaught,
                  currentWeek: current.currentWeek,
                },
              ],
            });
          }
        } else {
          acc.push({
            lessonplanID: current.lessonplanID,
            lessonplanName: current.lessonplanName,
            subjectID: current.subjectID,
            subjectName: current.subjectName,
            Chapters: [
              {
                chapterProgressID: current.chapterProgressID,
                chapterProgressName: current.chapterProgressName,
                chapterProgressStatus: current.chapterProgressStatus,
                chapterProgressIndex: current.chapterProgressIndex,
                Children: [
                  {
                    chapterProgressIndexID: current.chapterProgressIndexID,
                    chapterProgressIndexName: current.chapterProgressIndexName,
                    chapterProgressIndexSTT: current.chapterProgressIndexSTT,
                    chapterProgressIndexWeeks:
                      current.chapterProgressIndexWeeks,
                    isTaught: current.isTaught,
                    currentWeek: current.currentWeek,
                  },
                ],
              },
            ],
          });
        }

        return acc;
      }, []);

      setDataGrouped(groupedData);
    }
  }, [mergedData, data, dataLessonPlan]);

  console.log(dataCheck, "group");

  return (
    <div className="">
      <div className="flex flex-col">
        {dataGrouped.length > 0 ? (
          dataGrouped?.map((item, index) => (
            <div className="">
              <h1 className="font-bold flex gap-2 justify-center items-center text-lg  p-2 my-2 text-center">
                {item.lessonplanName}
                <span className="bg-red-100 text-red-600 p-1 rounded-sm">
                  Tuần thứ {week}
                </span>
              </h1>
              <div className="h-[300px] overflow-y-scroll">
                {item?.Chapters?.sort((a,b) => a.chapterProgressIndex - b.chapterProgressIndex).map((chapter) => (
                  <div className="" key={chapter.chapterProgressID}>
                    <div className="my-2">
                      <h4 className="font-semibold font-sans ">
                        {chapter.chapterProgressName}
                      </h4>
                      <div className="w-1/4 bg-black h-[2px]"></div>
                    </div>
                    <div className="w-full flex-1">
                      {chapter?.Children?.map((chapterIndex) => (
                        <div className="w-full flex-1">
                          <Popconfirm
                            title="Ghi nhận đã dạy"
                            description="Bạn xác nhận hôm nay đã dạy những phần này? "
                            onConfirm={() =>
                              handleOk(chapterIndex.chapterProgressIndexID)
                            }
                          >
                            <Checkbox
                              style={{ width: "100%", flex: 1 }}
                              className="w-full font-sans"
                              checked={chapterIndex.isTaught}
                            >
                              <div className="flex w-full flex-1 justify-between gap-3">
                                <div className="w-[600px] flex-1">
                                  {chapterIndex.chapterProgressIndexName}
                                </div>
                                <div className="w-1/4 ">
                                  <Tag color="#009900">
                                    Tuần dự định:{" "}
                                    {chapterIndex.chapterProgressIndexWeeks}
                                  </Tag>
                                </div>

                                <div className="w-1/4">
                                  {chapterIndex.currentWeek ? (
                                    <div className="">
                                      {chapterIndex.chapterProgressIndexWeeks -
                                        chapterIndex?.currentWeek <
                                      0 ? (
                                        <Tag color="red-inverse">
                                          Tuần đã dạy:{" "}
                                          {chapterIndex.currentWeek}
                                        </Tag>
                                      ) : (
                                        <Tag color="blue-inverse">
                                          Tuần đã dạy:{" "}
                                          {chapterIndex.currentWeek}
                                        </Tag>
                                      )}
                                    </div>
                                  ) : (
                                    <h1 className="font-semibold text-red-600">
                                      Chưa chấm tiến độ
                                    </h1>
                                  )}
                                </div>
                              </div>
                            </Checkbox>
                          </Popconfirm>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="p-3 rounded-sm bg-gray-200 text-gray-800 font-sans">
            <h1 className="font-semibold">
              Lớp học chưa được gắn giáo án giảng dạy, hãy thêm giáo án vào lớp
              học để buổi học được diễn ra hoàn thiện
            </h1>

            <Link to="/lessonplan">
              <button className="ICON bg-blue-600 text-white shadow-md shadow-gray-200 my-3">
                <FaAngleLeft />
                Qua trang Giáo án
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const ModalLeave = ({ reload, data, week, name }) => {
  const [dataLeave, setDataLeave] = useState("");
  const [saveClassCode, setSaveClassCode] = useState("");
  const [reloading, setReloading] = useState(false);
  const [click, setClick] = useState({
    leave: false,
    undo: false,
    calendar: false,
    reschedule: false,
  });

  console.log("data", data);
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const dataSubmit = {
          subjectGroupID: data.subjectGroupID,
          teachingStatusWeek: week,
        };
        console.log(dataSubmit, "==");
        const res = await request.post("leave/find", dataSubmit);
        console.log(res.data.message[0].status, "res");

        setDataLeave(res.data.message[0].status);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, [week, data, reloading]);

  const handleConfirm = (type) => {
    if (type == "leave") {
      setClick({ ...click, leave: !click.leave });
      setReloading(!reloading);
    } else if (type == "undo") {
      setClick({ ...click, undo: !click.undo });
    } else if (type == "calendar") {
      setClick({ ...click, calendar: !click.calendar });
    } else if (type == "reschedule") {
      setClick({ ...click, reschedule: !click.reschedule });
    }
  };

  let navigate = useNavigate();

  const handleRouter = () => {
    navigate(`/class/${data.subjectGroupID}`);
  };

  const handleReloading = () => {
    setReloading(!reloading);
  };

  useEffect(() => {
    const fetchAPI = async () => {
      if (click.leave == true) {
        try {
          const dataSubmit = {
            type: "leave",
            subjectGroupID: data.subjectGroupID,
            teachingStatusWeek: week,
          };

          const res = await request.patch("leave/update", dataSubmit);
          console.log(res);
          if (res.status == 201) {
            message.success("Bạn đã cập nhật trạng thái đã nghỉ thành công");
            setSaveClassCode(res?.data?.id);
            reload();
            handleReloading();
          } else {
            message.error("Đã có lỗi xảy ra");
          }
        } catch (error) {
          console.log(error);
        }
      } else if (click.undo == true && reloading === true) {
        try {
          const dataSubmit = {
            type: "undo",
            subjectGroupID: data.subjectGroupID,
            teachingStatusWeek: week,
          };

          const res = await request.patch("leave/update", dataSubmit);
          console.log(res);
          if (res.status == 201) {
            message.success(
              "Bạn đã cập nhật trạng thái dạy lại buổi nghỉ thành công"
            );
            setSaveClassCode(res?.data?.id);
          } else {
            message.error("Đã có lỗi xảy ra");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchAPI();
  }, [click.leave, click.undo]);

  console.log(dataLeave, "leave");

  return (
    <div className="my-4">
      <div className="">
        {data.status == "Đã tạo lịch" ? (
          <div className="">
            <h1 className="my-3 bg-gray-200 text-gray-800 font-semibold font-sans p-3 rounded-sm">
              Đây là buổi dạy bù, nếu bạn muốn dời lịch bù thì chọn vào "Dời
              lịch bù", còn nếu dạy buổi bù này thì hãy chọn Tab "Xác nhận đã
              dạy", và chọn các phần mà bạn dạy
            </h1>

            <button
              onClick={() => handleConfirm("reschedule")}
              className="bg-blue-600 text-white ICON"
            >
              <LuCalendarClock />
              Dời lịch bù
            </button>
          </div>
        ) : (
          <div className="">
            {dataLeave == "Kế hoạch" ? (
              <>
                <div className="bg-gray-200 p-3 rounded-sm text-gray-800 text-lg font-semibold relative ">
                  Bạn xác nhận tuần này không dạy môn
                  <span className="font-bold  px-1 ">{name}</span>
                  Nhóm{" "}
                  <span className="font-bold  px-1 ">
                    {data?.subjectGroupNameGroup}
                  </span>
                  , thứ{" "}
                  <span className="font-bold  px-1 ">
                    {data?.subjectGroupDay}
                  </span>
                  , tiết{" "}
                  <span className="font-bold  px-1 ">
                    {data?.subjectGroupStart}
                  </span>
                  chứ ?{" "}
                  <img
                    src={""}
                    className="-top-4 right-0 absolute object-cover"
                    alt=""
                  />
                </div>

                <div className="my-3">
                  <div className="flex gap-3 items-center">
                    {dataLeave == "Kế hoạch" && (
                      <button
                        onClick={() => handleConfirm("leave")}
                        className="ICON bg-blue-600 text-white"
                      >
                        <BiSkipNext />
                        Xác nhận nghỉ
                      </button>
                    )}

                    {dataLeave == "Đã tạo lịch" && (
                      <button
                        onClick={() => handleConfirm("reschedule")}
                        className="ICON bg-cyan-600 text-white"
                      >
                        <BiSkipNext />
                        Dời lịch bù
                      </button>
                    )}

                    {/* {click.leave && (
                      <button
                        onClick={() => handleRouter()}
                        className="ICON bg-yellow-600 text-white"
                      >
                        <AiFillNotification />
                        Thông báo cho lớp
                      </button>
                    )} */}
                    {dataLeave == "Chưa tạo lịch" && (
                      <button
                        onClick={() => handleConfirm("calendar")}
                        className="ICON bg-green-600 text-white"
                      >
                        <BsFillCalendarDateFill />
                        Tạo lịch bù
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : dataLeave == "Xin nghỉ" ? (
              <div className="flex flex-col">
                <h1 className="font-bold text-rose-600 bg-rose-100 p-2 text-lg my-2">
                  Bạn chưa tạo lịch học bù, hãy tạo lịch học bù để không bị trễ
                  tiến độ
                </h1>

                <div className="">
                  <button
                    onClick={() => handleConfirm("calendar")}
                    className="ICON bg-green-600 text-white"
                  >
                    <BsFillCalendarDateFill />
                    Tạo lịch bù
                  </button>
                </div>
              </div>
            ) : dataLeave == "Đã tạo lịch" ? (
              <div className="">
                <h1 className="font-bold  bg-yellow-100 text-orange-600 rounded-sm p-2 text-lg my-2">
                  Bạn đã tạo lịch học bù ở môn này
                </h1>
              </div>
            ) : (
              <h1 className="font-bold text-lg bg-lime-100 text-green-600 p-3 rounded-sm ">
                Trong tuần này, bạn đã dạy môn học này
              </h1>
            )}
          </div>
        )}
      </div>

      <Modal
        width={600}
        title={`${click.calendar ? "Tạo lịch bù" : "Dời lịch bù"}`}
        onCancel={() => handleConfirm(`${click.calendar ? 'calendar' : 'reschedule'}`)}

        open={click.calendar || click.reschedule}
      >
        <div className="">
          <ModalCalendar
            reloadMain={reload}
            closeModal={handleConfirm}
            reload={handleReloading}
            classCode={saveClassCode}
            data={data}
            type={click.calendar ? "schedule" : "reschedule"}
          />
        </div>
      </Modal>

    
    </div>
  );
};

const ModalCalendar = ({
  type,
  reloadMain,
  closeModal,
  reload,
  classCode,
  data,
}) => {
  console.log(classCode, "classCode");
  const onFinish = async (values) => {
    console.log("Success:", values);
    const dataSubmit = {
      thu: values?.thu,
      tietBatDau: values?.tietBatDau,
      soTiet: values?.soTiet,
      tuan: values?.tuan,
      phong: values.className,
      id: data?.teachingStatusID,
    };
    console.log(dataSubmit, "data submit");

    const res = await request.post("leave/create/calendar", dataSubmit);
    console.log(res, "res");

    if (res.status == 201) {
      message.success("Bạn đã tạo lịch bù thành công");
      reload();
      reloadMain();
      closeModal("calendar");
    } else {
      message.error("Đã có lỗi xảy ra");
    }
  };
  console.log(data, "data lớp bù");

  const onFinishReschedule = async (values) => {
    console.log("Success:", values);
    const dataSubmit = {
      thu: values?.thu,
      tietBatDau: values?.tietBatDau,
      soTiet: values?.soTiet,
      tuan: values?.tuan,
      phong: values.className,
      id: data?.compensationScheduleID,
    };
    console.log(dataSubmit, "data submit");

    const res = await request.patch("leave/reschedule", dataSubmit);
    console.log(res, "res");

    if (res.status == 201) {
      message.success("Bạn đã dời lịch bù thành công");
      reload();
      reloadMain();
      closeModal("calendar");
    } else {
      message.error("Đã có lỗi xảy ra");
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="flex gap-3 w-full flex-col">
      <div className="w-full">
        {type == "schedule" ? (
          <Form
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div className="flex gap-3">
              <Form.Item
                className="w-1/4"
                label="Thứ"
                name={`thu`}
                rules={[
                  {
                    required: true,
                    message: "Please input your thu!",
                  },
                ]}
              >
                <Select>
                  {optionThu.map((item) => (
                    <Select.Option value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                className="w-1/4"
                label="Tiết"
                name={`tietBatDau`}
                rules={[
                  {
                    required: true,
                    message: "Please input your thu!",
                  },
                ]}
              >
                <Select>
                  {optionTietBatDau.map((item) => (
                    <Select.Option value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                className="w-1/4"
                label="Số tiết"
                name={`soTiet`}
                rules={[
                  {
                    required: true,
                    message: "Please input your thu!",
                  },
                ]}
              >
                <Select>
                  {optionSoTiet.map((item) => (
                    <Select.Option value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="flex gap-3">
              <Form.Item
                className="w-1/2"
                label="Tên phòng"
                name="className"
                rules={[
                  {
                    required: true,
                    message: "Please input your thu!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                className="w-1/4"
                label="Tuần"
                name={`tuan`}
                rules={[
                  {
                    required: true,
                    message: "Please input your tuan!",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
            </div>

            <Form.Item>
              <button
                className="ICON bg-purple-600 text-white"
                type="primary"
                htmlType="submit"
              >
                <IoMdSend />
                Tạo lịch bù
              </button>
            </Form.Item>
          </Form>
        ) : (
          <Form
            name="basic"
            onFinish={onFinishReschedule}
            autoComplete="off"
            initialValues={{
              thu: data.subjectGroupDay,
              tietBatDau: data.subjectGroupStart,
              tuan: data.week
            }}
          >
            <div className="flex gap-3">
              <Form.Item
                className="w-1/4"
                label="Thứ"
                name={`thu`}
                rules={[
                  {
                    required: true,
                    message: "Please input your thu!",
                  },
                ]}
              >
                <Select>
                  {optionThu.map((item) => (
                    <Select.Option value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                className="w-1/4"
                label="Tiết"
                name={`tietBatDau`}
                rules={[
                  {
                    required: true,
                    message: "Please input your thu!",
                  },
                ]}
              >
                <Select>
                  {optionTietBatDau.map((item) => (
                    <Select.Option value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                className="w-1/4"
                label="Số tiết"
                name={`soTiet`}
                rules={[
                  {
                    required: true,
                    message: "Please input your thu!",
                  },
                ]}
              >
                <Select>
                  {optionSoTiet.map((item) => (
                    <Select.Option value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="flex gap-3">
              <Form.Item
                className="w-1/2"
                label="Tên phòng"
                name="className"
                rules={[
                  {
                    required: true,
                    message: "Please input your thu!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                className="w-1/4"
                label="Tuần"
                name={`tuan`}
                rules={[
                  {
                    required: true,
                    message: "Please input your tuan!",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
            </div>

            <Form.Item>
              <button
                className="ICON bg-blue-600 text-white"
                type="primary"
                htmlType="submit"
              >
                <BiSkipNext />
                Dời lịch bù
              </button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ProgressSubjectGroupTeacher;
