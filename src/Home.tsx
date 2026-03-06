import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "./api/api";

function Home() {
  const nav = useNavigate();
  const { force } = useParams();
  useEffect(() => {
    const id = api.getActiveProject();
    console.log(force)
    if (id && !Boolean(force)) {
      nav(`project/${id}`);
    }
  }, [force]);

  return <h1>Home</h1>;
}
export default Home;
