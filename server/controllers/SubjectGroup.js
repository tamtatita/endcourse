const db = require("../connect");
const uuid = require("uuid");

const role = "teacher";
// Hàm xử lý chèn dữ liệu vào teachingstatus

const SearchClassCodeForStudent = (req, res) => {
  const sql = `SELECT SG.subjectGroupID, SG.subjectID,S.subjectName, S.teacherID, SG.subjectGroupDay, SG.subjectGroupCount, T.teacherName
  FROM subjectgroup SG JOIN subject S ON S.subjectID = SG.subjectID
              JOIN teacher T ON T.teacherID = S.teacherID
  WHERE SG.subjectGroupID = ? AND SG.subjectGroupDelete = ?`;

  const values = [req.body.subjectgroupID, 0];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    if (data.length === 0) {
      res.status(300).json({ message: "Không có lớp tồn tại" });
    } else {
      res.status(201).json(data);
    }
  });
};

const JoinClassForStudent = (req, res) => {
  const classCode = req.params.classCode;
  const sqlCheck =
    "select subjectGroupID as class from memberinsubject where memberID = ? ";
  const valuesCheck = [req.body.memberID];

  db.query(sqlCheck, valuesCheck, (error, result) => {
    if (error) {
      res.json(error);
    }
    const classCodeExists = result?.some((item) => item.class === classCode);

    console.log(result, "result");
    if (classCodeExists) {
      res.status(208).json({ message: "Đã tham gia lớp học" });
    } else {
      const sql =
        "INSERT INTO memberinsubject(memberClassID, memberID, subjectGroupID) VALUES(UUID(),?,?)";
      const values = [req.body.memberID, classCode];
      db.query(sql, values, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.status(201).json({ message: "Đã thêm vào lớp thành công" });
        }
      });
    }
  });
};

