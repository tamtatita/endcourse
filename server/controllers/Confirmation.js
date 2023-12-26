const db = require("../connect");

const getCheck = (req, res) => {
  const sql = `select c.confirmationID, c.confirmationDay, c.isTaught, c.chapterProgressIndexID, c.currentWeek, t.teachingStatusID
  from teachingstatus t join confirmation c on t.teachingStatusID = c.teachingStatusID
  where t.subjectGroupID = ?`;
  const values = [req.body.subjectGroupID];
  db.query(sql, values, (err, data) => {
    if (err) {
      res.json(err);
    }
    res.json(data);
  });
};

const checkConfirm = (req, res) => {
  const sqlConfirm =
    "update teachingstatus set teachingStatus = ? where subjectGroupID = ? and teachingStatusWeek = ?";
  const valueConfirm = [
    "Đã dạy",
    req.body.subjectGroupID,
    req.body.currentWeek,
  ];

  db.query(sqlConfirm, valueConfirm, (err, data) => {
    if (err) {
      return res.json(err); // Use return to prevent further execution
    }

    const findTeachingID = `select teachingStatusID from teachingStatus where subjectGroupID = ? and teachingStatusWeek =? `;
    const valuesFind = [req.body.subjectGroupID, req.body.currentWeek];

    db.query(findTeachingID, valuesFind, (error, dataFind) => {
      if (error) {
        return res.json(error); // Use return to prevent further execution
      }

      if (dataFind.length > 0) {
        const teachingStatusID = dataFind[0].teachingStatusID;
        const sql = `insert into confirmation(confirmationID, isTaught, teachingStatusID, chapterProgressIndexID, currentWeek) VALUES(UUID(), ?,?,?,?)`;

        const values = [
          1,
          teachingStatusID,
          req.body.chapterProgressIndexID,
          req.body.currentWeek,
        ];

        db.query(sql, values, (err, data) => {
          if (err) {
            return res.json(err); // Use return to prevent further execution
          }

          const sqlFindProgress = `SELECT 
            (
              SELECT COUNT(CP.chapterProgressIndexID) 
              FROM chapterprogressindex CP 
              JOIN confirmation C ON C.chapterProgressIndexID = CP.chapterProgressIndexID
              JOIN teachingstatus T ON T.teachingStatusID = C.teachingStatusID
              WHERE T.subjectGroupID = ?
            ) / 
            (
              SELECT COUNT(CI.chapterProgressIndexID)
              FROM subjectgroup SG
              JOIN lessonplan L ON L.lessonplanID = SG.lessonplanID
              JOIN chapterprogress CP ON CP.lessonplanID = L.lessonplanID 
              JOIN chapterprogressindex CI ON CI.chapterProgressID = CP.chapterProgressID
              WHERE SG.subjectGroupID = ?  
            ) * 100 AS progress;`;

          const valuesFindProgress = [
            req.body.subjectGroupID,
            req.body.subjectGroupID,
          ];

          db.query(
            sqlFindProgress,
            valuesFindProgress,
            (errFindProgress, dataFindProgress) => {
              if (errFindProgress) {
                return res.json(errFindProgress); // Use return to prevent further execution
              }

              const progress = dataFindProgress[0].progress;
              const updateProgress = `update subjectGroup set progress = ? where subjectGroupID = ?`;
              const valuesUpdate = [progress, req.body.subjectGroupID];

              db.query(
                updateProgress,
                valuesUpdate,
                (errorUpdateProgress, resultUpdateProgress) => {
                  if (errorUpdateProgress) {
                    return res.json(errorUpdateProgress); // Use return to prevent further execution
                  }

                  return res
                    .status(201)
                    .json({ message: "Đã cập nhật đã dạy thành công" });
                }
              );
            }
          );
        });
      }
    });
  });
};

const kiemTraChuaChamCong = (req, res) => {
  const sql = `SELECT *
  FROM teachingstatus t join subjectgroup sg on t.subjectGroupID = sg.subjectGroupID
              join subject s on s.subjectID = sg.subjectID
  WHERE t.subjectGroupID IN (
  SELECT subjectGroupID
  FROM teachingstatus
  WHERE teachingStatus = 'Đã dạy'
  GROUP BY subjectGroupID
  )
  AND t.teachingStatusWeek BETWEEN (
  SELECT MIN(teachingStatusWeek)
  FROM teachingstatus
  WHERE subjectGroupID = t.subjectGroupID AND teachingStatus = 'Đã dạy'
  ) AND (
  SELECT MAX(teachingStatusWeek)
  FROM teachingstatus
  WHERE subjectGroupID = t.subjectGroupID AND teachingStatus = 'Đã dạy'
  )
  
  AND t.teachingStatus = 'Kế hoạch' and s.teacherID = ? and sg.subjectGroupStatus = ? and sg.subjectGroupDelete = ?`;
  const values = [req.body.teacherID, 1,0];
  db.query(sql, values, (err, data) => {
    if (err) {
      res.json(err);
    }
    return res.json(data);
  });
};

module.exports = { getCheck, checkConfirm, kiemTraChuaChamCong };
