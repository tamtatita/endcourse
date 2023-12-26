import check from "../assets/check.png";
import check_big from "../assets/check_big.png";
import cancelled from "../assets/cancelled.png";
import cancelled_big from "../assets/cancelled_big.png";
import inprogress from "../assets/work-in-progress.png";
import inprogress_big from "../assets/work-in-progress_big.png";
import megaphone from "../assets/megaphone.png";
import megaphone_big from "../assets/megaphone_big.png";
import future from "../assets/future.png";
import future_big from "../assets/future_big.png";

export const dataAddClass = [
  {
    key: "maBaoVe",
    title: "Mã bảo vệ",
    desc: "Yêu cầu học sinh nhập mã bảo vệ mới cho vào lớp học",
    isCheck: false,
  },
  {
    key: "chanHocSinhRoiLop",
    title: "Chặn học sinh tự ý rời lớp",
    desc: "Tính năng này giúp giáo viên quản lý số lượng thành viên trong lớp tốt hơn tránh tình trạng học sinh tự ý thoát khỏi lớp",
    isCheck: false,
  },
  {
    key: "pheDuyet",
    title: "Phê duyệt học sinh",
    desc: "Phê duyệt học sinh tránh tình trạng người lạ vào lớp học mà không có sự cho phép của bạn",
    isCheck: false,
  },
  {
    key: "xemBangDiem",
    title: "Cho phép học sinh xem bảng điểm",
    desc: "Học sinh sẽ được xem bảng điểm của các thành viên trong lớp",
    isCheck: false,
  },
  {
    key: "tatHoatDongBangTin",
    title: "Tắt hoạt động bảng tin",
    desc: "Học sinh không thể đăng bài, bình luận",
    isCheck: false,
  },
  {
    key: "hanCheGiaoVienPhu",
    title: "Hạn chế giáo viên phụ",
    desc: "Giáo viên đồng hành chỉ được phép xem tài nguyên của mình tạo ra trong lớp, bao gồm: Bài tập, bài giảng, tài liệu",
    isCheck: false,
  },
];

export const dataRequireAddClass = [
  { id: 1, name: "Tên môn học", require: true, isActive: false },
  { id: 2, name: "Thứ", require: true, isActive: false },
  { id: 3, name: "Tiết bắt đầu", require: true, isActive: false },
  { id: 4, name: "Số tiết", require: true, isActive: false },
  { id: 5, name: "Nhóm môn học", require: true, isActive: false },
  { id: 6, name: "Tên lớp học", require: true, isActive: false },
];

export const optionThu = [
  { value: 2, label: "Thứ 2" },
  { value: 3, label: "Thứ 3" },
  { value: 4, label: "Thứ 4" },
  { value: 5, label: "Thứ 5" },
  { value: 6, label: "Thứ 6" },
  { value: 7, label: "Thứ 7" },
];

export const optionTietBatDau = [
  { value: 1, label: "Tiết 1" },
  { value: 2, label: "Tiết 2" },
  { value: 3, label: "Tiết 3" },
  { value: 4, label: "Tiết 4" },
  { value: 5, label: "Tiết 5" },
  { value: 6, label: "Tiết 6" },
  { value: 7, label: "Tiết 7" },
  { value: 8, label: "Tiết 8" },
  { value: 9, label: "Tiết 9" },
  { value: 10, label: "Tiết 10" },
  { value: 11, label: "Tiết 11" },
];

export const optionSoTiet = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
];

export const optionHocKi = [
  { value: "HK1", label: "Học kì 1" },
  { value: "HK2", label: "Học kì 2" },
  { value: "HK3", label: "Học kì hè" },
];

export const optionNamHoc = [
  { value: "2023-2024", label: "Năm 2023-2024" },
  { value: "2024-2025", label: "Năm 2024-2025" },
  { value: "2025-2026", label: "Năm 2025-2026" },
];

export const colors = [
  { id: 1, bg: "#e0f2fe", text: "#0ea5e9" }, //xanh biển
  { id: 4, bg: "#fef9c3", text: "#ca8a04" }, // vàng
  { id: 5, bg: "#ffe4e6", text: "#e11d48" }, // rose
  { id: 2, bg: "#fae8ff", text: "#86198f" }, // tím
  { id: 9, bg: "#67e8f9", text: "#042f2e" },
  { id: 3, bg: "#ede9fe", text: "#6d28d9" }, // tím - ??
  { id: 6, bg: "#fed7aa", text: "#ea580c" },
  { id: 7, bg: "#d9f99d", text: "#4d7c0f" },
  { id: 8, bg: "#bbf7d0", text: "#3f6212" },
  { id: 10, bg: "#fde68a", text: "#eab308" },
  { id: 11, bg: "#ddd6fe", text: "#7c3aed" },
  { id: 12, bg: "#bbf7d0", text: "#22c55e" },
];

