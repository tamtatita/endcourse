import React, { useEffect, useRef, useState } from "react";
import PageTitleSmall from "../../global/PageTitleSmall";
import { BiPlus } from "react-icons/bi";
import check from "../../../assets/check.png";
import check_big from "../../../assets/check_big.png";
import cancelled from "../../../assets/cancelled.png";
import cancelled_big from "../../../assets/cancelled_big.png";
import inprogress from "../../../assets/work-in-progress.png";
import inprogress_big from "../../../assets/work-in-progress_big.png";
import megaphone from "../../../assets/megaphone.png";
import megaphone_big from "../../../assets/megaphone_big.png";
import future from "../../../assets/future.png";
import file from "../../../assets/file.png";
import future_big from "../../../assets/future_big.png";
import { DiGoogleAnalytics } from "react-icons/di";
import { Divider, Dropdown, Menu, Modal, Progress, Table, Tag } from "antd";
import request from "../../../utils/request";
import { AiFillEye } from "react-icons/ai";
import moment from "moment-timezone";
import { useParams } from "react-router-dom";
import { dataNotePractice, itemsPractice } from "../../../constants";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import { TimeMysql } from "../../../utils/Common";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import ViewPDF from "../../global/ViewPDF";
const PracticeClass = () => {
  const currentUser = useSelector((state) => state.user);
  const [groupedData, setGroupedData] = useState([]);
  const [totalMember, setTotalMember] = useState([]);
  const [data, setData] = useState([]);
  const { classCode } = useParams();

  useEffect(() => {
    const fetchAPI = async () => {
      const dataSubmit = {
        teacherID: currentUser[0].teacherID,
        subjectGroupID: classCode,
      };
      const dataSubmitTotalMember = { subjectGroupID: classCode };
      try {
        const res = await request.post("practice/getall", dataSubmit);
        const resTotalMember = await request.post(
          "practice/get/totalmember",
          dataSubmitTotalMember
        );
        console.log(res);
        setData(res.data);
        setTotalMember(resTotalMember?.data[0]?.total);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);

  useEffect(() => {
    const grouped = Object.values(
      data.reduce((acc, item) => {
        const { practiceID, submissionID, memberID } = item;

        if (!acc[practiceID]) {
          acc[practiceID] = { ...item, TotalMember: 0, submittedMembers: {} };
        }

        // Đếm số lượng thành viên dựa trên cặp submissionID-memberID
        if (submissionID && memberID) {
          const key = `${memberID}`;
          if (!acc[practiceID].submittedMembers[key]) {
            acc[practiceID].submittedMembers[key] = true;
            acc[practiceID].TotalMember += 1;
          }
        }

        return acc;
      }, {})
    );

    setGroupedData(grouped);
  }, [data]);

  return (
    <div>
      <PageTitleSmall title="danh sách bài tập đã giao cho lớp" />

      <div className="flex flex-col gap-3 ">
        <h4 className="font-bold text-lg">Với các trạng thái</h4>
        <div className="bg-gray-100 p-3 rounded-md w-full gap-3 flex  ">
          {dataNotePractice.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 font-semibold border-r-[1px] border-gray-500 w-1/4"
            >
              <img src={item.image} alt="" />
              <h1 className="text-sm">{item.name}</h1>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      <div className="h-[500px] overflow-y-scroll p-2">
        <BoxPractice data={groupedData} totalMembers={totalMember} />
      </div>
    </div>
  );
};

const BoxPractice = ({ data, totalMembers }) => {
  const [active, setActive] = useState({ analyst: false, see: false });
  const practiceClassID = useRef(null);

  const handleActiveModal = (type, id) => {
    console.log(id, "id");
    if (type === "analyst") {
      setActive({ ...active, analyst: !active.analyst });
      practiceClassID.current = id;
    } else if (type == "see") {
      setActive({ ...active, see: !active.see });
      practiceClassID.current = id;
    }
  };

  function CalculatePercent(totalMember, submitted) {
    if (submitted === 0 || totalMember === 0) {
      return 0; // Hoặc giá trị mặc định khác để chỉ ra dữ liệu không hợp lệ
    }

    const percentage = (submitted / totalMember) * 100;
    return percentage.toFixed(2);
  }

  const handleMenuPracticeClick = (e, practiceId) => {
    if (e.key == 1) {
      console.log("an");
      pinPost(postId);
    } else if (e.key == 4) {
      deletePost(postId);
    }
  };
  return (
    <div className="flex flex-col gap-3 h-[200px] ">
      {data.map((item) => (
        <div className="flex justify-between items-end gap-3 rounded-md bg-white p-4 shadow-lg shadow-gray-300">
          <div className="flex items-center gap-5">
            <img
              src={
                item?.status == "future"
                  ? future_big
                  : item?.status == "inprogress"
                  ? inprogress_big
                  : ""
              }
              alt=""
            />

            <div className="">
              <h5 className="mb-2 text-lg font-semibold leading-tight text-neutral-800 ">
                {item?.practiceTitle}
              </h5>
              <div className="flex flex-col items-center gap-3">
                <h3>Ngày tạo: {TimeMysql(item?.dayOpen)}</h3>

                <h3>Deadline: {TimeMysql(item?.dayClose)}</h3>
              </div>
            </div>
          </div>

          {/* BIỂU ĐỒ */}
          <div className="h-[120px]">
            <Progress
              type="circle"
              percent={CalculatePercent(totalMembers, item?.TotalMember)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Tag color="lime-inverse">{totalMembers || 0} em sinh viên</Tag>
            <Tag color="cyan-inverse">{item?.TotalMember || 0} em đã nộp</Tag>
            <Tag color="red-inverse">
              {totalMembers - item?.TotalMember || 0} em chưa nộp
            </Tag>
          </div>

          <div className="flex flex-col justify-end items-end gap-3">
            <Dropdown
              overlay={
                <Menu onClick={(e) => handleMenuPostClick(e, data.postID)}>
                  {itemsPractice.map((item) => (
                    <Menu.Item key={item.key} danger={item.danger}>
                      {item.label}
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <button className="ICON_FULL w-fit bg-gray-200 text-black">
                <BsThreeDotsVertical />
              </button>
            </Dropdown>
            <button
              onClick={() => handleActiveModal("see", item?.practiceFile)}
              className="ICON text-orange-600 bg-yellow-100 "
            >
              <AiFillEye />
              Xem bài tập
            </button>

            <button
              onClick={() =>
                handleActiveModal("analyst", item.practiceInClassID)
              }
              className="ICON bg-cyan-100 text-blue-500"
            >
              <DiGoogleAnalytics />
              Lịch sử nộp
            </button>
          </div>
          {/* <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} /> */}
        </div>
      ))}

      <Modal
        onCancel={() => handleActiveModal("analyst")}
        width={900}
        open={active.analyst}
        title="Lịch sử nộp bài"
      >
        <div className="">
          <HistorySubmit id={practiceClassID.current} />
        </div>
      </Modal>

      <Modal
        onCancel={() => handleActiveModal("see")}
        width={1000}
        style={{ height: 600 }}
        open={active.see}
        title="Bài tập"
      >
        <div className="">
          <ViewPDF file={practiceClassID.current} />
        </div>
      </Modal>
    </div>
  );
};

const HistorySubmit = ({ id }) => {
  const [data, setData] = useState([]);
  const [grouped, setGrouped] = useState([]);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const dataSubmit = { practiceInClassID: id };
        const res = await request.post("practice/get/history", dataSubmit);
        console.log(res, "res history");
        setData(res.data);
      } catch (error) {
        console.log(errror);
      }
    };
    fetchAPI();
  }, [id]);

  useEffect(() => {
    const grouped = Object.values(
      data.reduce((acc, item) => {
        const { memberID, memberName, MSSV, score } = item;
        if (!acc[memberID]) {
          acc[memberID] = { memberID, memberName, MSSV, score, Children: [] };
        }

        // Tạo mảng con Children
        const { dayCreate, submissionID, submissionFile, practiceInClassID } =
          item;
        acc[memberID].Children.push({
          dayCreate,
          submissionID,
          submissionFile,
          practiceInClassID,
        });

        return acc;
      }, {})
    );
    setGrouped(grouped);
  }, [data, id]);

  console.log("data history", grouped);
  return (
    <div className="">
      <div class="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
        <table class="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-4 font-medium text-gray-900">
                STT
              </th>
              <th scope="col" class="px-6 py-4 font-medium text-gray-900">
                Họ tên
              </th>
              <th scope="col" class="px-6 py-4 font-medium text-gray-900">
                MSSV
              </th>
              <th scope="col" class="px-6 py-4 font-medium text-gray-900">
                Ngày nộp
              </th>
              <th scope="col" class="px-6 py-4 font-medium text-gray-900"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 border-t border-gray-100">
            {grouped.map((item, index) => (
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <span class="h-1.5 w-1.5 rounded-full">{index + 1}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="h-1.5 w-1.5 rounded-full">
                    {item.memberName ? (
                      item.memberName
                    ) : (
                      <Tag color="red-inverse">Không có</Tag>
                    )}
                  </span>
                </td>
                <td class="px-6 py-4">
                  {item.MSSV ? (
                    item.MSSV
                  ) : (
                    <Tag color="red-inverse">Không có</Tag>
                  )}
                </td>
                <td class="px-6 py-4">
                  {item.Children.map((submit) => (
                    <div className="flex gap-3">
                      <div className="flex gap-3 items-center">
                        <span>{TimeMysql(submit.dayCreate)}</span>
                        <a href={submit.submissionFile}>
                          <img src={file} alt="" />
                        </a>
                      </div>
                    </div>
                  ))}
                </td>
                <td class="px-6 py-4">
                  <button className="ICON_FULL bg-blue-600 text-white">
                    <AiFillEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PracticeClass;
