import { Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import doc from "../../assets/doc.png";
import pdf from "../../assets/pdf.png";
import xlsx from "../../assets/xlsx.png";
import ppt from "../../assets/ppt.png";
import useColumnSearch from "../../hooks/useColumnSearch";
import request from "../../utils/request";
import { useSelector } from "react-redux";
import FromNow from "../global/FromNow";
import moment from "moment-timezone";

const UnreadDocuments = () => {
  const [dataDocument, setDataDocument] = useState([]);
  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAPI = async () => {
      const dataSubmit = {
        role: currentUser[0].role,
        userID: currentUser[0].teacherID || currentUser[0].memberID,
      };
      const res = await request.post("document/getall", dataSubmit);
      console.log(res);
      setDataDocument(res.data);
    };
    fetchAPI();
  }, []);

  console.log(dataDocument, "document");

  const [getColumnSearchProps] = useColumnSearch();
  const columns = [
    {
      title: "Mã môn",
      dataIndex: "IDSubject",
      key: "IDSubject",
      ...getColumnSearchProps("IDSubject"),
    },
    {
      title: "Tên môn học",
      dataIndex: "subjectName",
      key: "subjectName",
      ...getColumnSearchProps("subjectName"),
    },
    {
      title: "Tên bài giảng",
      dataIndex: "documentName",
      key: "documentName",
      ...getColumnSearchProps("documentName"),
    },

    {
      title: "Ngày tạo ",
      dataIndex: "documentDayCreate",
      key: "documentDayCreate",
      ...getColumnSearchProps("documentDayCreate"),
      render: (documentDayCreate) => {
        return (
          <Tag color="#990000">
            {moment(documentDayCreate).format("DD-MM-YYYY HH:mm:ss")}
          </Tag>
        );
      },
    },
  ];

  return (
    <div>
      <Table dataSource={dataDocument} columns={columns} />
    </div>
  );
};

export default UnreadDocuments;
