import { useEffect, useState, useCallback } from 'react';
import Tasks from './Tasks';
import { getAccessToken } from "../utils/helpers";

export default function Column({ column, activeBoardId }) {
  const [columnTasks, setColumnTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [searchTerm] = useState('');
  const [sortBy] = useState('created-at');

  const fetchTasks = useCallback(async () => {
    try {
      if (!activeBoardId) return;
      
      const token = getAccessToken();
      const response = await fetch(
        `http://127.0.0.1:8000/api/api_v1/task/tasks-by-board?board_id=${activeBoardId}`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setAllTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [activeBoardId]);

  // Виклик fetchTasks при першому рендері
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Фільтрація та сортування задач для цієї колонки
  useEffect(() => {
    const tasksForColumn = allTasks.filter(task => 
      task.status === column.label
    );
    
    const filtered = tasksForColumn.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    function sort(a, b) {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'created-at':
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    }
    
    const sorted = filtered.sort(sort);
    setColumnTasks(sorted);
  }, [allTasks, column.label, searchTerm, sortBy]);

  return (
    <div className="board-column">
      <div className="column-header">
        <div className="column-identifier">{column.label} <span>{column.emoji}</span></div>
        <span className="column-count">
          {columnTasks?.length}
        </span>
      </div>
      <Tasks
        tasks={columnTasks}
        columnName={column.label}
        setCurrentTask={setCurrentTask}
        fetchTasks={fetchTasks} // Передаємо функцію для оновлення задач
      />
    </div>
  );
}