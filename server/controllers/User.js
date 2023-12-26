const db = require("../connect");
const bcrypt = require("bcryptjs");
const addUser = (req, res) => {
  member;
  let sql = "";
  memberalues = [];
  const { type } = req.params;

  if (type == "teacher") {
    sql = `INSERT INTO teacher (teacherID, teacherName, teacherBirth, teacherEmail, teacherPass) VALUES (?, ?, ?, ?, ?)`;

    values = [
      req.body.teacherID,
      req.body.teacherName,
      req.body.teacherBirth,
      req.body.teacherEmail,
      req.body.teacherPass,
    ];
  } else {
    sql = `INSERT INTO member (memberID, memberName, memberBirth, memberEmail, memberPass) VALUES (?, ?, ?, ?, ?)`;

    values = [
      req.body.memberID,
      req.body.memberName,
      req.body.memberBirth,
      req.body.memberEmail,
      req.body.memberPass,
    ];
  }

  db.query(sql, values, (err, data) => {
    if (err) return res.json(err);
    return res.json({ message: "Đăng ký thành công" });
  });
};

const Login = (req, res) => {
  const role = req.body.role;
  let sql = "";
  let passwordField = "";

  if (role == "teacher") {
    sql = "SELECT * from teacher where teacherEmail = ?";
    passwordField = "teacherPass";
  } else {
    sql = "SELECT * FROM member WHERE memberEmail = ?";
    passwordField = "memberPass";
  }

  const email = req.body.email;
  const password = req.body.password;

  db.query(sql, [email], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }

    if (data.length === 0) {
      res.status(500).json({ message: "Sai email hoặc mật khẩu" });
    } else {
      const user = data[0];
      const hashedPassword = user[passwordField];
      console.log(password, "1");
      console.log(hashedPassword, "2");

      bcrypt.compare(password, hashedPassword, (err, result) => {
        if (err) {
          console.log(err);
          return res.json(err);
        }

        if (result) {
          // Mật khẩu đúng
          res.json(data);
        } else {
          // Mật khẩu sai
          res.status(500).json({ message: "Sai email hoặc mật khẩu 2" });
        }
      });
    }
  });
};

const SignUp = (req, res) => {
  const role = "teacher";
  const email = req.body.email;
  const password = req.body.password; // Lấy mật khẩu từ request

  // Generate a salt to hash the password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }

    // Hash the password using the generated salt
    bcrypt.hash(password, salt, (err, hashedPassword) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }

      let sql = "";
      let checkExist = "";
      let checkEmail = "";

      if (role === "teacher") {
        sql =
          "INSERT INTO teacher(teacherID, teacherName, teacherBirth, teacherEmail, teacherPass) VALUES(UUID(), ?,?,?,?)";
        checkEmail = "SELECT * FROM teacher WHERE teacherEmail = ?";
        // checkExist = "SELECT * FROM member WHERE memberEmail = ?";
      } else {
        sql =
          "INSERT INTO member(memberID, memberName, memberBirth, memberEmail, memberPass) VALUES(UUID(), ?,?,?,?)";
        checkEmail = "SELECT * FROM member WHERE memberEmail = ?";
        checkExist = "SELECT * FROM teacher WHERE teacherEmail = ?";
      }

      // CHECK EMAIL TƯƠNG ỨNG
      db.query(checkEmail, [email], (errEmail, dataEmail) => {
        if (errEmail) {
          console.log(errEmail);
          return res.json(errEmail);
        }

        if (dataEmail.length === 0) {
          // CHECK TRONG BẢNG ĐỐI PHƯƠNG
          // db.query(checkExist, [email], (errEnemy, dataEnemy) => {
          //   if (errEnemy) return res.json(errEnemy);

          // if (dataEnemy.length === 0) {
          const values = [
            req.body.name,
            req.body.birth,
            req.body.email,
            hashedPassword,
          ]; // Sử dụng mật khẩu đã mã hóa

          db.query(sql, values, (errResult, result) => {
            if (errResult) {
              console.log(errResult);
              return res.json(errResult);
            } else {
              return res.status(201).json({ message: "Đã đăng ký thành công" });
            }
          });
          // } else {
          //   return res
          //     .status(300)
          //     .json({ message: "Email đã tồn tại với vai trò khác" });
          // }
          // });
        } else {
          return res.status(401).json({ message: "Email đã tồn tại" });
        }
      });
    });
  });
};

const getUser = (req, res) => {
  const role = req.body.role;
  let sql = "";

  if (role == "teacher") {
    sql = `select * from teacher where teacherID = ?`;
  } else if (role == "member") {
    sql = `select * from member where memberID = ?`;
  }
  const values = [req.body.userID];
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json(data);
  });
};

const editUser = (req, res) => {
  const role = req.body.role;
  let sql = "";
  let values = [];
  if (role == "teacher") {
    sql =
      "update teacher set teacherName = ?, teacherCode=?, teacherBirth=?, teacherSchool=?, teacherSex=?, teacherTelephone=? where teacherID = ?";
    values = [
      req.body.teacherName,
      req.body.teacherCode,
      req.body.teacherBirth,
      req.body.teacherSchool,
      req.body.teacherSex,
      req.body.teacherTelephone,
      req.body.teacherID,
    ];
  } else {
    sql =
      "update member set memberName = ?, MSSV=?, memberBirth=?, memberSchool=?, memberSex=?, memberTelephone=? where memberID = ?";
    values = [
      req.body.memberName,
      req.body.MSSV,
      req.body.memberBirth,
      req.body.memberSchool,
      req.body.memberSex,
      req.body.memberTelephone,
      req.body.memberID,
    ];
  }
  db.query(sql, values, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.status(201).json({ mesage: "đã chỉnh sửa thành công" });
  });
};
module.exports = { addUser, Login, SignUp, getUser, editUser };
