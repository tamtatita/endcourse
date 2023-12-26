import { Button, Checkbox, Modal, Popconfirm, Space, Tabs, Tag } from "antd";
import DefaultLayout from "../../Layout/DefaultLayout";
import { colors, dataSchedules as data, thoiGianHoc } from "../../constants";
import React, { useEffect, useState } from "react";
import { AiFillCaretRight } from "react-icons/ai";
import fire from "../../assets/fire.png";
import cancel from "../../assets/leave.png";
import PageHeading from "../../components/global/PageHeading";

const SchedulesTeacher = () => {
  // Initialize schedule state
  const [schedule, setSchedule] = useState(
    Array(11)
      .fill()
      .map(() => Array(7).fill(null))
  );

  useEffect(() => {
    // Create a copy of the schedule state
    const newSchedule = [...schedule];

    // Iterate over data array
    data.forEach((item, index) => {
      item.children.forEach((child) => {
        const start = Math.max(child.tietBatDau - 1, 0);
        const end = Math.min(start + child.soTiet, 10);
        const day = child.thu - 2;
        const rowspan = Math.min(end - start, 10 - start);
        const isActive = item.children.map((index) =>
          index.isActive ? true : false
        );
        const rowspanArray = Array(11).fill(0); // Khởi tạo mảng rowspan ban đầu

        // Trong vòng lặp
        if (rowspanArray[start] === 0) {
          newSchedule[start][day] = {
            subject: item.tenMonHoc,
            rowspan: rowspan,
            color: colors[index % colors.length],
            maLop: item.maLop,
            maPhong: item.phong,
            nhom: item.nhomMonHoc,
            isActive: isActive,
            thuMonHoc: day + 2,
            tietBatDau: start + 1,
            soTiet: child.soTiet,
          };
          rowspanArray[start] = rowspan;
        }
        // for (let i = start + 1; i < end; i++) {
        //   newSchedule[i][day] = { rowspan: 0, maPhong: "" }; // Empty cell
        // }
      });
    });

    setSchedule(newSchedule);
  }, []);

  const [activeModal, setActiveModal] = useState(false);
  const [dataCell, setDataCell] = useState([]);
  const handleCloseModal = () => {
    setActiveModal(false);
  };

  const handleOpen = async (data) => {
    setActiveModal(!activeModal);
    setDataCell(data);
  };

  console.log(dataCell);

  const itemsModal = [
    {
      label: "Xác nhận chưa dạy",
      key: 1,
      children: <ModalLeave data={dataCell} />,
    },
    { label: "Xác nhận đã dạy", key: 2, children: <ModalProgress /> },
  ];

  console.log(schedule);

  return (
    <DefaultLayout>
      <PageHeading title='Thời khóa biểu giảng viên' desc='Nơi cập nhật lịch vắng và xác nhận tiến độ mỗi môn'/>
      <div className="">
        <table className="min-w-full border text-center text-sm font-light text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" class="px-3 py-2">
                Tiết
              </th>
              <th scope="col" class="px-3 py-2">
                Thứ 2
              </th>
              <th scope="col" class="px-3 py-2">
                Thứ 3
              </th>
              <th scope="col" class="px-3 py-2">
                Thứ 4
              </th>
              <th scope="col" class="px-3 py-2">
                Thứ 5
              </th>
              <th scope="col" class="px-3 py-2">
                Thứ 6
              </th>
              <th scope="col" class="px-3 py-2">
                Thứ 7
              </th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, i) => (
              <tr className={`bg-white border-b w-[100px]`} key={i}>
                <td className="border-r px-6 py-4 flex flex-col font-medium whitespace-nowrap">
                  <h4>Tiết {i + 1}</h4>
                  <div className="text-[12px] font-semibold flex text-red-600">
                    <span>{thoiGianHoc[i]?.thoigianBatDau} - </span>
                    <span>{thoiGianHoc[i]?.thoiGianKetThuc} </span>
                  </div>
                </td>
                {row.map((cell, j) => (
                  <td
                    style={{
                      backgroundColor: cell?.color?.bg || "transparent",
                      color: cell?.color?.text || "black",
                      width: "160px",
                      height: "50px",

                      borderColor: cell ? cell?.color?.text : "transparent",
                      borderLeft: cell ? "3px solid" : "black",
                    }}
                    className={`border-r px-3 cursor-pointer hover:opacity-75 py-4 relative font-medium `}
                    key={j}
                    rowSpan={cell?.rowspan || 1}
                  >
                    {/* {cell && cell.isActive[j] == true && (
                      <img
                        src={cancel}
                        alt=""
                        className="absolute bg-white p-2 rounded-full bottom-1/3  border-2 border-gray-400 "
                      />
                    )} */}
                    {cell && (
                      <div
                        onClick={() => handleOpen(cell)}
                        className={`flex flex-col `}
                      >
                        <h4 className="text-sm font-semibold">
                          {cell?.subject}
                        </h4>
                        <span className="text-gray-800 font-bold">
                          {cell ? `Phòng: ${cell?.maPhong}` : ""}
                        </span>

                        <div className="bg-white px-2 py-1 rounded-full">
                          <h5 className="font-extrabold">
                            {cell ? `Nhóm: ${cell?.nhom}` : ""}
                          </h5>
                        </div>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <Modal
          title="QUẢN LÝ TIẾN ĐỘ"
          onCancel={handleCloseModal}
          open={activeModal}
        >
          <div className="flex flex-col bg-slate-50 ">
            <div
              style={{
                backgroundColor: dataCell?.color?.bg,
                color: dataCell?.color?.text,
              }}
              className="flex mb-5 items-center justify-between  px-3 py-2 rounded-full font-semibold text-lg"
            >
              <h5 className="flex-1">{dataCell?.subject}</h5>
              <h5>Nhóm: {dataCell?.nhom}</h5>
            </div>
            <div className="flex">
              <Tabs type="card" items={itemsModal}></Tabs>
            </div>
          </div>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

const ModalProgress = () => {
  const [dataSubject, setDataSubject] = useState([
    {
      id: 1,
      tenChuong: "Tổng qua về Cơ sở dữ liệu",
      children: [
        { id: 1, tenChiMuc: "Cơ sở dữ liệu là gì", active: false },
        { id: 1, tenChiMuc: "Cơ sở dữ liệu là gì", active: false },
        { id: 1, tenChiMuc: "Cơ sở dữ liệu là gì", active: false },
        { id: 1, tenChiMuc: "Cơ sở dữ liệu là gì", active: false },
      ],
      active: true,
    },
    {
      id: 2,
      tenChuong: "Luật hấp dẫn",
      children: [
        { id: 1, tenChiMuc: "Cơ sở dữ liệu là gì", active: false },
        { id: 1, tenChiMuc: "Cơ sở dữ liệu là gì", active: false },
        { id: 1, tenChiMuc: "Cơ sở dữ liệu là gì", active: false },
        { id: 1, tenChiMuc: "Cơ sở dữ liệu là gì", active: false },
      ],
      active: false,
    },
    {
      id: 3,
      tenChuong: "Định luật bảo toàn khối lượng",
      children: [
        { id: 1, tenChiMuc: "Cơ sở dữ liệu là gì", active: false },
        { id: 1, tenChiMuc: "Cơ sở dữ liệu là gì", active: false },
        { id: 1, tenChiMuc: "Cơ sở dữ liệu là gì", active: false },
        { id: 1, tenChiMuc: "Cơ sở dữ liệu là gì", active: false },
      ],
      active: false,
    },
  ]);

  const handleConfirm = (checked) => {
    if (checked) {
    }
  };
  return (
    <div className="">
      <h1>Chọn các chương đã dạy</h1>

      <div className="flex flex-col">
        {dataSubject.map((item, index) => (
          <Space style={{ margin: "5px" }}>
            <button
              className={`p-2 rounded-full  hover:bg-purple-200 font-extrabold`}
            >
              <AiFillCaretRight />
            </button>
            <Popconfirm
              title="Xác nhận đã dạy ? "
              description="Bạn xác nhận hôm nay đã dạy chương này chứ ?"
              // onConfirm={confirm}
              // onCancel={cancel}
              okText="Đã dạy"
              cancelText="Hủy"
            >
              <Checkbox
                defaultChecked={item.active && true}
                className={`${
                  item.active ? " text-green-600" : "text-gray-900"
                } font-semibold`}
              >
                {item.tenChuong}
              </Checkbox>
            </Popconfirm>
          </Space>
        ))}
      </div>
    </div>
  );
};

const ModalLeave = ({ data }) => {
  return (
    <div className="my-4">
      <div className="bg-gradient-to-r to-red-600 p-2 rounded-md text-white font-bold from-purple-800 relative ">
        Bạn xác nhận tuần này 
        {data?.isActive == true ? "không dạy" : " dạy lại"}{" "}
        <Tag className="font-bold whitespace-nowrap text-md text-purple-600 bg-white px-3 py-1">
          {data?.subject}
        </Tag>{" "}
        nhóm{" "}
        <Tag className="font-bold bg-white text-purple-500 px-3 ">
          {data?.nhom}
        </Tag>
        , thứ{" "}
        <Tag className="font-bold bg-white text-purple-500 px-3 ">
          {data?.thuMonHoc}
        </Tag>
        , tiết{" "}
        <Tag className="font-bold bg-white text-purple-500 px-3 ">
          {data?.tietBatDau}
        </Tag>
        chứ ?{" "}
        <img
          src={fire}
          className="-top-4 right-0 absolute object-cover"
          alt=""
        />
      </div>

      {data?.isActive == true ? (
        <button className="my-4 font-semibold text-lg px-6 py-2 rounded-full bg-cyan-100 text-blue-700 duration-300 hover:bg-cyan-600 hover:text-white border-2 border-gray-900">
          Xác nhận
        </button>
      ) : (
        <button className="my-4 font-semibold text-lg px-6 py-2 rounded-full bg-red-100 text-red-700 duration-300 hover:bg-red-600 hover:text-white border-2 border-gray-900">
          Dạy lại
        </button>
      )}
    </div>
  );
};

export default SchedulesTeacher;
