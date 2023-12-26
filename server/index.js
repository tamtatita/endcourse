const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const db = require("./connect");
const app = express();
const AnalyticalOverviewRouter = require("./routers/AnalyticalOverviewRouter");
const SubjectGroupRouter = require("./routers/SubjectGroupRouter");
const NoteRouter = require("./routers/NoteRouter");
const ClassDetailRouter = require("./routers/ClassDetailRouter");
const MemberRouter = require("./routers/MemberRouter");
const StudyGroupRouter = require("./routers/StudyGroupRouter");
const UserRouter = require("./routers/UserRouter");
const StudentListRouter = require("./routers/StudentListRouter");
const SubjectRouter = require("./routers/SubjectRouter");
const LessonPlanRouter = require("./routers/LessonPlanRouter");
const PracticeRouter = require("./routers/PracticeRouter");
const DocumentRouter = require("./routers/DocumentRouter");
const ProgressRouter = require("./routers/ProgressRouter");
const LeaveRouter = require("./routers/LeaveRouter");
const FolderRouter = require("./routers/FolderRouter");
const ConfirmationRouter = require("./routers/ConfirmationRouter");
const AnalystProgress = require("./routers/AnalystProgress");

// ===============================================
app.use(cors());
app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "Content-Type",
    "Authorization"
  );
  next();
});

app.use("/total", AnalyticalOverviewRouter);
app.use("/subjectgroup", SubjectGroupRouter);
app.use("/note", NoteRouter);
app.use("/classdetail", ClassDetailRouter);
app.use("/member", MemberRouter);
app.use("/studygroup", StudyGroupRouter);
app.use("/studentlist", StudentListRouter);
app.use("/subject", SubjectRouter);
app.use("/lessonplan", LessonPlanRouter);
app.use("/practice", PracticeRouter);
app.use("/document", DocumentRouter);
app.use("/progress", ProgressRouter);
app.use("/leave", LeaveRouter);
app.use("/folder", FolderRouter);
app.use("/confirmation", ConfirmationRouter);
app.use("/analyst", AnalystProgress);

// ===============================================
// LOGIN, SIGNUP
app.use("/action", UserRouter);

// ===============================================
app.listen(5000, () => {
  console.log("server on 5000");
});
