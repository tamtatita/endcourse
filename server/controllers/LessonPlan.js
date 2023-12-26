const db = require("../connect");
const uuid = require("uuid");

const addLessonPlan = (req, res) => {
  const dataLessonPlan = req.body.data;

  const addLessonPlanSql =
    "INSERT INTO lessonplan (lessonplanID, lessonplanName) VALUES (?,?,? )";
  const UUIDLesson = uuid.v4();
  console.log("Mã Giáo án", UUIDLesson);

  const valuesLesson = [
    UUIDLesson,
    req.body.lessonplanName,
    // req.body.subjectGroupID,
  ];

  db.query(addLessonPlanSql, valuesLesson, (errorPlan, data) => {
    if (errorPlan) {
      console.error("Lỗi khi thêm dữ liệu GIÁO ÁN:", errorPlan);
      res.status(500).json({ message: "Có lỗi xảy ra khi tạo dữ liệu" });
      return;
    }

    // Thêm chương môn
    const idGiaoAn = UUIDLesson;
    console.log("Đã thêm giáo án với id: ", idGiaoAn);
    dataLessonPlan.forEach((item, index) => {
      const UUIDChapter = uuid.v4();

      const sqlAddChapter =
        "INSERT INTO chapterprogress (chapterprogressID, chapterprogressName, chapterprogressIndex, lessonplanID) VALUES (?, ?, ?, ?)";

      const valuesChapter = [
        UUIDChapter,
        item.title,
        index, // Sử dụng chỉ mục của item làm chapterprogressIndex
        idGiaoAn, // Sử dụng idGiaoAn bạn đã lấy từ data.insertId
      ];

      db.query(sqlAddChapter, valuesChapter, (errorChapter, resultIndex) => {
        if (errorChapter) {
          console.error("Lỗi khi thêm chương môn:", errorChapter);
          res.status(500).json({ message: "Có lỗi xảy ra khi tạo dữ liệu" });
        }

        // THÊM CHỈ MỤC
        const idChuongMon = UUIDChapter;
        console.log("Đã thêm chương mới với ID: ", idChuongMon);
        item.children.forEach((chapterIndex, STT) => {
          const IDChapterIndex = uuid.v4();
          const ChapterIndexSQL =
            "INSERT INTO chapterprogressindex (chapterProgressIndexID, chapterProgressIndexName, chapterProgressIndexSTT, chapterProgressID, chapterProgressIndexWeeks) VALUES(?,?,?,?,?)";

          const valuesChapterIndex = [
            IDChapterIndex,
            chapterIndex.subtitle,
            STT,
            idChuongMon,
            chapterIndex.count,
          ];

          db.query(
            ChapterIndexSQL,
            valuesChapterIndex,
            (errorChapterIndex, dataChapterIndex) => {
              if (errorChapterIndex) {
                console.log("Lỗi", errorChapterIndex);
                res
                  .status(500)
                  .json({ message: "Có lỗi xảy ra khi tạo dữ liệu" });
              } else {
                res.json({ message: "Đã tạo giáo án thành công" });
              }
            }
          );
        });
      });
    });
  });
};

const getAllLessonPlan = (req, res) => {
  const sql = `
  SELECT * FROM lessonplan LS join chapterprogress cp on ls.lessonplanID = cp.lessonplanID join chapterprogressindex cpi on cpi.chapterProgressID = cp.chapterProgressID join subjectgroup sg on sg.lessonplanID = ls.lessonplanID WHERE LS.teacherID = ? and sg.subjectGroupID = ?;
  `;

  const values = [req.body.teacherID, req.body.subjectGroupID];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(data);
  });
};