const getAllListSubjectGroup = (req, res) => {
  let sql = "";
  let value = [];
  const role = req.body.role;
  const userID = req.body.userID;
  if (role == "teacher") {
    sql = `select sg.progress, s.subjectID,s.IDSubject,sg.subjectGroupClass, s.subjectName, sg.subjectGroupID, sg.subjectGroupDay, sg.subjectGroupStart, sg.subjectGroupCount, sg.subjectGroupPractice, sg.subjectGroupStatus, sg.subjectGroupSemester, sg.subjectGroupNameGroup, sg.subjectGroupClassName
    from subject s join subjectgroup sg on s.subjectID = sg.subjectID
    join teacher t on t.teacherID = s.teacherID
    where t.teacherID = ? and sg.subjectGroupDelete = ?  and sg.subjectGroupStatus = 1
    group by s.subjectID, s.subjectName, sg.subjectGroupID, sg.subjectGroupDay, sg.subjectGroupStart, sg.subjectGroupCount, sg.subjectGroupPractice, sg.subjectGroupStatus, sg.subjectGroupSemester, sg.subjectGroupNameGroup, sg.subjectGroupClassName , sg.subjectGroupClass, sg.progress;`;
    value = [userID, 0];
  } else {
    sql = `SELECT sg.progress, t.teacherName, s.subjectID, s.teacherID, s.subjectName, s.IDSubject, sg.subjectGroupID, sg.subjectGroupDay, sg.subjectGroupStart, sg.subjectGroupCount, sg.subjectGroupPractice, sg.subjectGroupBlockLeave, sg.subjectGroupBlockLeave, sg.subjectGroupLinkFaceBook, sg.subjectGroupLinkZalo, sg.subjectGroupStatus, sg.subjectGroupSemester, sg.subjectGroupNameGroup, sg.subjectGroupClassName, sg.subjectGroupClass, sg.subjectGroupCredit, sg.subjectGroupSchoolYear
    FROM subjectgroup SG JOIN subject S ON SG.subjectID = S.subjectID
              JOIN memberinsubject MB ON MB.subjectGroupID = SG.subjectGroupID
                        JOIN member M ON M.memberID = MB.memberID
                        JOIN teacher T on T.teacherID = S.teacherID
    WHERE MB.memberID = ? and sg.subjectGroupDelete = ? 
    GROUP by s.subjectID, s.teacherID, s.subjectName, s.IDSubject, sg.subjectGroupID, sg.subjectGroupDay, sg.subjectGroupStart, sg.subjectGroupCount, sg.subjectGroupPractice, sg.subjectGroupBlockLeave, sg.subjectGroupBlockLeave, sg.subjectGroupLinkFaceBook, sg.subjectGroupLinkZalo, sg.subjectGroupStatus, sg.subjectGroupSemester, sg.subjectGroupNameGroup, sg.subjectGroupClassName, sg.subjectGroupClass, sg.subjectGroupCredit, sg.subjectGroupSchoolYear, t.teacherName, sg.progress;`;
    value = [userID, 0];
  }

  db.query(sql, value, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

const getInformationClass = (req, res) => {
  const classCode = req.params.classCode;
  const sql = `select * from subjectgroup sg join subject s on sg.subjectID = s.subjectID where sg.subjectGroupID = ?`;
  const values = [classCode];
  db.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
};

const updateSubjectGroup = (req, res) => {
  // Khai báo biến addedWeeks và removedWeeks
  let addedWeeks, removedWeeks;

  const sql = `

    IF EXISTS (SELECT 1 FROM subjectgroup WHERE subjectGroupID = ?) THEN
        -- Kiểm tra xem có trùng khớp với subjectGroupWeeks không
        IF (SELECT subjectGroupWeeks FROM subjectgroup WHERE subjectGroupID = ?) = ? THEN
            -- Trường hợp trùng khớp, chỉ cần update thông tin bình thường
            UPDATE subjectgroup
            SET
                subjectGroupWeeks = ?,
                subjectGroupDay = ?,
                subjectGroupStart = ?, 
                subjectGroupCount=  ?,
                subjectGroupSemester = ?,
                subjectGroupSchoolYear = ?, 
                subjectGroupPractice = ?,
                subjectGroupCredit=?,
                subjectGroupClass =?,
                subjectGroupNameGroup=?
            WHERE subjectGroupID = ?;
        ELSE
            
            -- Trường hợp có thay đổi về tuần
            -- So sánh để xác định những tuần mới thêm vào hoặc bị xóa
            SET @addedWeeks = (SELECT TRIM(both ',' FROM  ? ) EXCEPT SELECT TRIM(both ',' FROM subjectGroupWeeks) FROM subjectgroup WHERE subjectGroupID = ?);
            SET @removedWeeks = (SELECT TRIM(both ',' FROM ?) EXCEPT SELECT TRIM(both ',' FROM subjectGroupWeeks ) FROM subjectgroup WHERE subjectGroupID = ?);

            -- Update lại subjectGroupWeeks
            UPDATE subjectgroup
            SET subjectGroupWeeks = ?,
                subjectGroupDay = ?,
                subjectGroupStart = ?, 
                subjectGroupCount=  ?,
                subjectGroupSemester = ?,
                subjectGroupSchoolYear = ?, 
                subjectGroupPractice = ?,
                subjectGroupCredit=?,
                subjectGroupClass =?,
                subjectGroupNameGroup=?
            WHERE subjectGroupID = ?;

            -- Thêm mới các tuần vào teachingstatus
              IF @addedWeeks IS NOT NULL THEN
                  -- Split chuỗi thành các giá trị số
                  SET @addedWeeksList = REPLACE(@addedWeeks, ',', "','");
                  SET @addedWeeksList = CONCAT("'", @addedWeeksList, "'");
                  
                  -- Sử dụng FIND_IN_SET để tìm các giá trị
                  SET @n = 1;
                  SET @maxN = LENGTH(@addedWeeksList) - LENGTH(REPLACE(@addedWeeksList, ',', '')) + 1;
                  
                  WHILE @n <= @maxN DO
                      SET @week = SUBSTRING_INDEX(SUBSTRING_INDEX(@addedWeeksList, ',', @n), ',', -1);
                      
                      INSERT INTO teachingstatus (teachingStatusID, week, subjectGroupID)
                      VALUES (UUID(), @week, ?);
                      
                      SET @n = @n + 1;
                  END WHILE;
              END IF;

            

        -- Xóa các tuần khỏi teachingstatus
        -- Xóa các tuần khỏi teachingstatus
        IF @removedWeeks IS NOT NULL THEN
            -- Split chuỗi thành các giá trị số
            SET @removedWeeksList = REPLACE(@removedWeeks, ',', "','");
            SET @removedWeeksList = CONCAT("'", @removedWeeksList, "'");
            
            -- Sử dụng FIND_IN_SET để tìm các giá trị
            SET @n = 1;
            SET @maxN = LENGTH(@removedWeeksList) - LENGTH(REPLACE(@removedWeeksList, ',', '')) + 1;
            
            WHILE @n <= @maxN DO
                SET @week = SUBSTRING_INDEX(SUBSTRING_INDEX(@removedWeeksList, ',', @n), ',', -1);
                
                DELETE FROM teachingstatus WHERE subjectGroupID = ? AND teachingStatusWeek = @week;
                
                SET @n = @n + 1;
            END WHILE;
        END IF;

        END IF;
    END IF;
  `;
  const values = [
    req.body.subjectGroupID,
    req.body.subjectGroupID,
    req.body.subjectGroupWeeks,
    req.body.subjectGroupWeeks,
    req.body.subjectGroupDay,
    req.body.subjectGroupStart,
    req.body.subjectGroupCount,
    req.body.subjectGroupSemester,
    req.body.subjectGroupSchoolYear,
    req.body.subjectGroupPractice,
    req.body.subjectGroupCredit,
    req.body.subjectGroupClass,
    req.body.subjectGroupNameGroup,
    req.body.subjectGroupID,
    req.body.subjectGroupWeeks,
    req.body.subjectGroupID,
    req.body.subjectGroupWeeks,
    req.body.subjectGroupID,

    req.body.subjectGroupWeeks,
    req.body.subjectGroupDay,
    req.body.subjectGroupStart,
    req.body.subjectGroupCount,
    req.body.subjectGroupSemester,
    req.body.subjectGroupSchoolYear,
    req.body.subjectGroupPractice,
    req.body.subjectGroupCredit,
    req.body.subjectGroupClass,
    req.body.subjectGroupNameGroup,
    req.body.subjectGroupID,

    req.body.subjectGroupID,

    req.body.subjectGroupID,

    req.body.subjectGroupID,

    req.body.subjectGroupID,
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      res.json(err);
    }
    res.json(data);
  });
};

