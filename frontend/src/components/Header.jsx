import { useState, useEffect } from "react";
import AddTaskForm from "./AddTaskForm";
import AddBoardForm from "./AddBoardForm";
import AddBoardUser from "./AddBoardUser";
import Modal from "./Modal";
import Logout from "./Logout";
import Search from "./Search";
import BoardList from "./BoardList";
import CopyBoardIdButton from "./CopyBoardIdButton";
import UserListModal from "./UserListModal";
import "../styles/add-task-form.css";

export default function Header({ setDataFromSearch }) {
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [isAddingBoardUser, setIsAddingBoardUser] = useState(false);
  const [isViewingUsers, setIsViewingUsers] = useState(false);

  useEffect(() => {
    const currentBoardId = localStorage.getItem("active_board");
    if (currentBoardId) {
      setSelectedBoardId(currentBoardId);
    }
  }, []);

  const handleBoardSelect = (boardId) => {
    setSelectedBoardId(boardId);
     
    localStorage.setItem("active_board", boardId);
  };



  const handleDeleteBoard = async () => {
    if (!selectedBoardId) {
      alert("Please select a board first");
      return;
    }

    if (!confirm("Are you sure you want to delete this board? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/api_v1/board/${selectedBoardId}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete board");
      }

      alert("Board has been successfully deleted");
      
      localStorage.removeItem('active_board');
      window.location.reload();
      
      
      
    } catch (err) {
      console.error("Error deleting board:", err);
      alert("Failed to delete board. Please try again.");
    }
  };



  const handleLeaveBoard = async () => {
    if (!selectedBoardId) {
      alert("Please select a board first");
      return;
    }

    if (!confirm("Are you sure you want to leave this board?")) {
      return;
    }

    try {
      const currentUserEmail = localStorage.getItem("user_email");

      if (!currentUserEmail) {
        alert("User email not found. Please log in again.");
        return;
      }

      const usersResponse = await fetch(
        `http://localhost:8000/api/api_v1/board/by-board?board_id=${selectedBoardId}`
      );

      if (!usersResponse.ok) {
        throw new Error(`Failed to fetch users: ${usersResponse.status}`);
      }

      const usersData = await usersResponse.json();
      const userList = usersData.filter((item) => item.id && item.email);

      const currentUser = userList.find(
        (user) => user.email === currentUserEmail
      );

      if (!currentUser) {
        alert("You are not a member of this board.");
        return;
      }

      const currentUserId = currentUser.id;

      const response = await fetch(
        `http://localhost:8000/api/api_v1/board/delete-user?user_id=${currentUserId}&board_id=${selectedBoardId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to leave board");
      }

      // Успішно вийшли з дошки
      alert(`User ${currentUserEmail} has left the board`);

      // Оновлюємо поточну дошку або очищаємо її

      localStorage.removeItem("active_board");
      setSelectedBoardId("");
      window.location.reload();

      // console.log("-------------------")

      // console.log(`currentBoardId ${localStorage.getItem(currentBoardId)}`)
      // console.log(`active_board ${localStorage.getItem(active_board)}`)
      // console.log(`previous_board ${localStorage.getItem(previous_board)}`)

      // console.log("-------------------")

    } catch (err) {
      console.error("Error leaving board:", err);
      alert("Failed to leave board. Please try again.");
    }
  };

  return (
    <div className="header">
      <div className="header-inputs">
        <div className="controls">
          <img src="/logo.png" alt="Logo" className="logo" />
          <Search setDataFromSearch={setDataFromSearch} />

          <BoardList onBoardSelect={handleBoardSelect} />

          <CopyBoardIdButton />

          <button
            className="search-btn people-btn"
            onClick={async (e) => {
              setIsViewingUsers(true);
            }}
          >
            {<img src="group-64.png" alt="Users" />}
          </button>

          <button
            className="search-btn leave-btn"
            onClick={handleLeaveBoard}
            title="Leave board"
          >
            {<img src="icons8-exit-50.png" alt="Leave" />}
          </button>
        </div>

        <div style={{ display: "flex", gap: ".5rem" }}>
          <button
            title="Add Task"
            onClick={() => setIsAddingTask(true)}
            className="add-task-btn btn"
          >
            New Task <span className="plus-sign">+</span>
          </button>

          <button
            title="Add Board"
            onClick={() => setIsAddingBoard(true)}
            className="add-board-btn btn"
          >
            Add Board <span className="plus-sign">+</span>
          </button>

          <button
            title="Join Board"
            className="board-btn"
            onClick={() => setIsAddingBoardUser(true)}
          >
            +
          </button>

          
          <button
            className="board-btn dlt-board-btn"
            onClick={handleDeleteBoard}
            title="Delete board"
          >
            {<img src="icons8-delete-60.png" alt="Delete" />}
          </button>

          <Logout>
          </Logout>




        </div>

        <Modal
          content={<AddTaskForm boardId={selectedBoardId} />}
          isOpen={isAddingTask}
          title="Add Task"
          onClose={() => setIsAddingTask(false)}
        />

        <Modal
          content={<AddBoardForm />}
          isOpen={isAddingBoard}
          title="Add Board"
          onClose={() => setIsAddingBoard(false)}
          height={400}
        />

        <Modal
          content={<AddBoardUser />}
          isOpen={isAddingBoardUser}
          title="Join to board"
          onClose={() => setIsAddingBoardUser(false)}
          height={250}
        />

        <UserListModal
          isOpen={isViewingUsers}
          onClose={() => setIsViewingUsers(false)}
          boardId={selectedBoardId}
        />
      </div>
    </div>
  );
}
