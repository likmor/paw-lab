import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Menu from "./Menu";
import Users from "./Users";
import TaskList from "./tasks/components/TaskList";
import StoryList from "./stories/StoryList";
import ProjectList from "./projects/ProjectList";

function App() {
  return (
    <>
      <BrowserRouter>
        <Menu />
        <Routes>
          <Route path="/*" element={<Home />} />
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
