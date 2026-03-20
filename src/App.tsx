import "./App.css";
import ProjectList from "./ProjectList";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { api } from "./api/api";
import Home from "./Home";
import Menu from "./Menu";
import Users from "./Users";
import TaskList from "./tasks/components/TaskList";
import StoryList from "./stories/StoryList";

function App() {
  return (
    <>
      <BrowserRouter>
        <Menu />

        <h1 className="pb-4 text-2xl">
          user: {api.getUser().name} {api.getUser().surname}
        </h1>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/project/:projectId" element={<StoryList />} />
          <Route
            path="/project/:projectId/story/:storyId"
            element={<TaskList />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
