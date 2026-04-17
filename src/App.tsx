import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Home";
import Menu from "./Menu";
import Users from "./Users";
import TaskList from "./tasks/components/TaskList";
import StoryList from "./stories/StoryList";
import ProjectList from "./projects/ProjectList";
import { useAuth } from "./context/authContext";
import type { ReactNode } from "react";
import type { Role } from "./types";
import { GoogleLogin } from "@react-oauth/google";

function App() {
  const user = useAuth();
  if (user.loading) {
    return "Loading";
  }
  return (
    <>
      <BrowserRouter>
        <Menu />
        <Routes>
          <Route
            path="/login"
            element={
              <GoogleLogin onSuccess={(r) => user.login(r)}></GoogleLogin>
            }
          />
          <Route
            path="/pending"
            element={"oczekiwanie na zatwierdzenie konta"}
          />
          <Route path="/blocked" element={"konto jest zablokowane"} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/projects" element={<ProjectList />} />
                  <Route path="/projects" element={<ProjectList />} />
                  <Route path="/project/:projectId" element={<StoryList />} />
                  <Route
                    path="/project/:projectId/story/:storyId"
                    element={<TaskList />}
                  />
                  <Route
                    path="/users"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <Users />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: Role[];
};

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.banned) return <Navigate to="/blocked" />;
  if (user.role === "guest") return <Navigate to="/pending" />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/home" />;

  return <>{children}</>;
}
