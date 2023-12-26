const db = require("../connect");

// PHÂN TÍCH TỔNG SỐ HỌC SINH + TỔNG SỐ MÔN DẠY + TỔNG SỐ LỚP DẠY

const tongSoMonDay = (req, res) => {
  const sql = `select count(*) as count from subject S where S.teacherID = ? `;
  const value = [req.body.userID];
  db.query(sql, [value], (err, data) => {
    if (err) console.log(err);
    const result = data[0].count || 0;
    res.json({ result });
  });
};

const tongSoNhomDay = (req, res) => {
  const sql = `select count(*) as count
  from subject s JOIN subjectgroup sg on s.subjectID = sg.subjectID
  join teacher t on t.teacherID = s.teacherID where t.teacherID = ? and sg.subjectGroupStatus = 1 and sg.subjectGroupDelete = 0`;
  const value = [req.body.userID];
  db.query(sql, [value], (err, data) => {
    if (err) console.log(err);
    const result = data[0].count || 0;
    res.json({ result });
  });
};

const tongSoThanhVien = (req, res) => {
  const sql = `select count(*) as count
from teachingstatus t join subjectgroup sg on t.subjectGroupID = sg.subjectGroupID 
						join subject s on s.subjectID = sg.subjectID
where sg.subjectGroupStatus = 1 and sg.subjectGroupSemester = 0 and t.teachingStatus = 'Xin nghỉ' and s.teacherID = ? `;
  const value = [req.body.userID];
  db.query(sql, [value], (err, data) => {
    if (err) console.log(err);
    const result = data[0].count || 0;
    res.json({ result });
  });
};

module.exports = {
  tongSoMonDay,
  tongSoNhomDay,
  tongSoThanhVien,
};
