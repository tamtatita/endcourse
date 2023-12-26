import {
    AiFillCheckCircle,
    AiFillFileWord,
  AiFillMessage,
  AiOutlineUnorderedList,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { BiNotepad } from "react-icons/bi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { GrScorecard } from "react-icons/gr";
import { MdPlayLesson } from "react-icons/md";

const SidebarMenu = () => {
  const dataMenu = [
    { id: 1, name: "Thảo luận", icon: <AiFillMessage /> },
    { id: 2, name: "Ghi chú", icon: <BiNotepad /> },
    { id: 3, name: "Nhóm học tập", icon: <AiOutlineUsergroupAdd /> },
    { id: 4, name: "Danh sách sinh viên", icon: <AiOutlineUnorderedList /> },
    { id: 5, name: "Danh sách thành viên", icon: <HiOutlineUserGroup /> },
    { id: 6, name: "Bảng điểm", icon: <GrScorecard /> },
    { id: 7, name: "Bài giảng, file, video", icon: <AiFillFileWord /> },
    { id: 8, name: "Giáo án giảng dạy", icon: <MdPlayLesson /> },
    { id: 9, name: "Xác nhận tiến độ", icon: <AiFillCheckCircle /> },
   
  ];

  console.log("ssa");
  return (
    <div className="flex flex-col gap-2 bg-white text-black px-4 mt-3">
      {dataMenu.map((item) => (
        <div className="flex w-full  ">
          <button className="py-2 w-full  rounded-sm font-semibold bg-gray-100 text-gray-800 items-center flex gap-3 px-3 hover:bg-blue-50 hover:text-blue-500">
            {item.icon}
            {item.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SidebarMenu;
