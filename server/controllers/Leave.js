const db = require("../connect");
const uuid = require("uuid");

const findStatus = (req, res) => {
  const sql = `SELECT 
  CASE 
    WHEN c.compensationScheduleID IS NULL and t.teachingStatus = 'Kế hoạch' THEN 'Kế hoạch'
    WHEN c.compensationScheduleID IS NULL and t.teachingStatus = 'Xin nghỉ' THEN 'Xin nghỉ'
    WHEN c.compensationScheduleID IS not NULL THEN 'Đã tạo lịch'
    ELSE T.teachingStatus 
  END AS status
FROM teachingstatus T
LEFT JOIN compensationschedule c ON c.teachingStatusID = T.teachingStatusID 
WHERE T.subjectGroupID = ? AND T.teachingStatusWeek = ?`;
  const values = [req.body.subjectGroupID, req.body.teachingStatusWeek];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({ message: data });
    }
  });
};

const confirmLeave = (req, res) => {
  const type = req.body.type;
  const updateSql =
    "update teachingstatus set teachingStatus = ? where subjectGroupID = ? and teachingStatusWeek = ?";
  const selectSql =
    "SELECT teachingStatusID, teachingStatus, subjectGroupID FROM teachingstatus WHERE subjectGroupID = ? and teachingStatusWeek = ?";
  const insertSql =
    "INSERT INTO historyleave(historyLeaveID, teachingStatusID, status) VALUES(UUID(), ?, ?)";
  const values = [
    type == "leave" ? "Xin nghỉ" : "Dạy lại bù",
    req.body.subjectGroupID,
    req.body.teachingStatusWeek,
  ];

  db.query(updateSql, values, (updateErr, updateData) => {
    if (updateErr) {
      console.log(updateErr);
      return res.status(500).json({ error: "Lỗi khi cập nhật trạng thái" });
    }

    // Sau khi cập nhật thành công, thực hiện truy vấn SELECT để lấy ID của bản ghi đã cập nhật
    db.query(
      selectSql,
      [req.body.subjectGroupID, req.body.teachingStatusWeek],
      (selectErr, selectData) => {
        if (selectErr) {
          console.log(selectErr);
          return res
            .status(500)
            .json({ error: "Lỗi khi lấy thông tin cập nhật" });
        }

        const updatedRecordId = selectData[0].teachingStatusID; // Lấy ID của bản ghi đã được cập nhật
        const statusRecordId = selectData[0].status;
        const classCode = selectData[0].subjectGroupID;

        // Thực hiện truy vấn INSERT với ID của bản ghi đã cập nhật
        db.query(
          insertSql,
          [updatedRecordId, statusRecordId],
          (insertErr, insertData) => {
            if (insertErr) {
              console.log(insertErr);
              return res
                .status(500)
                .json({ error: "Lỗi khi thêm vào bảng historyleave" });
            }

            return res.status(201).json({
              message: "Đã cập nhật trạng thái thành công",
              id: updatedRecordId,
              classCode: classCode,
            });
          }
        );
      }
    );
  });
};

