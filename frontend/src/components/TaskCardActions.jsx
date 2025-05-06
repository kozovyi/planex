import { TASK_STATUS } from "../utils/constants";
import { useState } from "react";
import EditTaskForm from "./EditTaskForm";
import Modal from "./Modal";
import { getAccessToken } from "../utils/helpers";

export default function TaskCardActions({ task, onClose, refreshTasks }) {
  const [isEditing, setIsEditing] = useState(false);
  
  const formatStatusForAPI = (status) => {
    const statusMap = {
      'todo': 'Todo',
      'in-progress': 'In Progress',
      'in_progress': 'In Progress',
      'in-review': 'In Review',
      'in_review': 'In Review',
      'completed': 'Completed'
    };
    
    const formattedStatus = statusMap[status.toLowerCase()];
    
    if (!formattedStatus) {
      console.error('Invalid status:', status);
      return status; 
    }
    
    return formattedStatus;
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = getAccessToken();
      const formattedStatus = formatStatusForAPI(newStatus);
  
      const updatedData = {
        title: task.title,
        description: task.description,
        tags: typeof task.tags === 'string' 
          ? task.tags 
          : (Array.isArray(task.tags) 
              ? task.tags.join(" ") 
              : null),
        positional_num: task.positional_num,
        status: formattedStatus
      };
  
      console.log("Sending task update:", updatedData);
  
      const response = await fetch(
        `http://localhost:8000/api/api_v1/task/${taskId}`,
        {
          method: 'PUT',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedData)
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error details:', errorData);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const updatedTask = await response.json();
      console.log('Task status updated:', updatedTask);
  
      if (refreshTasks) refreshTasks();
  
      onClose();
      window.location.reload();
      return updatedTask;
    } catch (error) {
      console.error("Error updating task status:", error);
      return null;
    }
  };
  
  const deleteTask = async (taskId) => {
    try {
      const token = getAccessToken();
      const response = await fetch(
        `http://localhost:8000/api/api_v1/task/${taskId}`,
        {
          method: 'DELETE',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      console.log('Task deleted successfully');
      
      if (refreshTasks) refreshTasks();
      
      onClose();
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      return false;
    }
  };

  const handleEditClose = () => {
    setIsEditing(false);
  };

  if (!task) return null;

  return (
    <>
      <div className="task-card-actions">
        <button
          className="light-control-btn"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <select 
          className="light-control-btn" 
          onChange={(e) => {
            if (e.target.value) {
              updateTaskStatus(task.id, e.target.value);
            }
          }}
          value=""
        >
          <option value="" disabled>Move to...</option>
          {Object.entries(TASK_STATUS).map(([key, value]) => {
            if (value === task.status) return null;
            return (
              <option key={key} value={key}>{value}</option>
            )
          })}
        </select>
        <button 
          className="delete-task-btn" 
          onClick={() => deleteTask(task.id)}
        >
          Delete
        </button>
      </div>
      <Modal
        title="Edit Task"
        content={<EditTaskForm 
          task={task} 
          onClose={handleEditClose} 
          refreshTasks={refreshTasks}
        />}
        isOpen={isEditing}
        onClose={handleEditClose}
      />
    </>
  );
}