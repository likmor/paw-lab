import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../config";
import { useAuth } from "../context/authContext";

function Home() {
  const { user } = useAuth();
  const { force } = useParams();
  const nav = useNavigate();
  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchActiveProject = async () => {
      const id = await api.getActiveProject(user?.id ?? "");
      if (id && !Boolean(force)) {
        nav(`/project/${id}`);
      }
    };
    fetchActiveProject();
  }, [user, force]);

  return <h1>Home</h1>;
}
export default Home;
