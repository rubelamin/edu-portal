import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import StudentLogin from "./components/students/StudentLogin";
import StudentRegistration from "./components/students/StudentRegistration";
import AdminLogin from "./components/admin/AdminLogin";
import CoursePlayer from "./components/students/CoursePlayer";
import NavBar from "./components/NavBar";
import PublicRoute from "./components/route/PublicRoute";
import PrivateRoute from "./components/route/PrivateRoute";
import useAuthCheck from "./hooks/useAuthCheck";
import Dashboard from "./components/admin/Dashboard";
import Assignment from "./components/admin/Assignment";
import AssignmentMark from "./components/admin/AssignmentMark";
import Videos from "./components/admin/Videos";
import Quizzes from "./components/admin/Quizzes";
import { useSelector } from "react-redux";
import AddVideo from "./components/admin/AddVideo";
import EditVideo from "./components/admin/EditVideo";
import AddQuize from "./components/admin/quize/AddQuize";
import LeaderBoard from "./components/students/LeaderBoard";

function App() {
  const authChecked = useAuthCheck();
  const auth = useSelector((state) => state.auth);
  const userAuth = auth || {};

  return !authChecked ? (
    <div>Checking authentication...</div>
  ) : (
    <Router>
      <NavBar />

      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<StudentLogin />} />
          <Route
            path="/StudentRegistration"
            element={<StudentRegistration />}
          />
          <Route exact path="/admin" element={<AdminLogin />} />
        </Route>

        {userAuth?.user?.role === "admin" ? (
          <Route element={<PrivateRoute />}>
            <Route index path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/videos" element={<Videos />} />
            <Route path="/admin/assignment" element={<Assignment />} />
            <Route path="/admin/assignmentmark" element={<AssignmentMark />} />
            <Route path="/admin/quizzes" element={<Quizzes />} />
            <Route path="/admin/addvideo" element={<AddVideo />} />
            <Route path="/admin/editvideo/:videoId" element={<EditVideo />} />
            <Route path="/admin/addquize" element={<AddQuize />} />
          </Route>
        ) : (
          <Route element={<PrivateRoute />}>
            <Route index path="/CoursePlayer" element={<CoursePlayer />} />
            <Route path="/LeaderBoard" element={<LeaderBoard />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;
