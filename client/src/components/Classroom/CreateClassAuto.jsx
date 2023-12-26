import React, { useState, useEffect } from "react";
import { dataHeaderTable } from "../../constants";
import { Button, message, Modal, Popconfirm, Steps, Table } from "antd";
import * as XLSX from "xlsx";
import {
  AiFillSave,
  AiOutlineCloudDownload,
  AiOutlineDelete,
} from "react-icons/ai";
import { useAuth } from "../../contexts/AuthContext";
import request from "../../utils/request";
import Result from "../global/Result";
import { useSelector } from "react-redux";
const CreateClassAuto = () => {
  const [result, setResult] = useState(false);
  const [submitForm, setSubmitForm] = useState(false);
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX?.utils.sheet_to_json(sheet);
      setData(parsedData);
    };
  };

  const confirm = (e) => {
    console.log(e);
    message.success("Click on Yes");
  };

  const currentUser = useSelector((state) => state.user);

  const handleClear = () => {
    setData(null);
  };

  const handleSuccess = () => {
    setData(null);
  };

  const handleCloseModal = () => {
    setResult(false);
  };

  const columns = [
    {
      title: "STT",
      render: (item, record, index) => <>{index + 1}</>,
    },
    { key: "Mã MH", dataIndex: "Mã MH", title: "Mã MH" },
    { key: "Tên MH", dataIndex: "Tên MH", title: "Tên MH" },
    { key: "Nhóm", dataIndex: "Nhóm", title: "Nhóm" },
    { key: "Số tín chỉ", dataIndex: "Số tín chỉ", title: "Số tín chỉ" },
    { key: "Lớp", dataIndex: "Lớp", title: "Lớp" },
    { key: "Thực hành", dataIndex: "Thực hành", title: "Thực hành" },
    { key: "Thứ", dataIndex: "Thứ", title: "Thứ" },
    { key: "Tiết bắt đầu", dataIndex: "Tiết bắt đầu", title: "Tiết bắt đầu" },
    { key: "Số tiết", dataIndex: "Số tiết", title: "Số tiết" },
    { key: "Phòng", dataIndex: "Phòng", title: "Phòng" },
    {
      key: "Thời gian học",
      dataIndex: "Thời gian học",
      title: "Thời gian học",
    },
    { key: "Học kì", dataIndex: "Học kì", title: "Học kì" },
    { key: "Năm học", dataIndex: "Năm học", title: "Năm học" },
  ];

  useEffect(() => {
    handleSubmit();
  }, [submitForm]);
  const handleSubmit = async () => {
    if (data.length > 0) {
      for (const row of data) {
        const dataObject = {
          teacherID: currentUser[0].teacherID,
          IDSubject: row["Mã MH"],
          subjectName: row["Tên MH"],
          subjectID: row["Mã MH"],
          subjectgroupDay: row["Thứ"],
          subjectgroupStart: row["Tiết bắt đầu"],
          subjectgroupCount: row["Số tiết"],
          subjectgroupPractice: row["Thực hành"],
          subjectgroupSemester: row["Học kì"],
          subjectgroupNameGroup: row["Nhóm"],
          subjectgroupClassName: row["Phòng"],
          subjectgroupSchoolYear: row["Năm học"],
          subjectgroupCredit: row["Số tín chỉ"],
          subjectgroupClass: row["Lớp"],
          subjectGroupWeeks: row["Thời gian học"],
        };

        // console.log(dataObject);
        try {
          const res = await request.post("/subjectgroup/add", dataObject);
          console.log(res, "data", dataObject.subjectGroupWeeks);
          res.data.status === 100
            ? message.success("Đã tạo vào 1 môn học thành công")
            : res.data.status === 200
            ? message.success("Đã tạo 1 lớp thành công")
            : res.data.status === 300
            ? message.success("Đã tạo xong hết tất cả các lớp")
            : res.data.status === 101
            ? message.error("Lỗi khi thêm 1 môn học")
            : res.data.status === 500
            ? message.error("Lỗi khi thêm 1 lớp")
            : message.success("Thêm lớp thành công ");

          setTimeout(() => {
            setResult(true);
          }, [2000]);
        } catch (error) {
          message.error("Đã có lỗi xảy ra");
        }
      }
    } else {
      console.log("không có dữ liệu");
    }
  };

  return (
    <div>
      <h1 className="mb-2 inline-block px-3 py-1 rounded-sm font-semibold text-purple-500 bg-purple-100 ">
        Quy trình thực hiện tạo các lớp tự động :
      </h1>

      <StepComponent />

      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={() => handleClear()}
          className="px-4 py-2 my-2 justify-end bg-red-600 hover:bg-red-400 text-white font-semibold text-xl rounded-sm flex items-center gap-3"
        >
          <AiOutlineDelete />
          Xóa file
        </button>

        <button
          onClick={() => handleClear()}
          className="px-4 py-2 my-2 justify-end bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold text-xl rounded-sm flex items-center gap-3"
        >
          <AiOutlineCloudDownload />
          Download mẫu file
        </button>
      </div>

      <div class="mb-3">
        <label
          for="formFile"
          class="mb-2 inline-block px-3 py-1 rounded-sm font-semibold text-purple-500 bg-purple-100 "
        >
          Chọn mẫu file Excel, điền các thông tin và Import vào đây
        </label>
        <input
          class="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-blue-300 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-400 dark:file:bg-neutral-700 dark:file:text-white dark:focus:border-primary"
          type="file"
          id="formFile"
          accept="xlsx"
          onChange={handleFileUpload}
        />
      </div>

      <div className="">
        {result == false ? (
          <div className="relative overflow-x-auto">
            <Table dataSource={data?.length > 0 && data} columns={columns} />

            {/* {data.length > 0 && ( */}

            <button
              onClick={() => setSubmitForm(true)}
              className="px-6 py-2 my-4 justify-end bg-blue-600 hover:bg-blue-400 text-white font-semibold text-xl rounded-sm flex items-center gap-3"
            >
              <AiFillSave />
              Lưu
            </button>
          </div>
        ) : (
          <Result
            type="success"
            title="Thành công"
            desc="Từ dữ liệu Excel trên, bạn đã import thành công các lớp học. Bạn có muốn chuyển hướng qua Phòng học không nào? "
          />
        )}
      </div>
    </div>
  );
};

const StepComponent = () => {
  return (
    <div className="flex w-full items-center justify-center my-5 ">
      <ol className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
        <li className="flex items-center text-blue-600 dark:text-blue-500 space-x-2.5">
          <span className="flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
            1
          </span>
          <span>
            <h3 className="font-medium leading-tight">Tải mẫu Excel</h3>
            <p className="text-sm">Download mẫu Excel ở dưới đây</p>
          </span>
        </li>
        <li className="flex items-center text-blue-500 space-x-2.5">
          <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
            2
          </span>
          <span>
            <h3 className="font-medium leading-tight">
              Điền các thông tin lớp học
            </h3>
            <p className="text-sm">
              Điền toàn bộ thông tin lớp học được mở trong học kì
            </p>
          </span>
        </li>
        <li className="flex items-center text-blue-500 space-x-2.5">
          <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
            3
          </span>
          <span>
            <h3 className="font-medium leading-tight">Import lên đây</h3>
            <p className="text-sm">Đẩy file Excel lên đây để tự động hóa</p>
          </span>
        </li>
      </ol>
    </div>
  );
};

export default CreateClassAuto;
