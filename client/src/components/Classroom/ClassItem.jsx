import { Badge, Popconfirm, Progress, Tag, message } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import request from "../../utils/request";
import { useSelector } from "react-redux";
const ClassItem = ({ reload, data, handleDelete }) => {
  const currentUser = useSelector((state) => state.user);

  const confirm = async (classGroup) => {
    const dataSubmit = {
      memberID: currentUser[0].memberID,
    };
    console.log(dataSubmit);
    const res = await request.delete(`subjectgroup/leave/${classGroup}`, {
      data: dataSubmit,
    });
    console.log(res, "res");

    if (res.data.affectedRows == 0) {
      message.error("Đã có lỗi xảy ra");
    } else {
      message.success("Đã rời lớp thành công");
      reload("join");
    }
  };
  return (
    <div className="w-1/6 relative">
      {handleDelete == true && (
        <Popconfirm
          title="Rời khỏi lớp"
          description="Bạn có muốn rời khỏi lớp không?"
          onConfirm={() => confirm(data.subjectGroupID)}
          okText="Thoát"
          cancelText="Không"
        >
          <button className="absolute rounded-full p-2 text-white -top-4 -right-4 z-10 bg-red-600">
            <IoMdClose />
          </button>
        </Popconfirm>
      )}
      <Link to={`/class/${data.subjectGroupID}`}>
        <div
          className={`w-full p-2 flex-col flex justify-between h-auto cursor-pointer rounded-md relative ${
            data?.subjectGroupClass?.includes("C1") ||
            data?.subjectGroupClass?.includes("C2") ||
            data?.subjectGroupClass?.includes("C3") ||
            data?.subjectGroupClass?.includes("C4") ||
            data?.subjectGroupClass?.includes("C5") ||
            data?.subjectGroupClass?.includes("C6") ||
            data?.subjectGroupClass?.includes("C7") ||
            data?.subjectGroupClass?.includes("C8")
              ? "bg-gradient-to-r to-blue-700 from-purple-700 "
              : "box-primary "
          }`}
        >
          {/* <Badge.Ribbon text={data.school} color="red"> */}
          <div className="flex items-center  gap-1 text-white  text-lg m-1 rounded-sm bg-white">
            <div className="flex justify-between px-3 py-1 rounded-sm items-center w-full font-semibold text-gray-800 ">
              <h3 className="">Thứ {data.subjectGroupDay}</h3>
              <h3 className="">Tiết {data.subjectGroupCount}</h3>
            </div>
          </div>

          <div className="flex text-center items-center justify-center relative">
            <div className="flex justify-between items-center px-3 py-1 rounded-sm  w-full font-semibold text-white  m-1">
              <h3 className="flex items-center justify-center text-center w-full font-bold text-xl">
                Nhóm: {data.subjectGroupNameGroup}
              </h3>
            </div>
          </div>

          <div className=" bg-white font-bold text-lg m-1 p-1 rounded-sm ">
            <Progress
              type="line"
              // strokeColor={colors}
              percent={data?.progress}
              size="small"
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ClassItem;