const generateRandomString = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";
  const length = 5;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
};

const addSubjectGroup = (req, res) => {
  const checkSubjectSQL =
    "SELECT subjectID as ID FROM subject WHERE IDSubject = ? and teacherID = ?";
  const values = [req.body.IDSubject, req.body.teacherID];

  db.query(checkSubjectSQL, values, (err, data) => {
    if (err) {
      console.error(err);
      res.json({ status: 500, message: "Internal Server Error" });
      return;
    }

    if (data.length === 0) {
      const generatedUUID = uuid.v4();

      console.log("Nhảy vào trường hợp rỗng");
      const insertSubjectSQL =
        "INSERT INTO subject(subjectID, teacherID, subjectName, IDSubject) VALUES (?, ?, ?, ?)";
      const subjectValues = [
        generatedUUID,
        req.body.teacherID,
        req.body.subjectName,
        req.body.IDSubject,
      ];

      db.query(insertSubjectSQL, subjectValues, (error, result) => {
        console.log("Mã subjectID sau khi render: ", generatedUUID);

        if (error) {
          console.error(error);
          res.json({
            status: 500,
            message: "Error while adding a subject",
          });
          return;
        }

        insertSubjectGroup(res, req, generatedUUID);
      });
    } else {
      console.log("rơi vào trường hợp có ID trước");
      const subjectID = data[0].ID;
      console.log("subjectID", subjectID);
      insertSubjectGroup(res, req, subjectID);
    }
  });
};

