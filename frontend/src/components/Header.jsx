import { useState } from "react";
import { saveIsAddingNewItem, clearBoard, clearLocalStorage } from "../redux/features/task-board-slice";
import { useAppSelector, useAppDispatch } from "../redux/app/hooks";
import AddTaskForm from "./AddTaskForm";
import Modal from "./Modal";
import Search from "./Search";
import SaveFile from "./SaveFile";
import GitHubIcon from "./icons/GithubIcon";
import SortActions from "./SortActions";
import ThemeSwitcher from "./ThemeSwitcher";
import BoardList from "./BoardList";

export default function Header() {
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const taskBoardState = useAppSelector(state => state.taskBoard);
  const dispatch = useAppDispatch();

  return (
    <div className="header">
      <div className="header-inputs">
        <div className="controls">
          <img src="/logo.png" alt="Logo" className="logo" />
          <Search />
          <SortActions />
          <BoardList onBoardSelect={setSelectedBoardId} />
        </div>

        <div style={{ display: 'flex', gap: '.5rem' }}>
          <button
            title="Add Task"
            onClick={() => {
              dispatch(saveIsAddingNewItem(true));
            }}
            className="add-task-btn btn"
          >
            New Task <span className="plus-sign">+</span>
          </button>

          <button
            title="Add Board"
            onClick={() => {
              dispatch(saveIsAddingNewBoard(true));
            }}
            className="add-board-btn btn"
          >
            Add Board <span className="plus-sign">+</span>
          </button>

          <SaveFile />

          <button
            title="Clear task board"
            className="clear-board-btn light-control-btn"
            onClick={() => {
              dispatch(clearBoard());
              dispatch(clearLocalStorage());
            }}
          >
            Clear
          </button>
        </div>

        <Modal
          content={<AddTaskForm boardId={selectedBoardId} />}
          isOpen={taskBoardState.isAddingNewItem}
          title="Add Task"
          onClose={() => dispatch(saveIsAddingNewItem(false))}
        />
      </div>
    </div>
  );
}
