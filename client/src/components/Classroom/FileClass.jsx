import React, { useEffect, useState } from "react";
import PageTitleSmall from "../global/PageTitleSmall";
import ppt_big from "../../assets/ppt_big.png";
import doc_big from "../../assets/doc_big.png";
import xlsx_big from "../../assets/xlsx_big.png";
import pdf_big from "../../assets/pdf_big.png";
import { Tag } from "antd";
import { useParams } from "react-router-dom";
import request from "../../utils/request";
import { TimeMysql } from "../../utils/Common";

const FileClass = () => {
  const { classCode } = useParams();
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchAPI = async () => {
      const dataSubmit = { subjectGroupID: classCode };
      try {
        const res = await request.post("document/getall", dataSubmit);
        console.log(res);
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);
  return (
    <div>
      <PageTitleSmall title="Kho lưu trữ tài liệu, bài giảng của lớp" />

      <div className="">
        <BoxFile data={data} />
      </div>
    </div>
  );
};

const BoxFile = ({ data }) => {
  console.log("data box", data);
  return (
    <div className="flex w-full flex-wrap gap-6 ">
      {data &&
        data.length > 0 &&
        data?.map((item) => (
          <div className="h-[200px] w-[200px] border-[1px] border-gray-300 shadow-lg shadow-gray-400 my-4 p-3 justify-between flex flex-col">
            <div className="flex items-center justify-center my-2">
              <a href={item.documentLink}>
                {!item.documentName.includes("https://www.youtube.com") ? (
                  item.documentName.includes("doc") ? (
                    <img src={doc_big} alt="" />
                  ) : item.documentName.includes("xlsx") ? (
                    <img src={xlsx_big} alt="" />
                  ) : item.documentName.includes("pptx") ? (
                    <img src={ppt_big} alt="" />
                  ) : item.documentName.includes("pdf") ? (
                    <img src={pdf_big} alt="" />
                  ) : (
                    // Xử lý khi định dạng không được nhận dạng
                    <div>Định dạng không được hỗ trợ</div>
                  )
                ) : null}
              </a>
            </div>

            <div className="flex flex-col">
              <div className="">
                <h1 className="font-semibold text-sm ">{item.documentName}</h1>
              </div>

              <Tag className="font-bold" color="red">
                {TimeMysql(item.documentDayCreate)}
              </Tag>
            </div>
          </div>
        ))}
    </div>
  );
};
export default FileClass;
