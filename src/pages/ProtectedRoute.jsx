
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const auth = JSON.parse(localStorage.getItem("auth"));

  if (!auth || !auth.isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (auth.role?.toLowerCase() !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