const getAllLessonPlan2 = (req, res) => {
  const sql = `
  SELECT L.lessonplanID, L.lessonplanName, L.lessonplanDayCreate, CP.chapterProgressID, CP.chapterProgressName, CP.chapterProgressStatus, CP.chapterProgressIndex, CPI.chapterProgressIndexID, CPI.chapterProgressIndexName, CPI.chapterProgressIndexSTT, CPI.chapterProgressIndexWeeks
  FROM lessonplan L
                  JOIN chapterprogress CP ON CP.lessonplanID = L.lessonplanID
                  JOIN chapterprogressindex CPI ON CPI.chapterProgressID = CP.chapterProgressID
        WHERE L.teacherID = ?
        GROUP by L.lessonplanID, L.lessonplanName, L.lessonplanDayCreate, CP.chapterProgressID, CP.chapterProgressName, CP.chapterProgressStatus, CP.chapterProgressIndex, CPI.chapterProgressIndexID, CPI.chapterProgressIndexName, CPI.chapterProgressIndexSTT, CPI.chapterProgressIndexWeeks; `;

  const values = [req.body.teacherID];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(data);
  });
};
const checkExistClass = (req, res) => {
  const sql = `select sg.subjectGroupID
  from lessonplan l join subjectgroup sg on l.lessonplanID = sg.lessonplanID
  where l.lessonplanID = ?`;
  const values = [req.body.lessonplanID];
  console.log(values);
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(data);
  });
};

const subscript = (req, res) => {
  const sql = `update subjectgroup set lessonplanID = ? where subjectGroupID = ?`;

  const values = [req.body.lessonplanID, req.body.subjectGroupID];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(data);
  });
};

const unSubscript = (req, res) => {
  const sql = `update subjectgroup set lessonplanID = ? where subjectGroupID = ?`;

  const values = [null, req.body.subjectGroupID];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(data);
  });
};

const getMaxSTTQuery = `
  SELECT MAX(chapterProgressIndex) AS maxSTT
  FROM chapterProgress
  WHERE lessonplanID = ?
`;

const createChapterProgressQuery = `
  INSERT INTO chapterProgress (chapterProgressID, chapterProgressName, chapterProgressIndex, lessonplanID)
  VALUES (?, ?, ?, ?)
`;

const createChapterProgressIndexQuery = `
  INSERT INTO chapterProgressIndex (chapterProgressIndexID, chapterProgressIndexName, chapterProgressIndexSTT, chapterProgressIndexWeeks, chapterProgressID)
  VALUES (?, ?, ?, ?, ?)
`;

