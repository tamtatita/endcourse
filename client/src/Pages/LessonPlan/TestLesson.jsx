import React, { useState } from "react";
import { Input, InputNumber } from "antd";
import { BiSolidAddToQueue } from "react-icons/bi";
import { BsPlusCircleFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
function TestLesson() {
  const [data, setData] = useState([
    {
      id: 1,
      title: "",
      children: [{ id: 1, subtitle: "", count: 1 }],
    },
  ]);

  const addTitle = () => {
    const newTitle = {
      id: data.length + 1,
      title: "",
      children: [],
    };
    setData([...data, newTitle]);
  };

  const addSubField = (titleId) => {
    const updatedData = data?.map((title) => {
      if (title.id === titleId) {
        const newSub = {
          id: title.children.length + 1,
          subtitle: "",
          count: 0,
        };
        title.children = [...title.children, newSub];
      }
      return title;
    });
    setData(updatedData);
  };

  const handleTitleChange = (titleId, value) => {
    const updatedData = data?.map((title) => {
      if (title.id === titleId) {
        title.title = value;
      }
      return title;
    });
    setData(updatedData);
  };

  const handleSubChange = (titleId, subId, field, value) => {
    const updatedData = data?.map((title) => {
      if (title.id === titleId) {
        title.children = title.children.map((sub) => {
          if (sub.id === subId) {
            sub[field] = value;
          }
          return sub;
        });
      }
      return title;
    });
    setData(updatedData);
  };

  const removeTitle = (titleId) => {
    const updatedData = data?.filter((title) => title.id !== titleId);
    setData(updatedData);
  };

  const removeSubField = (titleId, subId) => {
    const updatedData = data?.map((title) => {
      if (title.id === titleId) {
        title.children = title.children.filter((sub) => sub.id !== subId);
      }
      return title;
    });
    setData(updatedData);
  };

  return (
    <div>
      {data?.map((title) => (
        <div className="flex flex-col gap-3" key={title.id}>
          <div className="flex items-center gap-3 p-3 h-24">
            <div className="">
              <Input
                value={title.title}
                onChange={(e) => handleTitleChange(title.id, e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                className="bg-green-500 text-white  ICON_FULL"
                onClick={() => addSubField(title.id)}
              >
                <BsPlusCircleFill />
              </button>
              <button
                className="bg-red-500  text-white ICON_FULL"
                onClick={() => removeTitle(title.id)}
              >
                <AiFillDelete />
              </button>
            </div>
          </div>
          {title.children.map((sub) => (
            <div key={sub.id} className="flex items-center gap-3">
              <div className="flex items-center gap-3">

              <Input
                value={sub.subtitle}
                onChange={(e) =>
                  handleSubChange(title.id, sub.id, "subtitle", e.target.value)
                }
              />
              <InputNumber
                value={sub.count}
                onChange={(e) =>
                  handleSubChange(title.id, sub.id, "count", e.target.value)
                }
              />
              </div>
              <button
                className="bg-red-100 text-red-500 ICON_FULL"
                onClick={() => removeSubField(title.id, sub.id)}
              >
                <AiFillDelete />
                
              </button>
            </div>
          ))}
        </div>
      ))}

      <button
        className="bg-blue-500 text-white ICON "
        onClick={() => addTitle()}
      >
        <BiSolidAddToQueue />
        Thêm chương mới
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default TestLesson;
