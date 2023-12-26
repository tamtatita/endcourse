const db = require("../connect");
const uuid = require("uuid");

const getSubjectGroupBy = (req, res) => {
  const sql = `SELECT s.subjectName, s.IDSubject, s.subjectID FROM subject s WHERE s.teacherID = ? GROUP by s.subjectName, s.IDSubject`;

  const values = [req.body.teacherID];

  db.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
};

const getSubjectName = (req, res) => {
  const sql = `SELECT s.subjectID, s.subjectName, s.IDSubject FROM subject s WHERE s.teacherID = ? GROUP by s.subjectName, s.IDSubject, s.subjectID`;

  const values = [req.body.teacherID];

  db.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
};



module.exports = { getSubjectGroupBy, getSubjectName };
