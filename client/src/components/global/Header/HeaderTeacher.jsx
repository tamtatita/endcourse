import { BsBell, BsBoxArrowRight } from "react-icons/bs";
import { AiOutlineSetting } from "react-icons/ai";
import { UserOutlined } from "@ant-design/icons";
import { AutoComplete, Badge, Input } from "antd";
import user from "../../../assets/user.png";
import { FaComments } from "react-icons/fa";
import { useState, useEffect } from "react";
import teacher from "../../../assets/teacher.png";
import { BsFillSendCheckFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../../firebase-config";
import { TimeFirebase } from "../../../utils/Common";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../contexts/userSlice";

const HeaderTeacher = () => {
  const renderTitle = (title) => (
    <span>
      {title}
      <a
        style={{
          float: "right",
        }}
        href="https://www.google.com/search?q=antd"
        target="_blank"
        rel="noopener noreferrer"
      >
        more
      </a>
    </span>
  );
  const renderItem = (title, count) => ({
    value: title,
    label: (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {title}
        <span>
          <UserOutlined /> {count}
        </span>
      </div>
    ),
  });

  const [dataNotifi, setDataNotifi] = useState([]);

  const options = [
    {
      label: renderTitle("Libraries"),
      options: [
        renderItem("AntDesign", 10000),
        renderItem("AntDesign UI", 10600),
      ],
    },
    {
      label: renderTitle("Solutions"),
      options: [
        renderItem("AntDesign UI FAQ", 60100),
        renderItem("AntDesign FAQ", 30010),
      ],
    },
    {
      label: renderTitle("Articles"),
      options: [renderItem("AntDesign design language", 100000)],
    },
  ];

  const currentUser = useSelector((state) => state.user);

  const [active, setActive] = useState({ setting: false, notifi: false });

  const handleActiveModal = (type) => {
    if (type == "setting") {
      setActive({ ...active, setting: !active.setting });
    } else if (type == "notifi") {
      setActive({ ...active, notifi: !active.notifi });
    }
  };

  const teacherID = currentUser[0]?.teacherID;

  // useEffect(() => {
  //   const notifiRef = collection(db, "notifications");

  //   const unsubscribeNotifi = onSnapshot(
  //     query(
  //       notifiRef,
  //       where("memberID", "==", teacherID),
  //       orderBy("timestamp", "desc")
  //     ),
  //     (querySnapshot) => {
  //       const notifiData = querySnapshot.docs.map((doc) => {
  //         return { notificationsID: doc.id, ...doc.data() }; // Sử dụng 'return' để trả về object từ map function
  //       });

  //       setDataNotifi(notifiData);
  //     }
  //   );

  //   return () => {
  //     unsubscribeNotifi();
  //   };
  // }, [teacherID]);
  console.log(dataNotifi, "data");

  return (
    <div className="h-20 w-full  shadow-gray-400 border-b-2 border-gray-200 flex items-center justify-between px-4">
      <div className=""></div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <h1 className="flex items-center gap-2">
            Xin chào,
            <span className="font-bold">
              {currentUser[0].memberName || currentUser[0].teacherName}
            </span>
          </h1>
          <img src={currentUser[0].teacherID ? teacher : user} alt="" />
        </div>

        {/* <Badge count={dataNotifi?.length}>
          <button
            onClick={() => handleActiveModal("notifi")}
            className="p-3 rounded-full bg-gray-200 text-gray-900 font-bold cursor-pointer relative"
          >
            <BsBell />
            {/* {active.notifi && <NotifiModal data={dataNotifi} />} 
          </button>
        </Badge> */}

        <button
          onClick={() => handleActiveModal("setting")}
          className="p-3 rounded-full bg-gray-200 text-gray-900 font-bold  cursor-pointer relative"
        >
          <AiOutlineSetting />
          {active.setting && <SettingModal />}
        </button>
      </div>
    </div>
  );
};

const NotifiModal = ({ data }) => {
  return (
    <div className="absolute top-12 z-10  bg-white divide-y divide-gray-100 rounded-lg flex flex-col right-1 shadow-lg shadow-gray-300 mx-3 text-sm w-[500px] font-semibold">
      {data &&
        data.map((item) => (
          <div className="flex items-center gap-3 p-2  hover:bg-gray-100 ">
            <div
              className={`p-2 rounded-full ${
                item.type == "join"
                  ? "text-cyan-600 bg-cyan-100"
                  : item.type == "comment"
                  ? "bg-yellow-100 text-orange-500"
                  : item.type == "send"
                  ? "bg-green-100 text-green-500"
                  : ""
              }`}
            >
              {item.type == "join" ? (
                <BsBoxArrowRight />
              ) : item.type == "comment" ? (
                <FaComments />
              ) : item.type == "send" ? (
                <BsFillSendCheckFill />
              ) : (
                ""
              )}
            </div>

            <span className="flex">
              {item.type == "join" &&
                (item.memberName
                  ? item.memberName +
                    " đã vào lớp " +
                    item.subjectGroupID +
                    " ngày " +
                    TimeFirebase(item?.timestamp?.seconds)
                  : "Ai đó đã vào lớp " +
                    item.subjectGroupID +
                    "vào ngày " +
                    TimeFirebase(item?.timestamp?.seconds))}

              {item.type == "comment" &&
                item.studentName +
                  " đã bình luận" +
                  " " +
                  item.tenMon +
                  " " +
                  item.maLop}

              {item.type == "send" &&
                item.studentName +
                  " đã đăng 1 bài đăng vào " +
                  " " +
                  item.maLop +
                  " " +
                  item.tenMon}
            </span>
          </div>
        ))}
    </div>
  );
};

const SettingModal = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  return (
    <div className="absolute top-12 z-10  font-normal bg-white divide-y divide-gray-100 rounded-lg w-44 right-1 shadow-md shadow-gray-500">
      <ul class="py-2 text-sm text-gray-700 ">
        <li>
          <Link to="/user" class="block px-4 py-2 hover:bg-gray-100 ">
            Thông tin cá nhân
          </Link>
        </li>
      </ul>
      <div class="py-1">
        <button
          onClick={() => handleLogout()}
          class="flex w-full px-4 py-2 text-sm text-red-700 hover:bg-red-100 "
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default HeaderTeacher;
