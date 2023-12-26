import React, { useEffect, useState } from "react";

const ScheduleTable = () => {
  const data = [
    {
      tenMon: "công nghệ phần mềm",
      nhomMon: 2,
      maLop: "DKP1201",
      children: [
        { thucHanh: true, thu: 4, tietBatDau: 9, soTiet: 2, maPhong: "C.E503" },
        {
          thucHanh: false,
          thu: 4,
          tietBatDau: 1,
          soTiet: 3,
          maPhong: "C.E301",
        },
      ],
    },

    {
      tenMon: "mỹ thuật ứng dụng trong CNTT",
      nhomMon: 1,
      maLop: "DKP1201",
      children: [
        {
          thucHanh: true,
          thu: 4,
          tietBatDau: 4,
          soTiet: 2,
          maPhong: "C.HB403",
        },
        {
          thucHanh: false,
          thu: 2,
          tietBatDau: 4,
          soTiet: 2,
          maPhong: "C.C101",
        },
      ],
    },

    {
      tenMon: "quản lý dự án phần mềm",
      nhomMon: 4,
      maLop: "DKP1201",
      children: [
        { thucHanh: true, thu: 3, tietBatDau: 4, soTiet: 2, maPhong: "C.E403" },
        {
          thucHanh: false,
          thu: 3,
          tietBatDau: 1,
          soTiet: 3,
          maPhong: "C.E403",
        },
      ],
    },
  ];
  const MAX_THU = 7;
  const MAX_TIET_BAT_DAU = 10;

  const [timeTableData, setTimeTableData] = useState(() => {
    const initialData = [];
    for (let row = 0; row <= MAX_TIET_BAT_DAU; row++) {
      initialData[row] = [];
      for (let col = 0; col <= MAX_THU; col++) {
        initialData[row][col] = [];
      }
    }
    return initialData;
  });

  // Populate the timeTableData array based on the data
  useEffect(() => {
    data.forEach((monHoc) => {
      monHoc.children.forEach((lopHoc) => {
        const { thu, tietBatDau, soTiet, maPhong } = lopHoc;

        for (let tiet = tietBatDau; tiet < tietBatDau + soTiet; tiet++) {
          setTimeTableData((prevData) => {
            const newData = [...prevData];
            newData[tiet][thu] = [...newData[tiet][thu], { monHoc, maPhong }];
            return newData;
          });
        }
      });
    });
  }, []);

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
            {/* <tr>
              <th scope="col" className="px-6 py-3"></th>

              <th scope="col" className="px-6 py-3">
                Thứ 2
              </th>

              <th scope="col" className="px-6 py-3">
                Thứ 3
              </th>

              <th scope="col" className="px-6 py-3">
                Thứ 4
              </th>

              <th scope="col" className="px-6 py-3">
                Thứ 5
              </th>
              <th scope="col" className="px-6 py-3">
                Thứ 6
              </th>
              <th scope="col" className="px-6 py-3">
                Thứ 7
              </th>
            </tr> */}
            <tr>
              <th>Tiết\Ngày</th>
              {new Array(7).fill(null).map((_, index) => (
                <th key={index}>Thứ {index + 2}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* <tr className="bg-white border-b  ">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
              >
                Tiết 1
              </th>
            </tr> */}
            {timeTableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{rowIndex}</td>
                {row.map((cell, colIndex) => (
                  <td key={colIndex}>
                    {cell.map(({ monHoc, maPhong }) => (
                      <div key={maPhong}>
                        {monHoc.tenMon} - {maPhong}
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;