const insertSubjectGroup = (res, req, subjectID) => {
  const subjectGroupCODE = generateRandomString();

  const checkExist =
    "SELECT s.subjectgroupID FROM subjectgroup s WHERE s.subjectgroupID = ? ";
  const valuesSubjectGroup = [subjectGroupCODE];

  db.query(checkExist, valuesSubjectGroup, (err, data) => {
    if (err) {
      console.error(err);
      res.json({
        status: 500,
        message: "Code subject group is exist",
      });
      return;
    }
    if (data.length === 0) {
      const insertSQL =
        "INSERT INTO subjectgroup(subjectgroupID, subjectID, subjectgroupDay, subjectgroupStart, subjectgroupCount, subjectgroupPractice, subjectgroupStatus, subjectgroupSemester, subjectgroupNameGroup, subjectgroupClassName, subjectgroupCredit, subjectgroupClass, subjectgroupSchoolYear, subjectGroupWeeks) VALUES (?,?,?,?,?,?,?,?,?,?, ?, ?, ?,?)";
      const values = [
        subjectGroupCODE,
        subjectID,
        req.body.subjectgroupDay,
        req.body.subjectgroupStart,
        req.body.subjectgroupCount,
        req.body.subjectgroupPractice,
        1,
        req.body.subjectgroupSemester,
        req.body.subjectgroupNameGroup,
        req.body.subjectgroupClassName,
        req.body.subjectgroupCredit,
        req.body.subjectgroupClass,
        req.body.subjectgroupSchoolYear,
        req.body.subjectGroupWeeks,
      ];

      db.query(insertSQL, values, (error, endResult) => {
        if (error) {
          console.error(error);
          res.json({
            status: 500,
            message: "Error while adding a subject group",
            datas: subjectID,
          });
          return;
        }
        console.log("week", req.body.subjectGroupWeeks);
        const weeks = req.body.subjectGroupWeeks?.split(",").map(Number);
        console.log(weeks, "weeks");

        let completedOps = 0; // Counter for completed operations
        let resSent = false; // Flag to check if res has been sent

        weeks?.forEach((index) => {
          const insertTeachingStatusQuery = `INSERT INTO teachingstatus (teachingStatusID, teachingStatusWeek, subjectGroupID) VALUES (UUID(), ?, ?)`;

          const valuesTeaching = [index, subjectGroupCODE];

          db.query(
            insertTeachingStatusQuery,
            valuesTeaching,
            (errorTeaching, resultsTeaching) => {
              if (errorTeaching) {
                console.error(errorTeaching);

                // Check if res has not been sent before sending
                if (!resSent) {
                  res.json({ message: "Error while adding teaching status" });
                  resSent = true; // Set the flag to true to prevent further res sending
                }

                return;
              }

              completedOps++;

              if (completedOps === weeks.length && !resSent) {
                res.status(200).json({ message: "success" });
                resSent = true; // Set the flag to true to prevent further res sending
              }
            }
          );
        });
      });
    } else {
      insertSubjectGroup(res, req, subjectID);
    }
  });
};

const insertSubjectGroupHand = (res, req, subjectID) => {
  const subjectGroupCODE = generateRandomString();

  const checkExist =
    "SELECT s.subjectgroupID FROM subjectgroup s WHERE s.subjectgroupID = ? ";
  const valuesSubjectGroup = [subjectGroupCODE];

  db.query(checkExist, valuesSubjectGroup, (err, data) => {
    if (err) {
      console.error(err);
      res.json({
        status: 500,
        message: "Code subject group is exist",
      });
      return;
    }
    if (data.length === 0) {
      const weeksString = req.body.subjectGroupWeeks.join(",");
      console.log(weeksString, "weeksString");
      const insertSQL =
        "INSERT INTO subjectgroup(subjectGroupID, subjectID, subjectGroupDay, subjectGroupStart, subjectGroupCount, subjectGroupPractice, subjectGroupStatus, subjectGroupSemester, subjectGroupNameGroup, subjectGroupCredit, subjectGroupClass, subjectGroupSchoolYear, subjectGroupWeeks) VALUES (?,?,?,?,?,?,?,?,?, ?, ?, ?,?)";
      const values = [
        subjectGroupCODE,
        subjectID,
        req.body.subjectGroupDay,
        req.body.subjectGroupStart,
        req.body.subjectGroupCount,
        req.body.subjectGroupPractice,
        1,
        req.body.subjectGroupSemester,
        req.body.subjectGroupNameGroup,
        req.body.subjectGroupCredit,
        req.body.subjectGroupClass,
        req.body.subjectGroupSchoolYear,
        weeksString,
      ];

      db.query(insertSQL, values, (error, endResult) => {
        if (error) {
          console.error(error);
          res.json({
            status: 500,
            message: "Error while adding a subject group",
            datas: subjectID,
          });
          return;
        }
        console.log("week", req.body.subjectGroupWeeks);
        const weeks = req.body.subjectGroupWeeks;

        let completedOps = 0; // Counter for completed operations
        let resSent = false; // Flag to check if res has been sent

        weeks?.forEach((index) => {
          const insertTeachingStatusQuery = `INSERT INTO teachingstatus (teachingStatusID, teachingStatusWeek, subjectGroupID) VALUES (UUID(), ?, ?)`;

          const valuesTeaching = [index, subjectGroupCODE];

          db.query(
            insertTeachingStatusQuery,
            valuesTeaching,
            (errorTeaching, resultsTeaching) => {
              if (errorTeaching) {
                console.error(errorTeaching);

                // Check if res has not been sent before sending
                if (!resSent) {
                  res.json({ message: "Error while adding teaching status" });
                  resSent = true;
                }

                return;
              }

              completedOps++;

              if (completedOps === weeks.length) {
                res.status(200).json({ message: "success" });
                resSent = true;
              }
            }
          );
        });
      });
    } else {
      insertSubjectGroupHand(res, req, subjectID);
    }
  });
};

