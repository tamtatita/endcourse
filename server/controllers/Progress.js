const db = require("../connect");
const uuid = require("uuid");

const getAllClass = (req, res) => {
  const sql = `SELECT s.subjectID, s.subjectName, s.IDSubject, sg.subjectGroupID, SG.subjectGroupDay, SG.subjectGroupStart, SG.subjectGroupCount, SG.subjectGroupPractice, SG.subjectGroupNameGroup, sg.subjectGroupWeeks
    FROM subject S JOIN subjectgroup SG ON S.subjectID = SG.subjectID
    WHERE S.teacherID = ? AND SG.subjectGroupDelete = ?  AND SG.subjectGroupStatus = ?
    GROUP BY s.subjectID, s.subjectName, s.IDSubject, sg.subjectGroupID, SG.subjectGroupDay, SG.subjectGroupStart, SG.subjectGroupCount, SG.subjectGroupPractice, SG.subjectGroupNameGroup, sg.subjectGroupWeeks`;

  const values = [req.body.teacherID, 0, 1];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    return res.json(data);
  });
};

const caculateProgress = (req, res) => {
  const sql = `SELECT *
  FROM confirmation C JOIN chapterprogressindex CPS ON C.chapterProgressIndexID = CPS.chapterProgressIndexID
            JOIN chapterprogress CP ON CP.chapterProgressID = CPS.chapterProgressID
                      JOIN lessonplan L ON L.lessonplanID = CP.lessonplanID
                      join subjectgroup sg on sg.lessonplanID = l.lessonplanID
                      join subject s on s.subjectID = sg.subjectID
  WHERE S.teacherID = ? AND C.currentWeek > CPS.chapterProgressIndexWeeks and sg.subjectGroupStatus = ? and sg.subjectGroupDelete = ?`;

  const values = [req.body.teacherID, 1, 0];
  db.query(sql, values, (err, data) => {
    if (err) {
      res.json(err);
    }
    res.json(data);
  });
};

const getALLProgress = (req, res) => {
  const sql = `
 SELECT
    sg.subjectGroupID,
    sg.subjectGroupDay,
    sg.subjectGroupCount,
    sg.subjectGroupNameGroup,
   s.subjectID,
   s.subjectName,
   s.IDSubject,
   t.teachingStatusID,
   t.teachingStatusDay,
   t.teachingStatusWeek,
   t.teachingStatus,
   c.compensationScheduleID,
   c.compensationScheduleThu,
   c.compensationScheduleStart,
   c.week,
   c.status,
   sg.subjectGroupStart
FROM
    subjectgroup sg
LEFT JOIN
    teachingstatus t ON sg.subjectGroupID = t.subjectGroupID
LEFT JOIN
    compensationschedule c ON c.teachingStatusID = t.teachingStatusID
LEFT JOIN
    subject s ON s.subjectID = sg.subjectID
WHERE
    s.teacherID = ? and sg.subjectGroupDelete = ? and sg.subjectGroupStatus = ?
GROUP BY
   sg.subjectGroupID,
    sg.subjectGroupDay,
    sg.subjectGroupCount,
    sg.subjectGroupNameGroup,
   s.subjectID,
   s.subjectName,
   s.IDSubject,
   t.teachingStatusID,
   t.teachingStatusDay,
   t.teachingStatusWeek,
   t.teachingStatus,
   c.compensationScheduleID,
   c.compensationScheduleThu,
   c.compensationScheduleStart,
   c.week,
   sg.subjectGroupStart,
   c.status;`;
  const values = [req.body.teacherID, 0, 1];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    return res.json(data);
  });
};

const test = (req, res) => {
  const sql = `
  SELECT
  t.teachingStatusWeek,
  TRIM(TRAILING ',' FROM CONCAT('[', GROUP_CONCAT(DISTINCT
    CONCAT('{"subjectGroupID": "', sg.subjectGroupID, '", "subjectName":"', sh.subjectName,'", "subjectID":"', sh.subjectID,'", "subjectGroupNameGroup":"', sg.subjectGroupNameGroup,'", "subjectGroupStart":"', sg.subjectGroupStart,'", "subjectGroupDay":"', sg.subjectGroupDay, '", "Progress": ', sg.progress,  ', "teachingStatus": "', t.teachingStatus, '", "teachingStatusID": "', t.teachingStatusID, '"}')
  ), ']')) AS dataClass,
  TRIM(TRAILING ',' FROM CONCAT('[', GROUP_CONCAT(
    CONCAT('{"compensationScheduleThu":',s.compensationScheduleThu,',
    "week":',s.week,',
    "status":"',s.status,'",
    "subjectID":"',sh.subjectID,'",
    "subjectName":"',sh.subjectName,'",
    "compensationScheduleID":"',s.compensationScheduleID,'",
    "subjectGroupNameGroup":"',sg.subjectGroupNameGroup,'",
    "subjectGroupStart":"',s.compensationScheduleStart,'",
    "subjectGroupPractice":"',sg.subjectGroupPractice,'",
    "subjectGroupID":"',sg.subjectGroupID,'"}')
  ), ']')) AS schedules
FROM
  teachingstatus t
JOIN subjectgroup sg ON t.subjectGroupID = sg.subjectGroupID
JOIN subject sh ON sh.subjectID = sg.subjectID
LEFT JOIN compensationschedule s ON t.teachingStatusID = s.teachingStatusID
WHERE sh.teacherID = ? AND sg.subjectGroupDelete = ? AND sg.subjectGroupStatus = ?
GROUP BY t.teachingStatusWeek;



  `;
  const values = [req.body.teacherID, 0, 1];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    return res.json(data);
  });
};

module.exports = { getAllClass, caculateProgress, getALLProgress, test };
