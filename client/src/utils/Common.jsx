import moment from "moment-timezone";

const groupData = (dataMonHoc) => {
  const groupedData =
    dataMonHoc &&
    dataMonHoc.length > 0 &&
    dataMonHoc.reduce((result, current) => {
      // Tìm xem đã có nhóm tương ứng hay chưa
      const group = result.find(
        (item) =>
          // item.subjectGroupID === current.subjectGroupID &&
          item.subjectName === current.subjectName &&
          item.IDSubject === current.IDSubject
      );

      if (group) {
        // Nếu đã có nhóm, thêm dữ liệu vào mảng children của nhóm đó
        group.children.push({
          subjectID: current.subjectID,
          subjectGroupClassName: current.subjectGroupClassName,
          subjectGroupCount: current.subjectGroupCount,
          subjectGroupDay: current.subjectGroupDay,
          subjectGroupID: current.subjectGroupID,
          subjectGroupLinkFaceBook: current.subjectGroupLinkFaceBook,
          subjectGroupLinkZalo: current.subjectGroupLinkZalo,
          subjectGroupNameGroup: current.subjectGroupNameGroup,
          subjectGroupOffMess: current.subjectGroupOffMess,
          subjectGroupPractice: current.subjectGroupPractice,
          subjectGroupSemester: current.subjectGroupSemester,
          subjectGroupStart: current.subjectGroupStart,
          subjectGroupStatus: current.subjectGroupStatus,
          subjectGroupClass: current.subjectGroupClass,
          progress: current.progress
        });
      } else {
        // Nếu chưa có nhóm, tạo một nhóm mới và thêm vào mảng kết quả
        result.push({
          subjectID: current.subjectID,
          subjectName: current.subjectName,
          IDSubject: current.IDSubject,
          children: [
            {
              subjectGroupClassName: current.subjectGroupClassName,
              subjectGroupCount: current.subjectGroupCount,
              subjectGroupDay: current.subjectGroupDay,
              subjectGroupID: current.subjectGroupID,
              subjectGroupLinkFaceBook: current.subjectGroupLinkFaceBook,
              subjectGroupLinkZalo: current.subjectGroupLinkZalo,
              subjectGroupNameGroup: current.subjectGroupNameGroup,
              subjectGroupOffMess: current.subjectGroupOffMess,
              subjectGroupPractice: current.subjectGroupPractice,
              subjectGroupSemester: current.subjectGroupSemester,
              subjectGroupStart: current.subjectGroupStart,
              subjectGroupStatus: current.subjectGroupStatus,
              subjectGroupClass: current.subjectGroupClass,
              progress: current.progress
            },
          ],
        });
      }

      return result;
    }, []);

  return Object.values(groupedData);
};

const TimeFirebase = (timestamp) => {
  // Tạo đối tượng Moment từ timestamp
  const date = moment.unix(timestamp);

  // Chuyển đổi sang múi giờ mong muốn (nếu cần)
  const desiredTimeZone = "Asia/Ho_Chi_Minh"; // Đổi sang múi giờ Việt Nam
  const convertedTime = date.tz(desiredTimeZone);

  // Định dạng thời gian theo chuẩn cụ thể
  const formattedTime = convertedTime.format("DD-MM-YYYY HH:mm");
  return formattedTime;
};

const TimeMysql = (time) => {
  return moment(time).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY hh:mm:ss");
};

export default groupData;
export { TimeFirebase, TimeMysql };
