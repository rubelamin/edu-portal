import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function PublicRoute() {
  const authDetails = useSelector((state) => state.auth);

  console.log("Public route");
  const isLoggedIn = useAuth();
  return !isLoggedIn ? (
    <Outlet />
  ) : authDetails?.accessToken && authDetails?.user?.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/CoursePlayer" />
  );
}
