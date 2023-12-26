const db = require("../connect");

const getALlMemberInClass = (req, res) => {
  const classCode = req.params.classCode;
  const sql = `SELECT M.memberID, M.memberName, M.memberBirth, M.memberSchool, M.memberEmail, M.MSSV, M.memberTelephone, M.memberSex
    FROM subjectgroup SG
                    JOIN memberinsubject MI ON MI.subjectGroupID = SG.subjectGroupID
                    JOIN member M ON M.memberID = MI.memberID
    WHERE MI.subjectGroupID = ?
    GROUP BY  M.memberID, M.memberName, M.memberBirth, M.memberSchool, M.memberEmail, M.MSSV, M.memberTelephone, M.memberSex`;

  const values = [classCode];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
    }
    res.json(data);
  });
};

const deleteMemberInClass = (req, res) => {
  const classCode = req.params.classCode;
  const memberID = req.params.memberID;
  const sql = `DELETE FROM memberinsubject WHERE memberID = ? AND subjectGroupID = ?;
  `;

  const values = [memberID, classCode];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
    }
    return res
      .status(200)
      .json({ message: "Đã xóa thành viên khỏi nhóm thành công" });
  });
};

module.exports = { getALlMemberInClass, deleteMemberInClass };
