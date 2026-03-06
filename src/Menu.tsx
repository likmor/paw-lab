import "./App.css";
import { Link, useNavigate } from "react-router-dom";
import { api } from "./api/api";

function Menu() {
  const nav = useNavigate();
  return (
    <div className="flex justify-center gap-4">
      <h1
        className="text-3xl cursor-pointer"
        onClick={() => {
          api.deleteActiveProject();
          nav("/");
        }}
      >
        Home
      </h1>
      <h1
        className="text-3xl cursor-pointer"
        onClick={() => {
          api.deleteActiveProject();
          nav("/projects");
        }}
      >
        Projects
      </h1>
    </div>
  );
}

export default Menu;
