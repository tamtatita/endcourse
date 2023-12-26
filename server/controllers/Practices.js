const db = require("../connect");
const uuid = require("uuid");

const createPractice = (req, res) => {
  const practiceID = uuid.v4();

  const sql =
    "INSERT INTO practices(practiceID,practiceTitle, practiceStatus, practiceFile, teacherID ) VALUES(?,?,?,?, ?)";
  const values = [
    practiceID,
    req.body.title,
    req.body.status,
    req.body.file,
    req.body.teacherID,
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Lỗi xảy ra khi thêm bài tập" });
    } else {
      const PracticeCode = practiceID;
      const insertPromises = [];
      const dataClass = req.body.subjectGroupID;
      dataClass.forEach((item) => {
        const insertDetail =
          "INSERT INTO practiceinclass(practiceInClassID, dayOpen, dayClose, subjectGroupID, practiceID) VALUES(UUID(),?,?,?,?)";

        const valuesDetail = [
          req.body.dayOpen,
          req.body.dayClose,
          item,
          PracticeCode, // Use PracticeCode instead of req.body.practiceID
        ];

        console.log(item, "item");

        const insertPromise = new Promise((resolve, reject) => {
          db.query(insertDetail, valuesDetail, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        });

        insertPromises.push(insertPromise);
      });

      Promise.all(insertPromises)
        .then(() => {
          res.status(201).json({
            message: "Đã thêm danh sách các bài tập vào trong lớp",
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ error: "Lỗi xảy ra khi thêm các bài tập" });
        });
    }
  });
};

const getMemberInClass = (req, res) => {
  const sql = `SELECT count(*) as total
  FROM memberinsubject MB 
  WHERE MB.subjectGroupID = ?`;
  const values = [req.body.subjectGroupID];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    return res.json(data);
  });
};

const getHistorySubmit = (req, res) => {
  const sql = `SELECT M.memberID, M.memberName, M.MSSV, MB.score, MB.dayCreate, S.submissionID, S.submissionFile, S.practiceInClassID
  FROM membersubmits MB JOIN submissions S ON S.submissionID = MB.submissionID
              JOIN member M ON M.memberID = MB.memberID
  WHERE S.practiceInClassID = ?
  ORDER BY MB.dayCreate DESC`;

  const values = [req.body.practiceInClassID];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    return res.status(200).json(data);
  });
};

const getAllPractice = (req, res) => {
  const sql = `SELECT P.practiceID, P.practiceTitle, P.practiceFile, PC.practiceInClassID, PC.dayOpen, PC.dayClose, PC.subjectGroupID, S.submissionID, MB.memberID
  from practices P JOIN practiceinclass PC ON P.practiceID = PC.practiceID
          LEFT join submissions S ON S.practiceInClassID = PC.practiceInClassID
                 left JOIN membersubmits MB ON MB.submissionID = S.submissionID
  WHERE p.teacherID =? and PC.subjectGroupID = ?
  GROUP BY P.practiceID, P.practiceTitle, P.practiceFile, PC.practiceInClassID, PC.dayOpen, PC.dayClose, PC.subjectGroupID, S.submissionID, MB.memberID`;
  const values = [req.body.teacherID, req.body.subjectGroupID];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(data);
  });
};

const pagePracticeTeacher = (req, res) => {
  const sql = `SELECT S.subjectID,  P.practiceID, P.practiceTitle, PC.practiceInClassID, PC.dayOpen, PC.dayClose, PC.subjectGroupID, SG.subjectGroupDay, SG.subjectGroupStart, SG.subjectGroupNameGroup, S.subjectName
  FROM practices P JOIN practiceinclass PC ON P.practiceID = PC.practiceID
          JOIN subjectgroup SG ON SG.subjectGroupID = PC.subjectGroupID
                  JOIN subject S ON S.subjectID = SG.subjectID
  WHERE S.teacherID = ?
  GROUP BY S.subjectID,  P.practiceID, P.practiceTitle, PC.practiceInClassID, PC.dayOpen, PC.dayClose, PC.subjectGroupID, SG.subjectGroupDay, SG.subjectGroupStart, SG.subjectGroupNameGroup, S.subjectName;`;
  const values = [req.body.teacherID];
  db.query(sql, values, (err, data) => {
    if (err) {
      res.json(err);
    }
    res.json(data);
  });
};

const getAnalystPractice = (req, res) => {
  const sql = `SELECT *
  from submissions S left JOIN membersubmits MB ON S.submissionID = MB.submissionID
            left JOIN member M ON MB.memberID = M.memberID
                      left JOIN memberinsubject MI ON MI.memberID = M.memberID
  WHERE S.practiceID = ?`;

  const values = [req.body.practiceID];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      return res.json(data);
    }
  });
};

const HomeGetPractice = (req, res) => {
  const role = req.body.role;
  let sql = "";
  let values = [];
  if (role == "teacher") {
    sql = `SELECT S.subjectName,P.practiceID, P.practiceTitle, P.practiceStatus, PC.practiceInClassID, PC.dayOpen,PC.dayClose, PC.subjectGroupID, SG.subjectGroupNameGroup, SG.subjectGroupDay, SG.subjectGroupStart
   FROM practices P LEFT JOIN practiceinclass PC ON P.practiceID = PC.practiceID
             LEFT JOIN subjectgroup SG ON SG.subjectGroupID = PC.subjectGroupID
                       LEFT JOIN subject S ON S.subjectID = SG.subjectID
   WHERE S.teacherID = ? and sg.subjectGroupDelete = ?`;
    values = [req.body.userID, 0];
  } else {
    sql = `SELECT S.subjectName,P.practiceID, P.practiceTitle, P.practiceStatus, PC.practiceInClassID, PC.dayOpen, PC.dayClose, PC.subjectGroupID, SG.subjectGroupID ,SG.subjectGroupDay, SG.subjectGroupStart, SG.subjectGroupNameGroup
    from member M JOIN memberinsubject MB ON M.memberID = MB.memberID
            JOIN practiceinclass PC ON PC.subjectGroupID = MB.subjectGroupID
                    JOIN practices P ON P.practiceID = PC.practiceID
                    JOIN subjectgroup SG ON SG.subjectGroupID = PC.subjectGroupID
                    JOIN subject S on S.subjectID = sg.subjectID
                    WHERE M.memberID = ? AND SG.subjectGroupDelete = ? and SG.subjectGroupStatus = ?`;
    values = [req.body.userID, 0, 1];
  }
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      return res.json(data);
    }
  });
};

const getPracticeForMember = (req, res) => {
  const classCode = req.params.classCode;
  const sql = `SELECT PC.practiceInClassID, PC.dayOpen, PC.dayClose, PC.subjectGroupID, P.practiceID, P.practiceTitle, P.practiceStatus, P.practiceFile
  from memberinsubject MB JOIN member M ON MB.memberID = M.memberID
              JOIN subjectgroup SG ON SG.subjectGroupID = MB.subjectGroupID
                          JOIN practiceinclass PC ON PC.subjectGroupID = SG.subjectGroupID 
                          JOIN practices P ON PC.practiceID = P.practiceID
  WHERE SG.subjectGroupID = ?`;
  const values = [classCode];
  db.query(sql, values, (err, data) => {
    if (err) {
      res.json(err);
    }
    res.json(data);
  });
};

module.exports = {
  createPractice,
  getAllPractice,
  getAnalystPractice,
  getMemberInClass,
  getHistorySubmit,
  HomeGetPractice,
  getPracticeForMember,
  pagePracticeTeacher,
};
