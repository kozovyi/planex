import { useNavigate } from "react-router-dom";
import "../styles/add-task-form.css";

export default function Logout() {
  const navigate = useNavigate();

  return (
    <button
      className="board-btn dlt-board-btn"
      onClick={() => navigate("/login")}
    >
      <img src="icons8-logout-64.png" alt="Search" />
    </button>
  );
}