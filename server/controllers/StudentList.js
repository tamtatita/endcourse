const db = require("../connect");

const addStudentList = (req, res) => {
  const sql =
    "INSERT INTO studentlist(studentlistID, studentlistMSSV, studentlistMiddleName, studentlistName, studentlistDesc, subjectgroupID) VALUES (UUID(), ?,?,?,?,? )";

  const values = [
    req.body.studentlistMSSV,
    req.body.studentlistMiddleName,
    req.body.studentlistName,
    req.body.studentlistDesc,
    req.body.subjectgroupID,
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json({ message: "Đã thêm toàn bộ danh sách sinh viên thành công" });
  });
};

const getAllStudentList = (req, res) => {
  const sql = "select * from studentlist where subjectgroupID = ?";
  const classCode = req.params.classCode;
  const values = [classCode];
  db.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

module.exports = { addStudentList, getAllStudentList };
