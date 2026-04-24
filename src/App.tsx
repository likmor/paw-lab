import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./Menu";
import Users from "./Users";
import TaskList from "./features/tasks/components/TaskList";
import StoryList from "./features/stories/components/StoryList";
import ProjectList from "./features/projects/components/ProjectList";
import { useAuth } from "./context/authContext";
import type { ReactNode } from "react";
import type { Role } from "./types";
import Login from "./pages/Login";
import Pending from "./pages/Pending";
import Blocked from "./pages/Blocked";

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
          <Route path="/login" element={<Login />} />
          <Route path="/pending" element={<Pending />} />
          <Route path="/blocked" element={<Blocked />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/*" element={<Home />} />
                  <Route path="/home" element={<Home />} />
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
