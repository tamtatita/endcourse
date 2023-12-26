const db = require("../connect");

const getAllNote = (req, res) => {
  const classCode = req.params.classCode;
  const sql =
    "select * from note n where n.teacherID = ? and n.subjectGroupID = ? ORDER BY n.noteDayCreate DESC ";
  const value = [req.body.teacherID, classCode];
  db.query(sql, value, (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
};

const deleteNote = (req, res) => {
  const classCode = req.params.classCode;
  const noteID = req.params.noteid;

  const sql = `DELETE FROM note where note.subjectGroupID = ? and note.noteID = ?`;
  const values = [classCode, noteID];
  console.log(values, "delete");

  db.query(sql, values, (err, data) => {
    if (err) return res.status(500).json({ error: "Lỗi truy vấn dữ liệu" });
    res.json({ message: "Đã xóa ghi chú thành công" });
  });
};

const editNote = (req, res) => {
  const sql = `UPDATE note SET noteTag = ?, noteDesc = ? WHERE noteID = ?`;

  const values = [req.body.noteTag, req.body.noteDesc, req.body.noteID];
  console.log(values, "edit");
  db.query(sql, values, (err, data) => {
    if (err) {
      res.json(err);
    }
    res.json(data);
  });
};

const createNote = (req, res) => {
  const classCode = req.params.classCode;
  const { noteDesc, noteTag } = req.body;
  const sql = `INSERT INTO note (noteID, noteDesc, noteTag, teacherID, subjectGroupID) VALUES(UUID(), ?, ?, ?, ?) `;
  const values = [noteDesc, noteTag, req.body.teacherID, classCode];
  console.log(values);
  db.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

module.exports = { getAllNote, deleteNote, createNote, editNote };
