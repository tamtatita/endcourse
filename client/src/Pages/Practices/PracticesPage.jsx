import React, { useEffect, useState } from "react";
import DefaultLayout from "../../Layout/DefaultLayout";
import PageHeading from "../../components/global/PageHeading";
import { useSelector } from "react-redux";
import { Modal, Progress, Select, Table, Tag } from "antd";
import request from "../../utils/request";
import moment from "moment-timezone";
import check from "../../assets/check.png";
import check_big from "../../assets/check_big.png";
import cancelled from "../../assets/cancelled.png";
import cancelled_big from "../../assets/cancelled_big.png";
import inprogress from "../../assets/work-in-progress.png";
import inprogress_big from "../../assets/work-in-progress_big.png";
import megaphone from "../../assets/megaphone.png";
import megaphone_big from "../../assets/megaphone_big.png";
import future from "../../assets/future.png";
import future_big from "../../assets/future_big.png";
import { AiFillEye } from "react-icons/ai";
import { IoMdAnalytics } from "react-icons/io";
const PracticesPage = () => {
  const [dataSubjectName, setDataSubjectName] = useState([]);
  const [dataAllPractice, setDataAllPractice] = useState([]);
  const [selectSubject, setSelectSubject] = useState({});
  const [dataGrouped, setDataGrouped] = useState([]);
  const currentUser = useSelector((state) => state.user);

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
    const fetchAPI = async () => {
      const dataSubmit = {
        teacherID: currentUser[0].teacherID,
      };
      try {
        const res = await request.post("practice/page/all", dataSubmit);
        console.log("res get all practice", res);
        setDataAllPractice(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);
  console.log(dataAllPractice, "===");

  useEffect(() => {
    // Gom nhóm dữ liệu theo subjectGroupID và đếm số lượng thành viên đã nộp
    const groupedData = Object?.values(
      dataAllPractice?.reduce((acc, curr) => {
        if (!acc[curr.subjectGroupID]) {
          acc[curr.subjectGroupID] = {
            subjectGroupID: curr.subjectGroupID,
            subjectGroupDay: curr.subjectGroupDay,
            subjectGroupStart: curr.subjectGroupStart,
            subjectGroupNameGroup: curr.subjectGroupNameGroup,
            Children: [],
          };
        }

        // Tạo object mới chỉ chứa các thuộc tính cần thiết
        const {
          practiceID,
          practiceTitle,
          practiceDayCreate,
          practiceStatus,
          practiceFile,
          dayOpen,
          dayClose,
        } = curr;
        const practiceData = {
          practiceID,
          practiceTitle,
          practiceDayCreate,
          practiceStatus,
          practiceFile,
          dayOpen,
          dayClose,
        };

        // Tính toán Count cho từng mục con
        let count = 0;
        if (curr.submissionID !== null && curr.memberID !== null) {
          count++;
        }

        // Thêm vào mảng Children
        acc[curr.subjectGroupID].Children.push({
          ...practiceData,
          Count: count,
        });

        return acc;
      }, {})
    );

    // Hiển thị dữ liệu đã gom nhóm và đếm thành viên đã nộp
    setDataGrouped(groupedData);
  }, [dataAllPractice, selectSubject]);

  console.log(dataGrouped, "all practice");
  const handleSelectChange = (selectedOption) => {
    setSelectSubject(selectedOption);
    const filteredData = dataAllPractice?.filter(
      (item) => item.subjectID == selectedOption
    );
    console.log(filteredData, "filter");
    setDataAllPractice(filteredData);
  };
  console.log(selectSubject);
  return (
    <DefaultLayout>
      <PageHeading
        title="danh sách các bài tập đã giao cho các lớp"
        desc="Toàn bộ các bài tập mà bạn đã giao"
      />

      <div className="">
        <h3 className="text-base font-semibold">Chọn môn </h3>
        <Select
          onChange={handleSelectChange}
          value={selectSubject}
          style={{
            width: 300,
          }}
          options={
            dataSubjectName && dataSubjectName.length > 0 && dataSubjectName
          }
        />
      </div>

      <div className="">
        {dataGrouped.map((item) => (
          <BoxPractice props={item} />
        ))}
      </div>
    </DefaultLayout>
  );
};

const BoxPractice = ({ props }) => {
  const [active, setActive] = useState({ analyst: false });

  const handleActiveModal = (type) => {
    if (type === "analyst") {
      setActive({ ...active, analyst: !active.analyst });
    }
  };
  const {
    subjectGroupID,
    tongThanhVien,
    subjectGroupNameGroup,
    subjectGroupDay,
    subjectGroupStart,
    Children,
  } = props;
  console.log(Children);
  return (
    <div className="bg-white border-[1px] border-gray-300 w-full my-4 p-3 rounded-sm shadow-lg shadow-gray-100 flex justify-start items-start">
      <div className="w-[20%]">
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <h1>Mã lớp học: </h1>
            <Tag color="red-inverse">{subjectGroupID}</Tag>
          </div>
          <h1 className="font-semibold text-md">
            Nhóm: {subjectGroupNameGroup} - Thứ {subjectGroupDay} - Tiết{" "}
            {subjectGroupStart}
          </h1>
        </div>
      </div>

      <div className="w-[80%]">
        {Children?.map((item, index) => (
          <div
            key={item.practiceID}
            className=" text-gray-800 shadow-lg shadow-gray-300 border-[1px] border-gray-200 flex p-2 rounded-sm mb-4 justify-between items-center"
          >
            <div className="">
              <img
                src={
                  item.status == "future"
                    ? future_big
                    : item.status == "close"
                    ? cancelled_big
                    : item.status == "inprogree"
                    ? inprogress_big
                    : ""
                }
                alt=""
              />
            </div>

            <div className="flex flex-col w-fit gap-2">
              <h1>{`Bài tập ${index + 1}: ${item.practiceTitle}`}</h1>
              <div className="flex items-center gap-2">
                <h1 className="w-[90px]">Ngày mở: </h1>
                <Tag color="lime-inverse">
                  {moment(item.dayOpen).format("DD-MM-YYYY HH:MM:SS")}
                </Tag>
              </div>

              <div className="flex items-center gap-2">
                <h1 className="w-[90px]">Ngày đóng: </h1>
                <Tag color="red-inverse">
                  {moment(item.dayClose).format("DD-MM-YYYY HH:MM:SS")}
                </Tag>
              </div>
            </div>

            <div className="text-white">
              <Progress size="default" type="circle" percent={45} />
            </div>

            <div className="flex flex-col gap-2">
              <Tag color="purple-inverse">{item.Count} em đã nộp bài</Tag>
              <Tag color="cyan-inverse">{item.conLai} em chưa nộp</Tag>
            </div>

            <div className="flex flex-col gap-2">
              <button className="ICON bg-yellow-100 text-orange-600">
                <AiFillEye />
                Xem bài tập
              </button>
              <button
                onClick={() => handleActiveModal("analyst")}
                className="ICON bg-cyan-100 text-blue-600"
              >
                <IoMdAnalytics />
                Thống kê
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        onCancel={() => handleActiveModal("analyst")}
        width={900}
        open={active.analyst}
        title="Lịch sử nộp bài"
      >
        <AnalystPractice />
      </Modal>
    </div>
  );
};

const AnalystPractice = ({ props }) => {
  const currentUser = useSelector((state) => state.user);

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => {
        return <>{index + 1}</>;
      },
    },
    {
      key: "MSSV",
      dataIndex: "MSSV",
      title: "MSSV",
      render: (MSSV) => {
        MSSV ? <>{MSSV}</> : <Tag color="red-inverse">Không</Tag>;
      },
    },
    {
      key: "memberName",
      dataIndex: "memberName",
      title: "Tên",
      render: (memberName) => {
        memberName ? <>{memberName}</> : <Tag color="red-inverse">Không</Tag>;
      },
    },
    {
      key: "maNhomHocTap",
      dataIndex: "maNhomHocTap",
      title: "Nhóm học",
      render: (MSSV) => {
        MSSV ? <>{MSSV}</> : <Tag color="red-inverse">Không</Tag>;
      },
    },
    {
      key: "submitionDayCreate",
      dataIndex: "submitionDayCreate",
      title: "Thời gian nộp",
    },
    {
      title: "Khoảng cách",
      render: (text, record) => {
        var a = moment("2016-06-06T21:03:55"); //now
        var b = moment("2016-05-06T20:03:55");
        const oneDayMilliseconds = 24 * 60 * 60 * 1000; // Số milliseconds trong một ngày

        const thoiGianNop = moment("2023-1-1 12:02:23");
        const thoiGianDeadline = moment("2023-1-2 2:1:11");
        console.log("thoiGianNop", thoiGianNop);
        console.log("thoiGianD", thoiGianDeadline);
        const khoangThoiGian = moment.duration(
          thoiGianDeadline.diff(thoiGianNop)
        );

        const khoangCachNgay = thoiGianDeadline.diff(thoiGianNop, "days");

        // Lấy số ngày, giờ, phút và giây
        const ngayConLai = Math.floor(khoangThoiGian.asDays());
        console.log("ngayconlai", khoangCachNgay);
        const gioConLai = khoangThoiGian.hours();
        const phutConLai = khoangThoiGian.minutes();
        const giayConLai = khoangThoiGian.seconds();
        return (
          <div className="">
            {ngayConLai != 0
              ? `${ngayConLai} ngày ${gioConLai} giờ ${phutConLai} phút ${giayConLai} giây`
              : `${gioConLai} giờ ${phutConLai} phút ${giayConLai} giây`}
          </div>
        );
      },
    },
    { key: "submissionFile", dataIndex: "submissionFile", title: "File" },
  ];
  const dataSubmit = { teacherID: currentUser[0]?.teacherID };
  const [data, setData] = useState([]);

  console.log("data", data);
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const res = await request.post("practice/get/analyst", dataSubmit);
        console.log(res, "res analyst");
        setData(res.data);
      } catch (error) {
        console.log(errror);
      }
    };
    fetchAPI();
  }, []);

  return <Table columns={columns} dataSource={data} />;
};

export default PracticesPage;
