import React from "react";

function Test() {
  const data = [
    {
      id: 1,
      tenMonHoc: "Mỹ thuật ứng dụng",
      children: [
        { thu: 2, tietBatDau: 4, soTiet: 2 },
        { thu: 4, tietBatDau: 4, soTiet: 2 },
      ],
      nhomMonHoc: 1,
      maMonHoc: 323254,
      phong: "C120",
      thoiGianHoc: "123456789012345",
      maLop: "DKP1201",
    },
    {
      id: 2,
      tenMonHoc: "Quản lý dự án phần mềm",
      children: [
        { thu: 3, tietBatDau: 1, soTiet: 3 },
        { thu: 3, tietBatDau: 4, soTiet: 2 },
      ],
      nhomMonHoc: 11,
      maMonHoc: 323254,
      phong: "C120",
      thoiGianHoc: "123456789012345",
      maLop: "DKP1201",
    },

    {
      id: 3,
      tenMonHoc: "Công nghệ phần mềm",
      children: [
        { thu: 4, tietBatDau: 1, soTiet: 3 },
        { thu: 4, tietBatDau: 9, soTiet: 2 },
      ],
      nhomMonHoc: 11,
      maMonHoc: 323254,
      phong: "C120",
      thoiGianHoc: "123456789012345",
      maLop: "DKP1201",
    },

    {
      id: 4,
      tenMonHoc: "Tư tưởng Hồ Chí Minh",
      children: [{ thu: 5, tietBatDau: 4, soTiet: 2 }],
      nhomMonHoc: 11,
      maMonHoc: 323254,
      phong: "C120",
      thoiGianHoc: "123456789012345",
      maLop: "DKP1201",
    },
    {
      id: 5,
      tenMonHoc: "Lịch sử đảng Hồ Chí Minh",
      children: [{ thu: 5, tietBatDau: 6, soTiet: 2 }],
      nhomMonHoc: 11,
      maMonHoc: 323254,
      phong: "C120",
      thoiGianHoc: "123456789012345",
      maLop: "DKP1201",
    },
    {
      id: 6,
      tenMonHoc: "Lập trình hướng đối tượng",
      children: [
        { thu: 4, tietBatDau: 6, soTiet: 3 },
        { thu: 6, tietBatDau: 6, soTiet: 2 },
      ],
      nhomMonHoc: 11,
      maMonHoc: 323254,
      phong: "C120",
      thoiGianHoc: "123456789012345",
      maLop: "DKP1201",
    },

    {
      id: 7,
      tenMonHoc: "Cơ sở dữ liệu",
      children: [
        { thu: 7, tietBatDau: 1, soTiet: 3 },
        { thu: 7, tietBatDau: 4, soTiet: 2 },
      ],
      nhomMonHoc: 11,
      maMonHoc: 323254,
      phong: "C120",
      thoiGianHoc: "123456789012345",
      maLop: "DKP1201",
    },
  ];

  const datas = [
    {
      teachingStatusWeek: 1,
      dataClass: [
        {
          subjectGroupID: 1,
          subjectGroupDay: 2,
          subjectGroupStart: 2,
          subjectGroupCount: 3,
        },
        {
          subjectGroupID: 2,
          subjectGroupDay: 2,
          subjectGroupStart: 6,
          subjectGroupCount: 3,
        },
        {
          subjectGroupID: 1,
          subjectGroupDay: 3,
          subjectGroupStart: 2,
          subjectGroupCount: 3,
        },
      ],
    },
    {
      teachingStatusWeek: 1,
      dataClass: [
        {
          subjectGroupID: 1,
          subjectGroupDay: 2,
          subjectGroupStart: 2,
          subjectGroupCount: 3,
        },
        {
          subjectGroupID: 2,
          subjectGroupDay: 2,
          subjectGroupStart: 6,
          subjectGroupCount: 3,
        },
        {
          subjectGroupID: 1,
          subjectGroupDay: 3,
          subjectGroupStart: 2,
          subjectGroupCount: 3,
        },
      ],
    },
  ];
  // create an array to store the schedule
  const schedule = Array.from({ length: 11 }, () => Array(7).fill(null));

  // populate the schedule array with data
  data.forEach((course) => {
    course.children.forEach((time) => {
      for (
        let i = time.tietBatDau - 1;
        i < time.tietBatDau + time.soTiet - 1;
        i++
      ) {
        schedule[i][time.thu - 2] = course;
      }
    });
  });
  // Render the schedule to the table
  return (
    <table>
      <thead>
        <tr>
          <th>Section</th>
          <th>Monday</th>
          <th>Tuesday</th>
          <th>Wednesday</th>
          <th>Thursday</th>
          <th>Friday</th>
          <th>Saturday</th>
          <th>Sunday</th>
        </tr>
      </thead>
      <tbody>
        {schedule.map((row, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            {row.map((cell, j) => {
              // if the cell has the same course as the previous cell in the same column, don't render it
              //   if (
              //     j > 0 &&
              //     cell
              //     // schedule[i - 1][j]
              //     // cell.maMonHoc === schedule[i - 1][j].maMonHoc
              //   ) {
              //     return null;
              //   }

              // count the number of continuous sections with the same course
              let rowspan = 1;
              while (
                i + rowspan < 11 &&
                cell &&
                schedule[i + rowspan][j] &&
                cell.maMonHoc === schedule[i + rowspan][j].maMonHoc
              ) {
                rowspan++;
              }

              return cell ? (
                <td key={j} rowSpan={rowspan}>
                  {cell.tenMonHoc}
                </td>
              ) : (
                <td key={j} />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Test;
