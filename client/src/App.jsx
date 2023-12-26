import { useContext, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  // Redirect,
  useNavigate,
} from "react-router-dom";
// import { AuthContext } from "./contexts/AuthContext";
import {
  ClassAddTeacher,
  ClassroomStudent,
  ClassroomTeacher,
  HomePageStudent,
  HomePageTeacher,
  LessonPlanTeacher,
  LessonTeacher,
  Login,
  NotFound,
  PracticesPage,
  ProgressSubjectGroupTeacher,
  SchedulesTeacher,
  Signup,
  StatisticalTeacher,
  User,
} from "./Pages";
import { useAuth } from "./contexts/AuthContext";
import ClassDetailStudent from "./Pages/ClassDetail/ClassDetailStudent";
import ClassDetailTeacher from "./Pages/ClassDetail/ClassDetailTeacher";
import { useSelector } from "react-redux";

function App() {
  const currentUser = useSelector((state) => state.user);
  const user = currentUser ? currentUser[0] : null;
  console.log(user, "app");
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={
            user !== null && user !== undefined ? (
              user && user.role === "member" ? (
                <HomePageStudent />
              ) : (
                <HomePageTeacher />
              )
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/class"
          element={
            user !== null && user !== undefined ? (
              user && user.role === "member" ? (
                <ClassroomStudent />
              ) : (
                <ClassroomTeacher />
              )
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/class/:classCode"
          element={
            user !== null && user !== undefined ? (
              user && user.role === "member" ? (
                <ClassDetailStudent />
              ) : (
                <ClassDetailTeacher />
              )
            ) : (
              <Login />
            )
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user" element={<User />} />
        <Route path="*" element={<NotFound />} />

        {user && user.role == "teacher" && user !== undefined ? (
          <>
            <Route path="/class/add" element={<ClassAddTeacher />} />
            <Route path="/lessonplan" element={<LessonPlanTeacher />} />
            <Route path="/progress" element={<ProgressSubjectGroupTeacher />} />
            <Route path="/schedules" element={<SchedulesTeacher />} />
            <Route path="/statistical" element={<StatisticalTeacher />} />
            <Route path="/practices" element={<PracticesPage />} />
            <Route path="/lesson" element={<LessonTeacher />} />
          </>
        ) : (
          <Route path="/login" element={<Login />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