const getAllSubjectGroup = (req, res) => {
  const sql = `select sg.subjectGroupID , s.subjectName, sg.subjectGroupDay, sg.subjectGroupCount, sg.subjectGroupNameGroup from subjectGroup sg join subject s on sg.subjectID = s.subjectID where s.teacherID = ? and subjectGroupDelete = 0 and sg.subjectGroupStatus = 1`;

  const values = [req.body.teacherID];
  db.query(sql, values, (err, data) => {
    if (err) {
      res.json(err);
    }
    return res.json(data);
  });
};

const outGroup = (req, res) => {
  const subjectGroup = req.params.classCode;
  const sql =
    "DELETE FROM memberinsubject where memberID = ? and subjectGroupID = ?";
  const values = [req.body.memberID, subjectGroup];
  console.log(req.body.memberID, subjectGroup);

  db.query(sql, values, (err, data) => {
    if (err) {
      res.json(err);
    }
    res.json(data);
  });
};

const createClassHand = (req, res) => {
  const sqlFindExist = `select subjectID from subject where IDSubject = ?`;
  const values = [req.body.IDSubject];
  db.query(sqlFindExist, values, (err, data) => {
    if (err) {
      res.json(err);
    }
    if (data.length === 0) {
      const subjectID = uuid.v4();
      const sqlInsertSubject = `insert into subject(subjectID, subjectName, IDSubject, teacherID) VALUES(?,?,?, ?)`;

      const valuesInsertSubject = [
        subjectID,
        req.body.subjectName,
        req.body.IDSubject,
        req.params.teacherID,
      ];

      db.query(sqlInsertSubject, valuesInsertSubject, (error, dataSubject) => {
        if (error) {
          res.json(error);
        } else {
          insertSubjectGroupHand(res, req, subjectID);
        }
      });
    } else {
      const subjectID = data[0].subjectID;
      insertSubjectGroupHand(res, req, subjectID);
    }
  });
};

const getListClassID = (req, res) => {
  const sql = `SELECT sg.subjectGroupID
  FROM subjectgroup SG JOIN subject S ON S.subjectID = SG.subjectID
    where s.teacherID = ? and sg.subjectGroupDelete = 0 and sg.subjectGroupStatus = 1`;

  const values = [req.body.userID];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    return res.json(data);
  });
};

const ngungDayLop = (req, res) => {
  const sql = `update subjectgroup set subjectGroupStatus = ? where subjectGroupID = ?`;
  const values = [0, req.body.subjectGroupID];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    return res.json(data);
  });
};

const xoaLopHoc = (req, res) => {
  const sql = `update subjectgroup set subjectGroupDelete = ? where subjectGroupID = ?`;
  const values = [1, req.body.subjectGroupID];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    return res.json(data);
  });
};

module.exports = {
  getAllListSubjectGroup,
  addSubjectGroup,
  SearchClassCodeForStudent,
  JoinClassForStudent,
  getListClassID,
  outGroup,
  getAllSubjectGroup,
  createClassHand,
  getInformationClass,
  updateSubjectGroup,
  ngungDayLop,
  xoaLopHoc,
};
