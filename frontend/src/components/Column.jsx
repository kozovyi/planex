import { useDrop } from 'react-dnd';
import { ITEM_TYPE } from '../utils/constants';
import { useEffect, useState } from 'react';
import Tasks from './Tasks';
import { getAccessToken } from "../utils/helpers";

export default function Column({ column, activeBoardId }) {
  const [columnTasks, setColumnTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [theme] = useState('light');
  const [searchTerm] = useState('');
  const [sortBy] = useState('created-at');

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
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
    };

    fetchTasks();
  }, [activeBoardId]);

  // Filter and sort tasks for this column
  useEffect(() => {
    const tasksForColumn = allTasks.filter(task => 
      task.status === column.label  // Точне співпадіння зі статусами API
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

  // Update task status when dropped to a different column
  const updateTaskStatus = async (taskId, newStatus, originalTask) => {
    try {
      const token = getAccessToken();
      const formatStatusForAPI = (status) => {
        console.log(status)
        console.log("---------")
        const statusMap = {
          'todo': 'Todo',
          'in-progress': 'In Progress',
          'in_progress': 'In Progress',
          'in-review': 'In Review',
          'in_review': 'In Review',
          'completed': 'Completed'
        };
        if (statusMap[status.toLowerCase()]) {
          return statusMap[status.toLowerCase()];
        }
        return status
          .replace(/[_-]/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      };
  
      const formattedStatus = formatStatusForAPI(newStatus);
      console.log("---------")
      console.log(formattedStatus)
      const response = await fetch(
        `http://127.0.0.1:8000/api/api_v1/task/${taskId}`,
        {
          method: 'PATCH',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...originalTask,
            status: formattedStatus,
          })
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const updatedTask = await response.json();
  
      setAllTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: formattedStatus } : task
        )
      );
  
      return updatedTask;
    } catch (error) {
      console.error("Error updating task status:", error);
      return null;
    }
  };
  

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: ITEM_TYPE.TASK,
    drop: () => {
      if (currentTask && currentTask.status !== column.label) {
        updateTaskStatus(currentTask.id, column.label, currentTask); // FIX
      }
    },
    collect: monitor => ({
      isOver: Boolean(monitor.isOver()),
    }),
  }), [currentTask, column.label]);

  const themes = {
    background: theme === 'dark' ? '#161616' : '#252525',
  };

  return (
    <div className="board-column" ref={dropRef} style={{
      background: isOver && themes.background,
    }}>
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
      />
    </div>
  );
}