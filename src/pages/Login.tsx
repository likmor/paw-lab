import { Navigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/authContext";

function Login() {
  const { user, login } = useAuth();

  if (user?.role) {
    return <Navigate to="/home" />;
  }

  return (
    <>
      <h1>Login</h1>
      <GoogleLogin onSuccess={(r) => login(r)}></GoogleLogin>
    </>
  );
}
export default Login;
