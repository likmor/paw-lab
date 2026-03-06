import "./App.css";
import ProjectList from "./ProjectList";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Project from "./Project";
import { api } from "./api/api";
import Home from "./Home";
import Menu from "./Menu";

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
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/project/:id" element={<Project />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
