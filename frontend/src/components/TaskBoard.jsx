import { GRID_LABELS } from '../utils/constants';
import Column from './Column';
import '../styles/task-list.css';
import '../styles/task-grid.css';
import { useState, useEffect } from 'react';

export default function TaskBoard() {
  const [activeBoardId, setActiveBoardId] = useState(localStorage.getItem("active_board"));

  // Слухаємо зміни в localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setActiveBoardId(localStorage.getItem("active_board"));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <section className="task-board">
      {GRID_LABELS.map((column, i) => (
        <Column
          key={i}
          column={column}
          activeBoardId={activeBoardId}  // Передаємо activeBoardId як пропс
        />
      ))}
    </section>
  );
}