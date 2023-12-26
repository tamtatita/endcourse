import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import request from "../../utils/request";
import { useParams } from "react-router-dom";
import { Button, Empty, Table } from "antd";
import useColumnSearch from "../../hooks/useColumnSearch";
import PageTitleSmall from "../global/PageTitleSmall";
import EmptyComponent from "../global/EmptyComponent";
import { AiOutlineCloudDownload, AiOutlineCloudUpload } from "react-icons/ai";
const ListStudents = () => {
  const [data, setData] = useState([]);
  const [getAllData, setGetAllData] = useState([]);

  const { classCode } = useParams();

  const [active, setActive] = useState(false);

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

  const url =
    "https://firebasestorage.googleapis.com/v0/b/khoaluan-3f245.appspot.com/o/local%2FD%E1%BB%AE%20LI%E1%BB%86U%20IMPORT%20C%C3%81C%20L%E1%BB%9AP%20H%E1%BB%8CC%20PH%E1%BA%A6N.xlsx?alt=media&token=da830bec-9cfd-4c91-bf2b-2b292ebb4d16";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "IMPORT DỮ LIỆU CÁC LỚP HỌC PHẦN";
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    handleSubmitForm();
  }, [active]);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        console.log(classCode, "=d");
        const res = await request.get(`studentlist/getall/${classCode}`);
        console.log(res);
        setGetAllData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);

  const handleSubmitForm = async () => {
    try {
      for (let row of data) {
        const dataSubmit = {
          subjectgroupID: classCode,
          studentlistMSSV: row["Mã số sinh viên"],
          studentlistMiddleName: row["Họ lót"],
          studentlistName: row["Tên"],
          studentlistDesc: row["Chú thích lớp"],
          studentlistClassCode: row["Mã lớp"],
        };
        console.log(dataSubmit.studentlistClassCode, "====");
        const res = await request.post("studentlist/add", dataSubmit);
        console.log(res);
      }
    } catch (error) {}
  };

  const [getColumnSearchProps] = useColumnSearch();
  console.log(data);

  const columns = [
    {
      title: "Số thứ tự",
      render: (_, __, index) => {
        return <>{index + 1}</>;
      },
    },
    {
      key: "studentlistMSSV",
      dataIndex: "studentlistMSSV",
      title: "MSSV",
      ...getColumnSearchProps("MSSV"),
    },
    {
      key: "studentlistMiddleName",
      dataIndex: "studentlistMiddleName",
      title: "Họ lót",
      ...getColumnSearchProps("studentlistMiddleName"),
    },
    {
      key: "studentlistName",
      dataIndex: "studentlistName",
      title: "Tên",
      ...getColumnSearchProps("studentlistName"),
    },
    {
      key: "studentlistClassCode",
      dataIndex: "studentlistClassCode",
      title: "Mã lớp",
      ...getColumnSearchProps("studentlistClassCode"),
    },
    {
      key: "studentlistDesc",
      dataIndex: "studentlistDesc",
      title: "Chú thích",
      ...getColumnSearchProps("studentlistDesc"),
    },
  ];

  // console.log(data);
  return (
    <div>
      {getAllData && getAllData.length > 0 ? (
        <>
          <PageTitleSmall title="danh sách sinh viên" />
          <Table columns={columns} dataSource={getAllData} />
        </>
      ) : (
        <div className="">
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />

            <button
              className="ICON bg-yellow-400 text-black"
              onClick={handleDownload}
            >
              <AiOutlineCloudDownload />
              Tải Xuống
            </button>

            <button
              className="ICON bg-cyan-500 text-white"
              onClick={() => setActive(true)}
            >
              <AiOutlineCloudUpload />
              Import
            </button>
          </div>

          <EmptyComponent />

          {data.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, index) => (
                      <td key={index}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ListStudents;
