import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function Pending() {
  const { user } = useAuth();

  if (user?.role !== "guest") {
    return <Navigate to="/home" />;
  }

  return <h1>Pending</h1>;
}
export default Pending;
