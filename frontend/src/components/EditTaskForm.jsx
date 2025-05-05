import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/add-task-form.css';
import axios from 'axios';
import { getAccessToken } from '../utils/helpers';
import Alert from './Alert';

export default function EditTaskForm({ task, onClose, refreshTasks }) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Error updating task');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [labels, setLabels] = useState('');
  const [success, setSuccess] = useState(false);

  // Load task data into form fields when the component mounts
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDesc(task.description || '');
      
      // Handle tags based on their format
      if (typeof task.tags === 'string') {
        setLabels(task.tags);
      } else if (Array.isArray(task.tags)) {
        setLabels(task.tags.join(' '));
      } else {
        setLabels('');
      }
    }
  }, [task]);

  function resetFormState() {
    if (task) {
      setTitle(task.title || '');
      setDesc(task.description || '');
      
      if (typeof task.tags === 'string') {
        setLabels(task.tags);
      } else if (Array.isArray(task.tags)) {
        setLabels(task.tags.join(' '));
      } else {
        setLabels('');
      }
    } else {
      setTitle('');
      setDesc('');
      setLabels('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setHasError(false);
    setSuccess(false);

    if (!task || !task.id) {
      setErrorMessage('Task ID is missing');
      setHasError(true);
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setErrorMessage('Authentication token not found');
      setHasError(true);
      return;
    }

    const payload = {
      title: title.trim(),
      description: desc.trim(),
      status: task.status,
      tags: labels.trim(),
      positional_num: task.positional_num || 0
    };

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/api_v1/task/${task.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Task updated successfully:', response.data);
      setSuccess(true);
      
      // Update the task list
      if (refreshTasks) {
        refreshTasks();
      }
      
      // Close the modal after a delay

    } catch (error) {
      console.error('Error updating task:', error);
      setErrorMessage(error.response?.data?.detail || 'Error updating task');
      setHasError(true);
    }
  }

  if (!task) return <div>No task data provided</div>;

  return (
    <>
      {hasError && (
        <Alert
          show={hasError}
          text={errorMessage}
          onClick={() => setHasError(false)}
        />
      )}
      {success && (
        <Alert
          show={success}
          text="Task successfully updated!"
          onClick={() => setSuccess(false)}
        />
      )}
      <form
        className="add-task-form"
        method="post"
        onSubmit={handleSubmit}
        name="edit-task"
      >
        <label>
          Title <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Description <br /><textarea name="desc" value={desc} onChange={(e) => setDesc(e.target.value)} />
        </label>
        <label>
          Labels <br />
          <input
            type="text"
            name="labels"
            title="Space separated labels"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
          />
        </label>
        <div className="add-task-form-btns">
          <button className="submit-btn" type="submit">
            Update Task
          </button>
          <button className="reset-btn" type="reset" onClick={resetFormState}>
            Reset
          </button>
        </div>
      </form>
    </>
  );
}

EditTaskForm.propTypes = {
  task: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  refreshTasks: PropTypes.func
};