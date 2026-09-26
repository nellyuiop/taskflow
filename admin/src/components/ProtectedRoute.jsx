import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  // Check if the token exists in local storage
  const token = localStorage.getItem("token");

  // If there is a token, render the child routes (via Outlet).
  // If there is NO token, redirect to the login page.
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