export const dataSchedules = [
  {
    id: 1,
    tenMonHoc: "Mỹ thuật ứng dụng",
    children: [
      { thu: 2, tietBatDau: 4, soTiet: 2, isActive: false },
      { thu: 4, tietBatDau: 4, soTiet: 2, isActive: false },
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
      { thu: 3, tietBatDau: 1, soTiet: 3, isActive: true },
      { thu: 3, tietBatDau: 4, soTiet: 2, isActive: true },
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
      { thu: 4, tietBatDau: 1, soTiet: 3, isActive: true },
      { thu: 4, tietBatDau: 9, soTiet: 2, isActive: true },
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
    children: [{ thu: 5, tietBatDau: 4, soTiet: 2, isActive: true }],
    nhomMonHoc: 11,
    maMonHoc: 323254,
    phong: "C120",
    thoiGianHoc: "123456789012345",
    maLop: "DKP1201",
  },
  {
    id: 5,
    tenMonHoc: "Lịch sử đảng Hồ Chí Minh",
    children: [{ thu: 5, tietBatDau: 6, soTiet: 2, isActive: true }],
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
      { thu: 4, tietBatDau: 6, soTiet: 3, isActive: true },
      { thu: 6, tietBatDau: 6, soTiet: 2, isActive: true },
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
      { thu: 7, tietBatDau: 1, soTiet: 3, isActive: true },
      { thu: 7, tietBatDau: 4, soTiet: 2, isActive: true },
    ],
    nhomMonHoc: 11,
    maMonHoc: 323254,
    phong: "C120",
    thoiGianHoc: "123456789012345",
    maLop: "DKP1201",
  },

  {
    id: 8,
    tenMonHoc: "Hệ thống thông tin doanh nghiệp",
    children: [
      { thu: 2, tietBatDau: 6, soTiet: 3, isActive: true },
      { thu: 5, tietBatDau: 9, soTiet: 3, isActive: true },
    ],
    nhomMonHoc: 5,
    maMonHoc: 323254,
    phong: "C120",
    thoiGianHoc: "123456789012345",
    maLop: "DKP1201",
  },

  {
    id: 9,
    tenMonHoc: "Cơ sở dữ liệu phân tán",
    children: [
      { thu: 3, tietBatDau: 7, soTiet: 3, isActive: true },
      { thu: 5, tietBatDau: 1, soTiet: 3, isActive: true },
    ],
    nhomMonHoc: 5,
    maMonHoc: 323254,
    phong: "C120",
    thoiGianHoc: "123456789012345",
    maLop: "DKP1201",
  },
];

export const thoiGianHoc = [
  { tiet: 1, thoigianBatDau: "07:00:00", thoiGianKetThuc: "07:45:00" },
  { tiet: 2, thoigianBatDau: "07:50:00", thoiGianKetThuc: "08:35:00" },
  { tiet: 3, thoigianBatDau: "09:00:00", thoiGianKetThuc: "09:45:00" },
  { tiet: 4, thoigianBatDau: "09:50:00", thoiGianKetThuc: "10:35:00" },
  { tiet: 5, thoigianBatDau: "10:40:00", thoiGianKetThuc: "11:30:00" },
  { tiet: 6, thoigianBatDau: "13:00:00", thoiGianKetThuc: "13:45:00" },
  { tiet: 7, thoigianBatDau: "13:50:00", thoiGianKetThuc: "14:35:00" },
  { tiet: 8, thoigianBatDau: "15:00:00", thoiGianKetThuc: "15:45:00" },
  { tiet: 9, thoigianBatDau: "15:50:00", thoiGianKetThuc: "16:35:00" },
  { tiet: 10, thoigianBatDau: "16:40:00", thoiGianKetThuc: "17:30:00" },
  { tiet: 11, thoigianBatDau: "17:40:00", thoiGianKetThuc: "18:30:00" },
];

export const dataHeaderTable = [
  { id: 1, name: "STT" },
  { id: 2, name: "Mã môn" },
  { id: 3, name: "Tên môn" },
  { id: 4, name: "Nhóm" },
  { id: 5, name: "Mã lớp" },

  { id: 7, name: "Thực hành?" },
  { id: 8, name: "Thứ" },
  { id: 9, name: "Tiết BĐ" },
  { id: 10, name: "Số tiết" },
  { id: 11, name: "Phòng" },
  { id: 12, name: "Tuần" },
];

