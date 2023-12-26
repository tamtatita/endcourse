const db = require("../connect");
const uuid = require("uuid");

const getFolder = (req, res) => {
  const sql = `SELECT * FROM folders WHERE subjectID = ?`;
  const values = [req.body.subjectID];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    return res.json(data);
  });
};

module.exports = { getFolder };
