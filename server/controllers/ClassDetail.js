const db = require("../connect");

const getNameSubject = (req, res) => {
  const classCode = req.params.classCode;

  const sql = `select * from subject s join subjectgroup sg on s.subjectID = sg.subjectID where sg.subjectGroupID = ? and sg.subjectGroupDelete = ?`;
  const value = [classCode, 0];
  db.query(sql, value, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
    }

    res.json(data);
  });
};

const totalMemberInGroup = (req, res) => {
  const classCode = req.params.classCode;

  const sql = `select count(mi.memberID) as count from subject s join subjectgroup sg on s.subjectID = sg.subjectID join memberinsubject mi on mi.subjectGroupID = sg.subjectGroupID 
  where sg.subjectGroupID = ? and sg.subjectGroupDelete = ?`;
  const value = [classCode, 0];
  db.query(sql, value, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
    }
    const result = data[0].count || 0;
    res.json({ result });
  });
};
module.exports = { getNameSubject };
