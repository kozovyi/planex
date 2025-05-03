import { TASK_STATUS } from "../utils/constants";
import { useState } from "react";
import AddTaskForm from "./AddTaskForm";
import Modal from "./Modal";
import { getAccessToken } from "../utils/helpers";

export default function TaskCardActions({ task, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = getAccessToken();
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
            status: newStatus
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const updatedTask = await response.json();
      console.log('Task status updated:', updatedTask);
      
      // After successful update, we would refresh the task list
      // This would typically be handled by a state update in a parent component
      // or by context in a larger application
      
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
        `http://127.0.0.1:8000/api/api_v1/task/${taskId}`,
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
      
      // Close modal after deleting
      onClose();
      
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      return false;
    }
  };

  if (!task) return null;

  return (
    <>
      <div className="task-card-actions">
        <button
          className="light-control-btn"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          Edit
        </button>
        <select 
          className="light-control-btn" 
          onChange={(e) => {
            if (e.target.value) {
              updateTaskStatus(task.id, e.target.value);
              onClose(); // Close modal after update
            }
          }}
        >
          <option value="" key="move-to-label">Move</option>
          {Object.keys(TASK_STATUS).map((key, i) => {
            if (TASK_STATUS[key] === task?.status) {
              return null;
            }
            return (
              <option key={i} value={key}>{TASK_STATUS[key]}</option>
            )
          })}
        </select>
        <button 
          className="delete-task-btn" 
          title="delete task" 
          onClick={() => {
            deleteTask(task.id);
          }}
        >
          Delete
        </button>
      </div>
      <Modal
        title="Edit Task"
        content={<AddTaskForm task={task} isEditing={true} onSave={() => {
          setIsEditing(false);
          onClose();
        }} />}
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
        }}
      />
    </>
  )
}