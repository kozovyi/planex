import { useState } from "react";
import AddTaskForm from "./AddTaskForm";
import AddBoardForm from "./AddBoardForm";
import AddBoardUser from "./AddBoardUser";
import Modal from "./Modal";
import Search from "./Search";
import BoardList from "./BoardList";
import CopyBoardIdButton from "./CopyBoardIdButton";
import '../styles/add-task-form.css';

export default function Header({ setDataFromSearch }) {
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [isAddingBoardUser, setIsAddingBoardUser] = useState(false);

  return (
    <div className="header">
      <div className="header-inputs">
        <div className="controls">
          <img src="/logo.png" alt="Logo" className="logo" />
          <Search setDataFromSearch={setDataFromSearch} />
          <BoardList onBoardSelect={setSelectedBoardId} />
          <CopyBoardIdButton />
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
      </div>
    </div>
  );
}