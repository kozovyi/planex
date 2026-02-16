import './styles/globals.css'
import { useState, useEffect } from "react";
import TaskBoard from './components/TaskBoard'
import Header from './components/Header'
import Footer from './components/Footer'
import LoginPage from './components/LoginPage'
import { Routes, Route } from 'react-router-dom'
import { useAppDispatch } from './redux/app/hooks'
import { getStoredTaskBoard } from './utils/localStorage'
import { saveBoard } from './redux/features/task-board-slice'
import { BoardProvider } from "./components/BoardContext";

export default function App() {
  const dispatch = useAppDispatch();
  const existingTasks = getStoredTaskBoard();
  const [checkDataFromSearch, setDataFromSearch] = useState(0); 



  if (existingTasks) {
    dispatch(saveBoard(existingTasks));
  }


  return (
    <BoardProvider>

    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <div className="task-board-app">
          <Header setDataFromSearch={setDataFromSearch}/>
          <TaskBoard setDataFromSearch={setDataFromSearch} checkDataFromSearch={checkDataFromSearch} />
          <Footer />
        </div>
      } />
    </Routes>
      </BoardProvider>
  );
}