const historyConfirmClass = (req, res) => {
  const sql = `SELECT T.teachingStatusID, T.teachingStatusWeek, t.teachingStatus, t.teachingStatusDay, HL.historyLeaveID, HL.time, HL.Status, CS.compensationScheduleID, CS.week, CS.status, CS.compensationScheduleThu, CS.compensationScheduleStart, CS.compensationScheduleNumber, C.confirmationID, C.confirmationDay, C.chapterProgressIndexID, C.currentWeek, ci.chapterProgressIndexName, cpi.chapterProgressIndexName, cpi.chapterProgressIndexWeeks
  FROM teachingstatus T  LEFT JOIN historyleave HL ON T.teachingStatusID = HL.teachingStatusID
              LEFT JOIN compensationschedule CS ON CS.teachingStatusID = T.teachingStatusID
                          LEFT JOIN confirmation C ON C.teachingStatusID = T.teachingStatusID
                          left join chapterprogressindex ci on ci.chapterProgressIndexID = c.chapterProgressIndexID
                          join chapterprogressindex cpi on cpi.chapterProgressIndexID = c.chapterProgressIndexID
  WHERE   T.subjectGroupID = ? AND T.teachingStatus NOT LIKE 'Kế hoạch'
  GROUP BY T.teachingStatusID, T.teachingStatusWeek, t.teachingStatus, t.teachingStatusDay, HL.historyLeaveID, HL.time, HL.Status, CS.compensationScheduleID, CS.week, CS.status, CS.compensationScheduleThu, CS.compensationScheduleStart, CS.compensationScheduleNumber, C.confirmationID, C.confirmationDay, C.chapterProgressIndexID, C.currentWeek, ci.chapterProgressIndexName
  ORDER BY T.teachingStatusWeek,cpi.chapterProgressIndexName, cpi.chapterProgressIndexWeeks;`;

  const values = [req.body.subjectGroupID];
  db.query(sql, values, (err, data) => {
    if (err) {
      res.json(err);
    }
    res.json(data);
  });
};

const createCalendar = (req, res) => {
  const sqlUpdate = `update teachingstatus set teachingStatus = ? where teachingStatusID = ?`;
  const valueUpdate = ["Đã tạo lịch", req.body.id];
  db.query(sqlUpdate, valueUpdate, (error, data1) => {
    if (error) {
      res.json(error);
    }
    const sql =
      "insert into compensationschedule(compensationScheduleID,compensationScheduleThu,compensationScheduleStart, compensationScheduleNumber, compensationScheduleClassName, week, teachingStatusID) VALUES(UUID(), ?, ?, ?, ?, ?, ?)";

    const values = [
      req.body.thu,
      req.body.tietBatDau,
      req.body.soTiet,
      req.body.phong,
      req.body.tuan,
      req.body.id,
    ];

    db.query(sql, values, (err, data) => {
      if (err) {
        res.json(err);
      }
      res.status(201).json(data);
    });
  });
};

const RemiderCalendar = (req, res) => {
  const sql = `SELECT T.teachingStatusID, T.teachingStatusDay, T.teachingStatusWeek, T.teachingStatusWeek, T.teachingStatus, T.subjectGroupID, S.subjectName, SG.subjectGroupNameGroup, C.compensationScheduleID, C.compensationScheduleThu, C.compensationScheduleStart, C.compensationScheduleNumber, C.week, C.compensationScheduleClassName
  FROM teachingstatus T LEFT JOIN compensationschedule C ON T.teachingStatusID = C.teachingStatusID
              LEFT JOIN subjectgroup SG ON SG.subjectGroupID = T.subjectGroupID
                          LEFT JOIN subject S ON S.subjectID = SG.subjectID
  WHERE S.teacherID = ? and t.teachingStatus like 'Xin nghỉ' and sg.subjectGroupStatus = ? and sg.subjectGroupDelete = ? 
  GROUP BY T.teachingStatusID, T.teachingStatusDay, T.teachingStatusWeek, T.teachingStatusWeek, T.teachingStatus, T.subjectGroupID, S.subjectName, SG.subjectGroupNameGroup, C.compensationScheduleID, C.compensationScheduleThu, C.compensationScheduleStart, C.compensationScheduleNumber, C.week, C.compensationScheduleClassName
  ORDER BY T.teachingStatusWeek ASC
  `;

  const values = [req.body.teacherID, 1, 0];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(data);
  });
};

const reschedule = (req, res) => {
  const sql = `update compensationschedule set compensationScheduleThu = ?, compensationScheduleStart = ?, compensationScheduleNumber=?, compensationScheduleClassName=?, week=? where compensationScheduleID  = ?`;
  const values = [
    req.body.thu,
    req.body.tietBatDau,
    req.body.soTiet,
    req.body.phong,
    req.body.tuan,
    req.body.id,
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      req.json(err);
    }
    res.status(201).json(data);
  });
};
module.exports = {
  findStatus,
  confirmLeave,
  historyConfirmClass,
  createCalendar,
  RemiderCalendar,
  reschedule
};
