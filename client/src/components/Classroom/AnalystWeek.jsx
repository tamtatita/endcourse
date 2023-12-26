import { Select } from "antd";
import React from "react";
import Title from "../Home/Title";

const AnalystWeek = () => {
  const data = [
    {
      id: 1,
      week: 1,
      children: [
        {
          day: 2,
          data: [
            {
              id: 1,
              subjectName: "Cơ sở dữ liệu",
              count: 3,
              start: 2,
              status: "Kế hoạch",
            },
            {
              id: 1,
              subjectName: "Cơ sở dữ liệu phân tán",
              count: 2,
              start: 6,
              status: "Xin nghỉ",
            },
            {
              id: 1,
              subjectName: "Cơ sở dữ liệu",
              count: 3,
              start: 2,
              status: "Đã dạy",
            },
            {
              id: 1,
              subjectName: "Cơ sở dữ liệu",
              count: 3,
              start: 2,
              status: "Kế hoạch",
            },
          ],
        },

        {
            day: 3,
            data: [
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 3,
                start: 2,
                status: "Kế hoạch",
              },
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 2,
                start: 6,
                status: "Xin nghỉ",
              },
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 3,
                start: 2,
                status: "Đã dạy",
              },
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 3,
                start: 2,
                status: "Kế hoạch",
              },
            ],
          },

          {
            day: 4,
            data: [
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 3,
                start: 2,
                status: "Kế hoạch",
              },
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 2,
                start: 6,
                status: "Xin nghỉ",
              },
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 3,
                start: 2,
                status: "Đã dạy",
              },
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 3,
                start: 2,
                status: "Kế hoạch",
              },
            ],
          },

          {
            day: 5,
            data: [
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 3,
                start: 2,
                status: "Kế hoạch",
              },
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 2,
                start: 6,
                status: "Xin nghỉ",
              },
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 3,
                start: 2,
                status: "Đã dạy",
              },
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 3,
                start: 2,
                status: "Kế hoạch",
              },
            ],
          },

          {
            day: 6,
            data: [
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 3,
                start: 2,
                status: "Kế hoạch",
              },
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 2,
                start: 6,
                status: "Xin nghỉ",
              },
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 3,
                start: 2,
                status: "Đã dạy",
              },
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 3,
                start: 2,
                status: "Kế hoạch",
              },
            ],
          },

          {
            day: 7,
            data: [
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 3,
                start: 2,
                status: "Kế hoạch",
              },
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 2,
                start: 6,
                status: "Xin nghỉ",
              },
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 3,
                start: 2,
                status: "Đã dạy",
              },
              {
                id: 1,
                subjectName: "Cơ sở dữ liệu",
                count: 3,
                start: 2,
                status: "Kế hoạch",
              },
            ],
          },
      ],
    },
  ];

  return (
    <div>
      <Title title={`Thống kê trạng thái theo tuần dạy`} />
      <div className="">
        <Select
          defaultValue="1"
          options={[
            {
              value: "1",
              label: "1",
            },
          ]}
        />
      </div>
      <div className="">
        {data.map((item) => (
          <div className="">
            <h1>Tuần {item.week}</h1>
            <div className="flex">
              {item.children
                .sort((a, b) => a.day - b.day)
                .map((index) => (
                  <div className="flex w-[15%]">
                    <div className="flex flex-col border-r-2 border-gray-300 w-full mx-1 ">
                      <h1 className='font-semibold text-lg'>Thứ {index.day}</h1>
                      <div className="">
                        {index.data.map((classGroup) => (
                            <div className={`flex flex-col p-2 my-3 ${classGroup.status == 'Kế hoạch' ? 'bg-gray-100' : classGroup.status == 'Xin nghỉ' ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}>
                                <h1 className='font-sans font-medium'>{classGroup.subjectName}</h1>

                                <span>Tiết {classGroup.start}, Nhóm {classGroup.count}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalystWeek;