const insertLessonPlan = async (req, res) => {
  try {
    const type = req.body.type;
    const items = req.body.items;
    const lessonplanID = req.body.lessonplanID;

    console.log(lessonplanID, "lessonplan id");

    if (type == "part") {
      for (const item of items.items) {
        const { chapterProgressName, chapterProgressSTT } = item;
        const stt = (await getMaxSTT(lessonplanID)) + 1;

        const chapterProgressID = uuid.v4();
        await insertChapterProgress(
          chapterProgressID,
          chapterProgressName,
          chapterProgressSTT || stt,
          lessonplanID
        );

        for (const [STT, listItem] of item.item.entries()) {
          const chapterProgressIndexID = uuid.v4();
          await insertChapterProgressIndex(
            chapterProgressIndexID,
            listItem.chapterProgressIndexName,
            STT,
            listItem.chapterProgressIndexWeeks,
            chapterProgressID
          );
        }
      }

      res.status(200).json({ message: "Chương đã được thêm thành công!" });
    } else {
      // const subjectName = await getSubjectName(req.body.subjectID);
      const lessonPlanID = uuid.v4();

      await insertLessonPlanDetails(
        lessonPlanID,
        req.body.name,
        req.body.teacherID,
        items
      );

      res.status(200).json({ message: "Chương đã được thêm thành công!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
};

const getMaxSTT = async (lessonplanID) => {
  const result = await queryDatabase(getMaxSTTQuery, [lessonplanID]);
  return result[0].maxSTT || 0;
};

const insertChapterProgress = async (
  chapterProgressID,
  chapterProgressName,
  chapterProgressIndex,
  lessonplanID
) => {
  await queryDatabase(createChapterProgressQuery, [
    chapterProgressID,
    chapterProgressName,
    chapterProgressIndex,
    lessonplanID,
  ]);
};

const insertChapterProgressIndex = async (
  chapterProgressIndexID,
  chapterProgressIndexName,
  chapterProgressIndexSTT,
  chapterProgressIndexWeeks,
  chapterProgressID
) => {
  await queryDatabase(createChapterProgressIndexQuery, [
    chapterProgressIndexID,
    chapterProgressIndexName,
    chapterProgressIndexSTT,
    chapterProgressIndexWeeks,
    chapterProgressID,
  ]);
};

const getSubjectName = async (subjectID) => {
  const result = await queryDatabase(
    "SELECT subjectName FROM subject WHERE subjectID = ?",
    [subjectID]
  );
  return result[0]?.subjectName;
};

const insertLessonPlanDetails = async (
  lessonPlanID,
  subjectName,
  teacherID,
  items
) => {
  await queryDatabase(
    "INSERT INTO lessonplan(lessonPlanID, lessonPlanName, teacherID) VALUES(?,?,?)",
    [lessonPlanID, subjectName, teacherID]
  );

  for (const [index, item] of items.items.entries()) {
    const { chapterProgressName } = item;
    console.log(index, "chapterProgressSTT");
    // const stt = (await getMaxSTT(req.body.lessonplanID)) + 1;

    const chapterProgressID = uuid.v4();
    await insertChapterProgress(
      chapterProgressID,
      chapterProgressName,
      index,
      lessonPlanID
    );

    for (const [STT, listItem] of item.list.entries()) {
      const chapterProgressIndexID = uuid.v4();
      await insertChapterProgressIndex(
        chapterProgressIndexID,
        listItem.chapterProgressIndexName,
        STT,
        listItem.chapterProgressIndexWeeks,
        chapterProgressID
      );
    }
  }
};

const queryDatabase = async (query, values) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const deleteChapterIndex = (req, res) => {
  const sql = `delete from chapterprogressindex where chapterProgressIndexID = ?`;
  const values = [req.params.id];
  console.log(values);
  db.query(sql, values, (err, data) => {
    if (err) {
      res.json(err);
    }
    res.json(data);
  });
};

const insertChapterProgresss = (req, res) => {
  const sql = `insert into chapterprogressindex(chapterProgressIndexID, chapterProgressIndexName, chapterProgressIndexWeeks, chapterProgressIndexSTT, chapterProgressID ) values(UUID(), ?,?,?,?)`;
  const values = [req.body.name, req.body.week, 1, req.body.id];
  console.log(values);
  db.query(sql, values, (err, data) => {
    if (err) {
      res.json(err);
    }
    res.json(data);
  });
};

const updateChapterIndex = (req, res) => {
  const sql = `update chapterprogressindex set chapterProgressIndexName = ?, chapterProgressIndexWeeks = ? where chapterProgressIndexID = ?`;
  const values = [req.body.name, req.body.week, req.body.id];
  console.log(values);
  db.query(sql, values, (err, data) => {
    if (err) {
      res.json(err);
    }
    res.json(data);
  });
};

const editChapterProgress = (req, res) => {
  const sql = `update chapterprogress set chapterProgressName = ? where chapterProgressID = ?`;
  const values = [req.body.name, req.body.id];
  console.log(values);
  db.query(sql, values, (err, data) => {
    if (err) {
      res.json(err);
    }
    res.json(data);
  });
};

const deleteChapterProgress = (req, res) => {
  const sql = `delete from chapterprogress where chapterProgressID = ?`;
  const values = [req.params.id];
  console.log(values);
  db.query(sql, values, (err, data) => {
    if (err) {
      res.json(err);
    }
    res.json(data);
  });
};

module.exports = {
  addLessonPlan,
  getAllLessonPlan,
  insertLessonPlan,
  deleteChapterIndex,
  getAllLessonPlan2,
  insertChapterProgress,
  updateChapterIndex,
  editChapterProgress,
  deleteChapterProgress,
  checkExistClass,
  subscript,
  unSubscript,
};