export const dataGroup = [
  {
    id: 1,
    name: "Nhóm 1",
    diemTrungBinh: 3.4,
    soLuongBaiTap: 2,
    thanhVien: 12,
    children: [
      {
        mssv: 3120560089,
        tenThanhVien: "Châu Quốc Thanh",
        baiTap: [
          {
            tenBaiTap: "Cơ sở dữ liệu phân tán 1 nha mấy đỉ",
            ngayNop: "22/2/2023",
            diem: 9,
          },
          {
            tenBaiTap: "Cơ sở dữ liệu phân tán 2 test      ds",
            ngayNop: "1/3/2023",
            diem: 9.9,
          },
          {
            tenBaiTap: "Cơ sở dữ liệu phân tán 3",
            ngayNop: "2/4/2023",
            diem: 3.3,
          },
        ],
      },
      {
        mssv: 3120560087,
        tenThanhVien: "Phan Thái Hòa",
        baiTap: [
          {
            tenBaiTap: "Cơ sở dữ liệu phân tán 1",
            ngayNop: "22/2/2023",
            diem: 8.33,
          },
          {
            tenBaiTap: "Cơ sở dữ liệu phân tán 2",
            ngayNop: "1/3/2023",
            diem: 9,
          },
          {
            tenBaiTap: "Cơ sở dữ liệu phân tán 3",
            ngayNop: "2/4/2023",
            diem: 3.3,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Nhóm 2",
    diemTrungBinh: 9,
    soLuongBaiTap: 2,
    thanhVien: 12,
    children: [
      {
        id: 11,
        tenThanhVien: "Châu Quốc Thanh",
        baiTap: [
          {
            tenBaiTap: "Cơ sở dữ liệu phân tán 1",
            ngayNop: "22/2/2023",
            diem: 9,
          },
          {
            tenBaiTap: "Cơ sở dữ liệu phân tán 2",
            ngayNop: "1/3/2023",
            diem: 9.9,
          },
          {
            tenBaiTap: "Cơ sở dữ liệu phân tán 3",
            ngayNop: "2/4/2023",
            diem: 3.3,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Nhóm 3",
    diemTrungBinh: 3.4,
    soLuongBaiTap: 2,
    thanhVien: 12,
  },
  {
    id: 4,
    name: "Nhóm 4",
    diemTrungBinh: 3.4,
    soLuongBaiTap: 2,
    thanhVien: 12,
  },
  {
    id: 5,
    name: "Nhóm 5",
    diemTrungBinh: 3.4,
    soLuongBaiTap: 2,
    thanhVien: 12,
  },
];

export const dataTag = [
  { id: 1, name: "Chung" },
  { id: 2, name: "Ôn thi" },
  { id: 3, name: "Dặn dò" },
  { id: 4, name: "Kiểm tra" },
  { id: 5, name: "Nghỉ bù" },
];

export const itemsPost = [
  {
    key: "1",
    // icon: <PushpinOutlined />,
    label: "Ghim tin nhắn",
  },
  {
    key: "2",
    // icon: <EditOutlined />,
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        Chỉnh sửa
      </a>
    ),
    // icon: <SmileOutlined />,
  },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        Xóa bài đăng
      </a>
    ),
  },
  {
    key: "4",
    danger: true,
    // icon: <DeleteOutlined />,
    label: "Xóa bài đăng",
  },
];

export const itemsComment = [
  {
    key: "1",
    // icon: <EditOutlined />,
    label: "Chỉnh sửa",
  },
  {
    key: "2",
    label: "Xóa bình luận",
    danger: true,
  },
];

export const itemsPractice = [
  {
    key: "1",
    label: "Chỉnh sửa",
  },
  {
    key: "2",
    label: "Thông báo dời",
  },
  {
    key: "3",
    label: "Xóa bài tập",
    danger: true,
  },
];

export const dataNotePractice = [
  { id: 1, name: "Chưa đến hạn bài tập", image: future },
  { id: 2, name: "Đã hết hạn bài tập", image: check },
  { id: 3, name: "Thời gian bài tập đang được diễn ra", image: inprogress },
  { id: 4, name: "Bài tập đã được xóa", image: cancelled },
];

export const dataProgress = [
  { id: 1, name: "Chưa dạy", color: "#faf5ff" },
  { id: 2, name: "Đánh dấu nghỉ, chưa tạo lịch bù", color: "#f87171" },
  { id: 4, name: "Đánh dấu nghỉ, đã tạo lịch bù", color: "#FFFF66" },
  // { id: 3, name: "Dạy lại buổi nghỉ", color: "#fb923c" },
  { id: 5, name: "Xin dời buổi bù", color: "#22d3ee" },
  { id: 6, name: "Lớp dạy bù", color: "#9333ea" },
  { id: 7, name: "Đã dạy học", color: "#a3e635" },
];
