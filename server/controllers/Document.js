const db = require("../connect");
const uuid = require("uuid");

const createDocument = (req, res) => {
  const documentID = uuid.v4();

  const sql =
    "INSERT INTO document(documentID,documentName, documentDesc, documentLink ) VALUES(?,?,?, ?)";
  const values = [documentID, req.body.name, req.body.desc, req.body.file];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Lỗi xảy ra khi thêm document" });
    } else {
      const insertPromises = [];
      const dataClass = req.body.subjectGroupID;
      dataClass.forEach((item) => {
        const insertDetail =
          "INSERT INTO documentinclass(documentInClassID, documentID, subjectGroupID) VALUES(UUID(),?,?)";

        const valuesDetail = [documentID, item];

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
            message: "Đã thêm danh sách các bài giảng vào trong lớp",
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ error: "Lỗi xảy ra khi thêm các bài giảng" });
        });
    }
  });
};

const getAllDocument = (req, res) => {
  const sql = `SELECT S.IDSubject, S.subjectName,D.documentID, D.documentName, D.documentLink, D.documentDayCreate, D.documentDesc
    FROM document D JOIN documentinclass DC ON D.documentID = DC.documentID
            JOIN subjectgroup SG ON SG.subjectGroupID = DC.subjectGroupID
                    JOIN subject S ON S.subjectID = SG.subjectID
    WHERE SG.subjectGroupID = ? 
    GROUP BY  D.documentID, D.documentName, D.documentLink, D.documentDayCreate, D.documentDesc;`;

  const values = [req.body.subjectGroupID, 0];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(data);
  });
};

const addDocumentStore = (req, res) => {
  const folderID = uuid.v4();
  const sqlSelect =
    "SELECT * FROM folders where folderName = ? and subjectID = ?";
  const valueSelect = [req.body.folderName, req.body.subjectID];
  db.query(sqlSelect, valueSelect, (er, data1) => {
    if (er) {
      console.log(er);
    }
    if (data1.length === 0) {
      const sql =
        "INSERT INTO folders(folderID, folderName, subjectID) VALUES(?,?,?) ";
      const valuesFolder = [folderID, req.body.folderName, req.body.subjectID];
      db.query(sql, valuesFolder, (err, data) => {
        if (err) {
          res.json(err);
        }

        const documentID = uuid.v4();
        const sqlDocument =
          "INSERT INTO document(documentID, documentLink, folderID, documentName) VALUES(?,?,?, ?)";
        const valuesDocument = [
          documentID,
          req.body.documentLink,
          folderID,
          req.body.documentName,
        ];

        db.query(sqlDocument, valuesDocument, (error, result) => {
          if (error) {
            res.json(error);
          }
          return res.json({ message: "Đã thêm tài liệu thành công" });
        });
      });
    } else {
      const folderGetID = data1[0].folderID;
      const sqlDocument =
        "INSERT INTO document(documentID, documentLink, folderID, documentName) VALUES(UUID(),?,?, ?)";
      const valuesDocument = [
        req.body.file,
        folderGetID,
        req.body.documentName,
      ];

      db.query(sqlDocument, valuesDocument, (error, result) => {
        if (error) {
          res.json(error);
        }
        return res.json({ message: "Đã thêm tài liệu thành công" });
      });
    }
  });
};

const deleteFolder = (req, res) => {
  const sql = "delete from folder where folderID = ?";
  const values = [req.body.folderID];
  db.query(sql, values, (err, data) => {
    if (err) {
      req.json(err);
    }
    return res.status(200).json({ message: " Đã xóa thư mục thành công" });
  });
};

const deleteDocument = (req, res) => {
  const sql = "delete from document where documentID = ?";
  const values = [req.body.documentID];
  db.query(sql, values, (err, data) => {
    if (err) {
      req.json(err);
    }
    return res.status(200).json({ message: " Đã xóa file thành công" });
  });
};

const getStoreDocument = (req, res) => {
  const sql = `SELECT *
  FROM folders F JOIN document D ON F.folderID = D.folderID
          JOIN subject S  ON S.subjectID = F.subjectID
  WHERE S.teacherID = ?`;
  const values = [req.body.teacherID];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    return res.json(data);
  });
};

const shareFileToClass = (req, res) => {
  const dataClass = req.body.subjectGroupID;
  let hasError = false; // Biến kiểm soát lỗi

  dataClass.forEach((item, index) => {
    const sql =
      "INSERT INTO documentinclass(documentInClassID, documentID, subjectGroupID) VALUES(UUID(), ?, ?)";
    const values = [req.body.documentID, item];

    db.query(sql, values, (err, data) => {
      if (err) {
        hasError = true; // Đặt biến hasError thành true nếu có lỗi
        console.error(err);
      }

      // Kiểm tra xem đã xử lý tất cả các lần lặp chưa
      if (index === dataClass.length - 1) {
        // Nếu đang có lỗi, gửi phản hồi về lỗi, ngược lại gửi phản hồi thành công
        if (hasError) {
          res.json({ message: "Có lỗi khi thêm tài liệu cho lớp" });
        } else {
          res
            .status(200)
            .json({ message: "Đã thêm tài liệu cho lớp thành công" });
        }
      }
    });
  });
};

const createFolder = (req, res) => {
  const sql = `insert into folders(folderID, folderName, subjectID) VALUES(UUID(),?,?)`;
  const values = [req.body.folderName, req.body.subjectID];
  console.log(values, 'values')

  db.query(sql, values, (err, data) => {
    if (err) {
      res.json(err);
    }
    res.json(data);
  });
};

module.exports = {
  createDocument,
  getAllDocument,
  addDocumentStore,
  getStoreDocument,
  deleteFolder,
  deleteDocument,
  shareFileToClass,
  createFolder,
};
