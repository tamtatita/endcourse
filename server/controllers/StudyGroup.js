const db = require("../connect");
const uuid = require("uuid");

const getAllStudyGroup = (req, res) => {
  const classCode = req.params.classCode;
  const sql = `SELECT
  SGC.subjectGroupID,
  SG.studyGroupID,
  SG.studyGroupName,
  SG.studyGroupDayCreate,
  SG.studyGroupIsDelete,
  SG.studyGroupDayClose,
  SG.limitMember,
  SG.limitGroup,
  SGD.studyGroupDetailID, 
  SGD.detailName,
  SGD.dayCreate,
  M.memberID,
  M.memberName,
  M.MSSV,
  M.memberSex
 
 
FROM subjectgroup SGC
JOIN studygroup SG ON SGC.subjectGroupID = SG.subjectGroupID
JOIN studygroupdetail SGD ON SGD.studyGroupID = SG.studyGroupID
JOIN memberinsubject MB ON MB.studyGroupDetailID = SGD.studyGroupDetailID
JOIN member M ON M.memberID = MB.memberID
WHERE SG.subjectGroupID LIKE ?
GROUP BY
 SGC.subjectGroupID,
  SG.studyGroupID,
  SG.studyGroupName,
  SG.studyGroupDayCreate,
  SG.studyGroupIsDelete,
  SG.studyGroupDayClose,
  SG.limitMember,
  SG.limitGroup,
   SGD.studyGroupDetailID, 
  SGD.detailName,
  SGD.dayCreate,
  M.memberID,
  M.memberName,
  M.MSSV,
  M.memberSex;`;

  const values = [classCode];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
    }
    res.json(data);
  });
};

const addStudyGroup = (req, res) => {
  const classCode = req.params.classCode;
  const ID = uuid.v4();
  const sql =
    "INSERT INTO studygroup(studyGroupID,studyGroupName, subjectGroupID, studyGroupDayClose, limitMember, limitGroup ) VALUES(?,?,?,?,?,?)";

  const values = [
    ID,
    req.body.studyGroupName,
    classCode,
    req.body.studyGroupDayClose,
    req.body.limitMember,
    req.body.limitGroup,
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    return res
      .status(200)
      .json({ message: "Đã xác nhận tạo thành công nhóm học tập" });
  });
};

module.exports = { getAllStudyGroup, addStudyGroup };
