import React, { useEffect, useState } from "react";
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
import future_big from "../../../assets/future_big.png";
import { DiGoogleAnalytics } from "react-icons/di";
import {
  Divider,
  Dropdown,
  Menu,
  Modal,
  Popconfirm,
  Progress,
  Table,
  Tag,
  message,
} from "antd";
import CONVERT from "../../../hooks/useConvertDayTime";
import Title from "../../Home/Title";
import { AiFillEye, AiOutlineFastBackward } from "react-icons/ai";
import moment from "moment-timezone";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../../firebase-config";
import { useParams } from "react-router-dom";
import { dataNotePractice, itemsPractice } from "../../../constants";
import {
  BsFillSendCheckFill,
  BsFillSendPlusFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import request from "../../../utils/request";
import { TimeMysql } from "../../../utils/Common";
import ViewPDF from "../../global/ViewPDF";
const PracticeClassStudent = () => {
  const [data, setData] = useState([]);
  const { classCode } = useParams();

  useEffect(() => {
    const fetchAPI = async () => {
      const subjectGroupID = classCode;
      try {
        const res = await request.post(`practice/get/member/${subjectGroupID}`);
        console.log(res, "res");
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);

  console.log("data cha", data);

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
        {data &&
          data.length > 0 &&
          data.map((item, index) => <BoxPractice data={item} />)}
      </div>
    </div>
  );
};

const BoxPractice = ({ data }) => {
  const [active, setActive] = useState({
    submit: false,
    openFile: false,
    link: "",
    modal: false,
  });
  const [selectedFile, setSelectedFile] = useState("");
  const [status, setStatus] = useState("");

  // Chuyển đổi dayOpen và dayClose thành đối tượng moment
  const dayOpenMoment = moment(data?.dayOpen);
  const dayCloseMoment = moment(data?.dayClose);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = moment().tz("Asia/Ho_Chi_Minh");
      // console.log('cu', currentDate)

      if (currentDate.isBefore(dayOpenMoment)) {
        setStatus("future");
      } else if (currentDate.isBetween(dayOpenMoment, dayCloseMoment)) {
        setStatus("inprogress");
      } else if (currentDate.isAfter(dayCloseMoment)) {
        setStatus("close");
      }
      // console.log(currentDate, dayCloseMoment, dayOpenMoment);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleActiveModal = (type, link) => {
    if (type === "submit") {
      setActive({ ...active, submit: !active.submit });
    } else if (type === "openFile") {
      setActive({ ...active, openFile: !active.openFile, link: link });
    } else if (type === "modal") {
      setActive({ ...active, modal: !active.modal });
    }
  };

  console.log(data, "vvv");

  const handleMenuPracticeClick = (e, practiceId) => {
    if (e.key == 1) {
      console.log("an");
      pinPost(postId);
    } else if (e.key == 4) {
      deletePost(postId);
    }
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const confirm = (e) => {
    console.log(e);
    message.success("Click on Yes");
  };

  return (
    <div className="flex flex-col gap-3 h-[200px] ">
      <div className="flex justify-between items-end gap-3 rounded-md bg-white p-4 shadow-gray-200 border-[1px] border-gray-300">
        <div className="flex items-center gap-5">
          <img
            src={
              status == "future"
                ? future_big
                : status == "inprogress"
                ? inprogress_big
                : status == "close"
                ? check_big
                : ""
            }
            alt=""
          />

          <div className="">
            <h5 className="mb-2 text-base font-semibold leading-tight text-neutral-800 ">
              {data?.practiceTitle}
            </h5>
            <div className="flex flex-col items-center gap-3 font-semibold">
              <Tag color="lime">Ngày tạo: {TimeMysql(data?.dayOpen)}</Tag>

              <Tag color="error">Deadline: {TimeMysql(data?.dayClose)}</Tag>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end items-end gap-3">
          <Modal
            width={900}
            open={active.openFile}
            onCancel={() => handleActiveModal("openFile")}
          >
            <div className="h-[450px] overflow-y-scroll">
              <ViewPDF file={active?.link}></ViewPDF>
            </div>
          </Modal>
          <div className="flex gap-3">
            <button
              onClick={() => handleActiveModal("openFile", data?.practiceFile)}
              className="ICON text-white bg-purple-600 "
            >
              <AiFillEye />
              Xem bài tập
            </button>

            {status != "close" && (
              <button
                onClick={() => handleActiveModal("submit")}
                className="ICON text-white bg-cyan-600 "
              >
                <BsFillSendPlusFill />
                Nộp bài
              </button>
            )}

            <button className="ICON text-white bg-orange-600 ">
              <AiOutlineFastBackward />
              Nộp lại
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={active.submit}
        width={500}
        onCancel={() => handleActiveModal("submit")}
        title="Nộp bài"
      >
        <div className="">
          <div className="my-3">
            <h1 className="font-semibold text-base">
              Chọn file bài tập đã làm để nộp
            </h1>
            <input onChange={addImageToPost} type="file" name="" id="" />
          </div>

          {selectedFile != "" && (
            <Popconfirm
              title="Nộp bài"
              description="Bạn xác nhận sẽ nộp chứ ?"
              onConfirm={confirm}
              okText="Có"
              cancelText="Hủy"
            >
              <button className="ICON bg-cyan-600 text-white ">
                <BsFillSendCheckFill />
                NỘP
              </button>
            </Popconfirm>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PracticeClassStudent;
