import React, { useEffect, useState } from "react";
import Title from "../Home/Title";
import PointChart from "../Chart/PointChart";
import PercentChart from "../Chart/PercentChart";
import { Empty } from "antd";
import ColumnDoubleChart from "../Chart/ColumnDoubleChart";

const GroupStatistics = () => {
  const [data, setData] = useState([
    {
      STT: "1",
      MSSV: "3121410001",
      "Họ lót": "Võ Hoàng Thanh",
      Tên: "An",
      "Mã lớp": "DCT1212",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 2",
      Điểm: "8.74",
    },
    {
      STT: "2",
      MSSV: "3121410056",
      "Họ lót": "Nguyễn Trung",
      Tên: "Anh",
      "Mã lớp": "DCT1215",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 5",
      Điểm: "3.41",
    },
    {
      STT: "3",
      MSSV: "3121410002",
      "Họ lót": "Dương Quốc",
      Tên: "Ân",
      "Mã lớp": "DCT1213",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 3",
      Điểm: "7.92",
    },
    {
      STT: "4",
      MSSV: "3121410063",
      "Họ lót": "Nguyễn Thiên",
      Tên: "Ân",
      "Mã lớp": "DCT1213",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 3",
      Điểm: "6",
    },
    {
      STT: "5",
      MSSV: "3121410078",
      "Họ lót": "Phan Chí",
      Tên: "Bảo",
      "Mã lớp": "DCT1218",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 8",
      Điểm: "9.12",
    },
    {
      STT: "6",
      MSSV: "3121410079",
      "Họ lót": "Tiết Gia",
      Tên: "Bảo",
      "Mã lớp": "DCT1219",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 9",
      Điểm: "2.63",
    },
    {
      STT: "7",
      MSSV: "3120480016",
      "Họ lót": "Lại Vĩnh",
      Tên: "Bình",
      "Mã lớp": "DTU1201",
      "Chú thích": "Đại học chính quy - ngành Toán ứng dụng - K.20 - Lớp 1",
      Điểm: "8.4",
    },
    {
      STT: "8",
      MSSV: "3121410090",
      "Họ lót": "Nguyễn Trọng",
      Tên: "Chiến",
      "Mã lớp": "DCT1211",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 1",
      Điểm: "8.68",
    },
    {
      STT: "9",
      MSSV: "3121410096",
      "Họ lót": "Lê Gia",
      Tên: "Cường",
      "Mã lớp": "DCT1217",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 7",
      Điểm: "4.14",
    },
    {
      STT: "10",
      MSSV: "3121410097",
      "Họ lót": "Nguyễn Kế",
      Tên: "Cường",
      "Mã lớp": "DCT1218",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 8",
      Điểm: "2.76",
    },
    {
      STT: "11",
      MSSV: "3121410112",
      "Họ lót": "Nguyễn Trí",
      Tên: "Dũng",
      "Mã lớp": "DCT1212",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 2",
      Điểm: "5.41",
    },
    {
      STT: "12",
      MSSV: "3121410118",
      "Họ lót": "Nguyễn Đình Hoan",
      Tên: "Duy",
      "Mã lớp": "DCT1218",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 8",
      Điểm: "7.02",
    },
    {
      STT: "13",
      MSSV: "3121410120",
      "Họ lót": "Nguyễn Lê Bảo",
      Tên: "Duy",
      "Mã lớp": "DCT1211",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 1",
      Điểm: "5.72",
    },
    {
      STT: "14",
      MSSV: "3121410127",
      "Họ lót": "Nguyễn Thùy",
      Tên: "Duyên",
      "Mã lớp": "DCT1218",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 8",
      Điểm: "5.28",
    },
    {
      STT: "15",
      MSSV: "3119410078",
      "Họ lót": "Trần Đại",
      Tên: "Dương",
      "Mã lớp": "DCT1194",
      "Chú thích":
        "Đại học chính quy - ngành Công nghệ thông tin - K.19 - Lớp 4",
      Điểm: "3.41",
    },
    {
      STT: "16",
      MSSV: "3121410134",
      "Họ lót": "Lâm Quốc",
      Tên: "Đại",
      "Mã lớp": "DCT1216",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 6",
      Điểm: "5.18",
    },
    {
      STT: "17",
      MSSV: "3121410137",
      "Họ lót": "Nguyễn Đào Linh",
      Tên: "Đan",
      "Mã lớp": "DCT1219",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 9",
      Điểm: "4.47",
    },
    {
      STT: "18",
      MSSV: "3121410144",
      "Họ lót": "Ngô Tấn",
      Tên: "Đạt",
      "Mã lớp": "DCT1216",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 6",
      Điểm: "4.07",
    },
    {
      STT: "19",
      MSSV: "3120410135",
      "Họ lót": "Cao Minh",
      Tên: "Đức",
      "Mã lớp": "DCT1205",
      "Chú thích":
        "Đại học chính quy - ngành Công nghệ thông tin - K.20 - Lớp 5",
      Điểm: "7.04",
    },
    {
      STT: "20",
      MSSV: "3121410171",
      "Họ lót": "Phùng Văn",
      Tên: "Hà",
      "Mã lớp": "DCT1213",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 3",
      Điểm: "9.01",
    },
    {
      STT: "21",
      MSSV: "3120410161",
      "Họ lót": "Trần Trung",
      Tên: "Hậu",
      "Mã lớp": "DCT1207",
      "Chú thích":
        "Đại học chính quy - ngành Công nghệ thông tin - K.20 - Lớp 7",
      Điểm: "8.37",
    },
    {
      STT: "22",
      MSSV: "3121410204",
      "Họ lót": "Nguyễn Tấn",
      Tên: "Hiệu",
      "Mã lớp": "DCT1215",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 5",
      Điểm: "7.8",
    },
    {
      STT: "23",
      MSSV: "3120410180",
      "Họ lót": "Lê Hữu",
      Tên: "Hoàng",
      "Mã lớp": "DCT1201",
      "Chú thích":
        "Đại học chính quy - ngành Công nghệ thông tin - K.20 - Lớp 1",
      Điểm: "7.81",
    },
    {
      STT: "24",
      MSSV: "3121410215",
      "Họ lót": "Võ Đinh Xuân",
      Tên: "Hoàng",
      "Mã lớp": "DCT1216",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 6",
      Điểm: "6.17",
    },
    {
      STT: "25",
      MSSV: "3121560034",
      "Họ lót": "Vương Huy",
      Tên: "Hoàng",
      "Mã lớp": "DKP1211",
      "Chú thích": "ĐH chính quy - ngành Kỹ thuật phần mềm - K.21 - Lớp 1",
      Điểm: "7.49",
    },
    {
      STT: "26",
      MSSV: "3121410233",
      "Họ lót": "Tất Anh",
      Tên: "Huy",
      "Mã lớp": "DCT1212",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 2",
      Điểm: "3.06",
    },
    {
      STT: "27",
      MSSV: "3121560041",
      "Họ lót": "Lê Tiến",
      Tên: "Hữu",
      "Mã lớp": "DKP1212",
      "Chú thích": "ĐH chính quy - ngành Kỹ thuật phần mềm - K.21 - Lớp 2",
      Điểm: "7.42",
    },
    {
      STT: "28",
      MSSV: "3121410007",
      "Họ lót": "Đỗ Minh",
      Tên: "Khang",
      "Mã lớp": "DCT1218",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 8",
      Điểm: "5.91",
    },
    {
      STT: "29",
      MSSV: "3121410252",
      "Họ lót": "Lê Duy",
      Tên: "Khang",
      "Mã lớp": "DCT1211",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 1",
      Điểm: "7.13",
    },
    {
      STT: "30",
      MSSV: "3121410254",
      "Họ lót": "Nguyễn Hoàng",
      Tên: "Khang",
      "Mã lớp": "DCT1213",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 3",
      Điểm: "3.11",
    },
    {
      STT: "31",
      MSSV: "3121410258",
      "Họ lót": "Lê Duy",
      Tên: "Khánh",
      "Mã lớp": "DCT1216",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 6",
      Điểm: "3.69",
    },
    {
      STT: "32",
      MSSV: "3121410299",
      "Họ lót": "Nguyễn Văn",
      Tên: "Long",
      "Mã lớp": "DCT1219",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 9",
      Điểm: "9.75",
    },
    {
      STT: "33",
      MSSV: "3121410307",
      "Họ lót": "Võ Duy",
      Tên: "Luân",
      "Mã lớp": "DCT1217",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 7",
      Điểm: "9.82",
    },
    {
      STT: "34",
      MSSV: "3121410313",
      "Họ lót": "Huỳnh Ngọc Diễm",
      Tên: "Ly",
      "Mã lớp": "DCT1213",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 3",
      Điểm: "7.85",
    },
    {
      STT: "35",
      MSSV: "3119480038",
      "Họ lót": "Nguyễn Hải",
      Tên: "Minh",
      "Mã lớp": "DTU1192",
      "Chú thích": "Đại học chính quy - ngành Toán ứng dụng - K.19 - Lớp 2",
      Điểm: "2.6",
    },
    {
      STT: "36",
      MSSV: "3121410326",
      "Họ lót": "Võ Thị Diễm",
      Tên: "My",
      "Mã lớp": "DCT1217",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 7",
      Điểm: "5.14",
    },
    {
      STT: "37",
      MSSV: "3121410332",
      "Họ lót": "Nguyễn Hoàng Hải",
      Tên: "Nam",
      "Mã lớp": "DCT1213",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 3",
      Điểm: "2.35",
    },
    {
      STT: "38",
      MSSV: "3121410335",
      "Họ lót": "Thân Trọng Hoài",
      Tên: "Nam",
      "Mã lớp": "DCT1216",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 6",
      Điểm: "4.42",
    },
    {
      STT: "39",
      MSSV: "3121410337",
      "Họ lót": "Trần Hoàng",
      Tên: "Nam",
      "Mã lớp": "DCT1218",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 8",
      Điểm: "4.04",
    },
    {
      STT: "40",
      MSSV: "3121410343",
      "Họ lót": "Ngô Nguyễn Mai",
      Tên: "Nghi",
      "Mã lớp": "DCT1214",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 4",
      Điểm: "6.08",
    },
    {
      STT: "41",
      MSSV: "3120410344",
      "Họ lót": "Nguyễn Anh",
      Tên: "Nghĩa",
      "Mã lớp": "DCT1201",
      "Chú thích":
        "Đại học chính quy - ngành Công nghệ thông tin - K.20 - Lớp 1",
      Điểm: "9.26",
    },
    {
      STT: "42",
      MSSV: "3121560061",
      "Họ lót": "Phạm Văn",
      Tên: "Nghĩa",
      "Mã lớp": "DKP1212",
      "Chú thích": "ĐH chính quy - ngành Kỹ thuật phần mềm - K.21 - Lớp 2",
      Điểm: "8.74",
    },
    {
      STT: "43",
      MSSV: "3121410346",
      "Họ lót": "Phạm Bảo",
      Tên: "Nghiêm",
      "Mã lớp": "DCT1217",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 7",
      Điểm: "7.39",
    },
    {
      STT: "44",
      MSSV: "3121410350",
      "Họ lót": "Nguyễn Trung",
      Tên: "Nguyên",
      "Mã lớp": "DCT1211",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 1",
      Điểm: "4.56",
    },
    {
      STT: "45",
      MSSV: "3121410368",
      "Họ lót": "Nguyễn Trần Yến",
      Tên: "Nhi",
      "Mã lớp": "DCT1217",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 7",
      Điểm: "6.66",
    },
    {
      STT: "46",
      MSSV: "3122410282",
      "Họ lót": "Nguyễn Tuyết",
      Tên: "Nhi",
      "Mã lớp": "DCT1223",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.22 - Lớp 3",
      Điểm: "6.73",
    },
    {
      STT: "47",
      MSSV: "3121410370",
      "Họ lót": "Âu Hạo",
      Tên: "Nhiên",
      "Mã lớp": "DCT1219",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 9",
      Điểm: "4.94",
    },
    {
      STT: "48",
      MSSV: "3121410011",
      "Họ lót": "Bùi Lê Bích",
      Tên: "Nhung",
      "Mã lớp": "DCT1213",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 3",
      Điểm: "7.52",
    },
    {
      STT: "49",
      MSSV: "3121410377",
      "Họ lót": "Nguyễn Hoàng",
      Tên: "Phát",
      "Mã lớp": "DCT1216",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 6",
      Điểm: "4.02",
    },
    {
      STT: "50",
      MSSV: "3121410382",
      "Họ lót": "Lương Gia",
      Tên: "Phong",
      "Mã lớp": "DCT1212",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 2",
      Điểm: "8.17",
    },
    {
      STT: "51",
      MSSV: "3121560071",
      "Họ lót": "Trần Kim",
      Tên: "Phú",
      "Mã lớp": "DKP1211",
      "Chú thích": "ĐH chính quy - ngành Kỹ thuật phần mềm - K.21 - Lớp 1",
      Điểm: "5.29",
    },
    {
      STT: "52",
      MSSV: "3121410387",
      "Họ lót": "Trần Trọng",
      Tên: "Phú",
      "Mã lớp": "DCT1217",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 7",
      Điểm: "9.11",
    },
    {
      STT: "53",
      MSSV: "3121410410",
      "Họ lót": "Huỳnh Anh",
      Tên: "Quốc",
      "Mã lớp": "DCT1211",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 1",
      Điểm: "5.5",
    },
    {
      STT: "54",
      MSSV: "3119410344",
      "Họ lót": "Lê Huỳnh Thanh",
      Tên: "Sang",
      "Mã lớp": "DCT1196",
      "Chú thích":
        "Đại học chính quy - ngành Công nghệ thông tin - K.19 - Lớp 6",
      Điểm: "5.49",
    },
    {
      STT: "55",
      MSSV: "3121410431",
      "Họ lót": "Lê Tấn",
      Tên: "Tài",
      "Mã lớp": "DCT1214",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 4",
      Điểm: "5.22",
    },
    {
      STT: "56",
      MSSV: "3120560086",
      "Họ lót": "Lê Văn",
      Tên: "Tâm",
      "Mã lớp": "DKP1201",
      "Chú thích": "Đại học chính quy - ngành Kỹ thuật phần mềm - K.20 - Lớp 1",
      Điểm: "3.18",
    },
    {
      STT: "57",
      MSSV: "3121410444",
      "Họ lót": "Nguyễn Văn",
      Tên: "Tân",
      "Mã lớp": "DCT1216",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 6",
      Điểm: "4.32",
    },
    {
      STT: "58",
      MSSV: "3121410038",
      "Họ lót": "Nguyễn Đức",
      Tên: "Tây",
      "Mã lớp": "DCT1216",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 6",
      Điểm: "4.28",
    },
    {
      STT: "59",
      MSSV: "3121560084",
      "Họ lót": "Nguyễn Văn",
      Tên: "Thành",
      "Mã lớp": "DKP1211",
      "Chú thích": "ĐH chính quy - ngành Kỹ thuật phần mềm - K.21 - Lớp 1",
      Điểm: "2.37",
    },
    {
      STT: "60",
      MSSV: "3120410502",
      "Họ lót": "Nguyễn Đức",
      Tên: "Thịnh",
      "Mã lớp": "DCT1207",
      "Chú thích":
        "Đại học chính quy - ngành Công nghệ thông tin - K.20 - Lớp 7",
      Điểm: "9.13",
    },
    {
      STT: "61",
      MSSV: "3121410480",
      "Họ lót": "Đặng Quốc",
      Tên: "Thuận",
      "Mã lớp": "DCT1212",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 2",
      Điểm: "4.98",
    },
    {
      STT: "62",
      MSSV: "3121410483",
      "Họ lót": "Phạm Dương Ngọc",
      Tên: "Thuận",
      "Mã lớp": "DCT1215",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 5",
      Điểm: "9.46",
    },
    {
      STT: "63",
      MSSV: "3121410488",
      "Họ lót": "Bùi Nguyên Minh",
      Tên: "Thư",
      "Mã lớp": "DCT1219",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 9",
      Điểm: "5.03",
    },
    {
      STT: "64",
      MSSV: "3121410489",
      "Họ lót": "Nguyễn Thị Anh",
      Tên: "Thư",
      "Mã lớp": "DCT1211",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 1",
      Điểm: "7.36",
    },
    {
      STT: "65",
      MSSV: "3121410515",
      "Họ lót": "Đặng Ngọc Đoan",
      Tên: "Trang",
      "Mã lớp": "DCT1217",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 7",
      Điểm: "6.29",
    },
    {
      STT: "66",
      MSSV: "3120410544",
      "Họ lót": "Đậu Thị Thùy",
      Tên: "Trang",
      "Mã lớp": "DCT1205",
      "Chú thích":
        "Đại học chính quy - ngành Công nghệ thông tin - K.20 - Lớp 5",
      Điểm: "4.01",
    },
    {
      STT: "67",
      MSSV: "3121410518",
      "Họ lót": "Võ Hồ Ngọc",
      Tên: "Trâm",
      "Mã lớp": "DCT1211",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 1",
      Điểm: "2.97",
    },
    {
      STT: "68",
      MSSV: "3121410519",
      "Họ lót": "Mai Nguyễn Ngọc",
      Tên: "Trân",
      "Mã lớp": "DCT1212",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 2",
      Điểm: "8.43",
    },
    {
      STT: "69",
      MSSV: "3121410529",
      "Họ lót": "Nguyễn Quốc",
      Tên: "Trọng",
      "Mã lớp": "DCT1212",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 2",
      Điểm: "9.57",
    },
    {
      STT: "70",
      MSSV: "3121410543",
      "Họ lót": "Phạm Hoàng Đan",
      Tên: "Trường",
      "Mã lớp": "DCT1216",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 6",
      Điểm: "4.25",
    },
    {
      STT: "71",
      MSSV: "3121410546",
      "Họ lót": "Dương Thành",
      Tên: "Trưởng",
      "Mã lớp": "DCT1219",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 9",
      Điểm: "7.37",
    },
    {
      STT: "72",
      MSSV: "3119410475",
      "Họ lót": "Lê Anh",
      Tên: "Tú",
      "Mã lớp": "DCT1196",
      "Chú thích":
        "Đại học chính quy - ngành Công nghệ thông tin - K.19 - Lớp 6",
      Điểm: "3.3",
    },
    {
      STT: "73",
      MSSV: "3121410560",
      "Họ lót": "Phạm Hoàng Anh",
      Tên: "Tuấn",
      "Mã lớp": "DCT1215",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 5",
      Điểm: "4.68",
    },
    {
      STT: "74",
      MSSV: "3120410600",
      "Họ lót": "Phùng Tùng",
      Tên: "Uy",
      "Mã lớp": "DCT1202",
      "Chú thích":
        "Đại học chính quy - ngành Công nghệ thông tin - K.20 - Lớp 2",
      Điểm: "2.93",
    },
    {
      STT: "75",
      MSSV: "3121410571",
      "Họ lót": "Võ Đình",
      Tên: "Văn",
      "Mã lớp": "DCT1217",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 7",
      Điểm: "2.18",
    },
    {
      STT: "76",
      MSSV: "3121410575",
      "Họ lót": "Lương Minh",
      Tên: "Thế Vinh",
      "Mã lớp": "DCT1211",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 1",
      Điểm: "9.69",
    },
    {
      STT: "77",
      MSSV: "3121410580",
      "Họ lót": "Nguyễn Thế",
      Tên: "Vũ",
      "Mã lớp": "DCT1216",
      "Chú thích": "ĐH chính quy - ngành Công nghệ thông tin - K.21 - Lớp 6",
      Điểm: "5.95",
    },
    {
      STT: "78",
      MSSV: "3120560107",
      "Họ lót": "Huỳnh Bá",
      Tên: "Vương",
      "Mã lớp": "DKP1201",
      "Chú thích": "Đại học chính quy - ngành Kỹ thuật phần mềm - K.20 - Lớp 1",
      Điểm: "5.79",
    },
    {
      STT: "79",
      MSSV: "3119480109",
      "Họ lót": "Huỳnh Vũ Phương",
      Tên: "Vy",
      "Mã lớp": "DTU1191",
      "Chú thích": "Đại học chính quy - ngành Toán ứng dụng - K.19 - Lớp 1",
      Điểm: "2.52",
    },
    {
      STT: "80",
      MSSV: "3122560092",
      "Họ lót": "Trần Kim",
      Tên: "Yến",
      "Mã lớp": "DKP1222",
      "Chú thích": "ĐH chính quy - ngành Kỹ thuật phần mềm - K.22 - Lớp 2",
      Điểm: "3.18",
    },
  ]);

  const [newData, setNewData] = useState([]);

  useEffect(() => {
    // Tính toán số lượng sinh viên trong từng khoảng điểm
    const scores = data.map((student) => parseFloat(student.Điểm));
    const under2 = scores.filter((score) => score < 2).length;
    const between2And4 = scores.filter(
      (score) => score >= 2 && score < 4
    ).length;
    const between4And6 = scores.filter(
      (score) => score >= 4 && score < 6
    ).length;
    const between6And8 = scores.filter(
      (score) => score >= 6 && score < 8
    ).length;
    const between8And10 = scores.filter(
      (score) => score >= 8 && score <= 10
    ).length;

    // Tính tổng số sinh viên
    const totalStudents = data.length;

    // Tính phần trăm cho mỗi khoảng điểm
    const percentUnder2 = (under2 / totalStudents) * 100;
    const percentBetween2And4 = (between2And4 / totalStudents) * 100;
    const percentBetween4And6 = (between4And6 / totalStudents) * 100;
    const percentBetween6And8 = (between6And8 / totalStudents) * 100;
    const percentBetween8And10 = (between8And10 / totalStudents) * 100;

    setNewData([
      { name: "Dưới 2", percent: percentUnder2, length: under2 },
      {
        name: "Từ 2 đến 4",
        percent: percentBetween2And4,
        length: between2And4,
      },
      {
        name: "Từ 4 đến 6",
        percent: percentBetween4And6,
        length: between4And6,
      },
      {
        name: "Từ 6 đến 8",
        percent: percentBetween6And8,
        length: between6And8,
      },
      {
        name: "Từ 8 đến 10",
        percent: percentBetween8And10,
        length: between8And10,
      },
    ]);
  }, []);

  const thongKeNhomHocTap = [
    { id: 1, name: "Nhóm 1", diemTrungBinh: 2.8, thanhVien: 3 },
    { id: 2, name: "Nhóm 2", diemTrungBinh: 7.8, thanhVien: 3 },
    { id: 3, name: "Nhóm 3", diemTrungBinh: 9.8, thanhVien: 9 },
    { id: 4, name: "Nhóm 4", diemTrungBinh: 3.8, thanhVien: 1 },
    { id: 5, name: "Nhóm 5", diemTrungBinh: 6, thanhVien: 4 },
    { id: 6, name: "Nhóm 6", diemTrungBinh: 10, thanhVien: 6 },
  ];

  console.log(newData);
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="flex items-center gap-2 w-full">
        <div className="w-1/2 border-[1px] border-gray-200 p-3">
          <Title
            desc="Phân theo thang điểm < 2, từ 2 - 4, từ 4 - 6, từ 6 - 8, trên 8"
            title="thống kê phân bố điểm"
          />
          {newData.length > 0 ? (
            <PointChart
              x="name"
              y="length"
              type="score"
              data={newData.length > 0 && newData}
            />
          ) : (
            <Empty title="Chưa có dữ liệu" />
          )}
        </div>

        <div className="w-1/2 border-[1px] border-gray-200 p-3">
          <Title
            desc="Tỉ lệ thang điểm tương ứng với tổng số lượng sinh viên trong 1 lớp"
            title="Tỷ lệ phân bố điểm"
          />
          {newData.length > 0 ? (
            <PercentChart data={newData.length > 0 && newData} />
          ) : (
            <Empty title="Chưa có dữ liệu" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 w-full">
        <div className="w-1/2 border-[1px] border-gray-200 p-3">
          <Title title="thống kê nhóm học tập" desc={'Thống kê điểm trung bình của nhóm và số thành viên hiện hành'} />
          {thongKeNhomHocTap.length > 0 ? (
            <ColumnDoubleChart
              name="name"
              column1={"diemTrungBinh"}
              column2={"thanhVien"}
              data={thongKeNhomHocTap.length > 0 && thongKeNhomHocTap}
            />
          ) : (
            <Empty title="Chưa có dữ liệu" />
          )}
        </div>

        <div className="w-1/2 border-[1px] border-gray-200 p-3">
          <Title title="Tỉ lệ sinh viên click vào bài giảng" />
        </div>
      </div>
    </div>
  );
};

export default GroupStatistics;
