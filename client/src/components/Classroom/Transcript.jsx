import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Tag,
  Typography,
} from "antd";
import Title from "../Home/Title";
import PageTitleSmall from "../global/PageTitleSmall";

import request from "../../utils/request";
import { useParams } from "react-router-dom";
import useColumnSearch from "../../hooks/useColumnSearch";
import { AiFillEdit } from "react-icons/ai";
import { BiBlock } from "react-icons/bi";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const Transcript = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.studentlistID === editingKey;

  const { classCode } = useParams();
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const res = await request.get(`studentlist/getall/${classCode}`);
        console.log(res);
        setData(res.data);
      } catch (error) {}
    };
    fetchAPI();
  }, []);

  const [getColumnSearchProps] = useColumnSearch();

  const edit = (record) => {
    form.setFieldsValue({
      studentlistScore10: "",
      studentlistScore40: "",
      // studentlistTotalScore: "",
      ...record,
    });
    console.log(record, "record");
    setEditingKey(record.studentlistID);
  };

  console.log(editingKey, "edit");
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.studentlistID);
      console.log("index: ", index);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "STT",
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
      key: "studentlistScore10",
      dataIndex: "studentlistScore10",
      title: "Điểm 10%",
      editable: true,
      ...getColumnSearchProps("studentlistScore10"),
    },

    {
      key: "studentlistScore40",
      dataIndex: "studentlistScore40",
      title: "Điểm 40%",
      editable: true,
      ...getColumnSearchProps("studentlistScore40"),
    },

    {
      key: "studentlistTotalScore",
      dataIndex: "studentlistTotalScore",
      title: "Điểm 50%",
      ...getColumnSearchProps("studentlistTotalScore"),
      render: (text, record) => {
        // Lấy giá trị từ các cột studentlistScore10 và studentlistScore40 của record hiện tại
        const score10 = record.studentlistScore10;
        const score40 = record.studentlistScore40;

        // Tính toán tổng điểm theo công thức và gán vào cột studentlistTotalScore
        const totalScore = (score10 * 0.1 + score40 * 0.4) * 2;

        return totalScore.toFixed(2);
      },
    },
    {
      title: "Action",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Tag
              color="blue-inverse"
              onClick={() => save(record.studentlistID)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Tag>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div className="flex gap-3 items-center">
            <button
              className="p-2 rounded-sm bg-yellow-400 text-white "
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <AiFillEdit />
            </button>

            <button
              className="p-2 rounded-sm bg-red-600 text-white "
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <BiBlock />
            </button>
          </div>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "studentlistScore10" ||
          col.dataIndex === "studentlistScore40"
            ? "number"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <>
      <PageTitleSmall title={"bảng điểm"} />

      <div className="my-4">
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
      </div>
    </>
  );
};
export default Transcript;
