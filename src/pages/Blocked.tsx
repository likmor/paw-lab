import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

function Blocked() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!user.banned) return <Navigate to="/home" />;
  return <h1>Blocked</h1>;
}
export default Blocked;
