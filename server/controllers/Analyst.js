const db = require("../connect");

const analystProgress = (req, res) => {
  const sql = `SELECT GROUP_CONCAT("Nhóm ",SG.subjectGroupNameGroup, " Thứ ", sg.subjectGroupDay) as name, SG.progress
    FROM subject S JOIN subjectgroup SG ON S.subjectID = SG.subjectID
    WHERE S.subjectID = ? group by SG.subjectGroupID`;

  const values = [req.body.subjectID];
  db.query(sql, values, (err, data) => {
    if (err) {
      req.json(err);
    }
    if (data.length == 0) {
      res.status(202);
    } else {
      return res.json(data);
    }
  });
};

module.exports = { analystProgress };
