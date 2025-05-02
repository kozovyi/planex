import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/add-task-form.css';
import axios from 'axios';
import { getAccessToken } from '../utils/helpers';
import Alert from './Alert';

export default function AddTaskForm() {
  const [hasError, setHasError] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [labels, setLabels] = useState('');
  const [status, setStatus] = useState('todo');
  const [success, setSuccess] = useState(false);
  const [boardId, setBoardId] = useState('');

  useEffect(() => {
    const id = localStorage.getItem("active_board");
    if (id) {
      console.log(id)
      setBoardId(id);
    } else {
      console.warn('No active board found in localStorage.');
    }
  }, []);

  function resetFormState() {
    setTitle('');
    setDesc('');
    setLabels('');
    setStatus('todo');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setHasError(false);
    setSuccess(false);

    const token = getAccessToken();
    if (!token || !boardId) {
      setHasError(true);
      return;
    }

    const labelsArray = labels
      .split(',')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const payload = {
      title: title.trim(),
      description: desc.trim(),
      positional_num: 0
    };

    try {
      const boardId = localStorage.getItem("active_board");
      await axios.post(
        `http://127.0.0.1:8000/api/api_v1/task/?board_id=${boardId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      resetFormState();
      setSuccess(true);
    } catch (error) {
      console.error('Error creating task:', error);
      setHasError(true);
    }
  }

  return (
    <>
      {hasError && (
        <Alert
          show={hasError}
          text="Select active board"
          onClick={() => setHasError(false)}
        />
      )}
      {success && (
        <Alert
          show={success}
          text="Task successfully created!"
          onClick={() => setSuccess(false)}
        />
      )}
      <form
        className="add-task-form"
        method="post"
        onSubmit={handleSubmit}
        name="add-task"
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
            title="Comma separated labels"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
          />
        </label>
        <label>Status</label>
        <div>
          <input type="radio" value="todo" checked={status === 'todo'} name="status" id="todo-status" onChange={(e) => setStatus(e.target.value)} />
          <label htmlFor="todo-status">Todo</label>
        </div>
        <div>
          <input type="radio" value="in-progress" checked={status === 'in-progress'} name="status" id="in-progress-status" onChange={(e) => setStatus(e.target.value)} />
          <label htmlFor="in-progress-status">In Progress</label>
        </div>
        <div>
          <input type="radio" value="in-review" checked={status === 'in-review'} name="status" id="in-review-status" onChange={(e) => setStatus(e.target.value)} />
          <label htmlFor="in-review-status">In Review</label>
        </div>
        <div>
          <input type="radio" value="completed" checked={status === 'completed'} name="status" id="completed-status" onChange={(e) => setStatus(e.target.value)} />
          <label htmlFor="completed-status">Completed</label>
        </div>
        <div className="add-task-form-btns">
          <button className="submit-btn" type="submit">
            Create Task
          </button>
          <button className="reset-btn" type="reset" onClick={resetFormState}>
            Reset
          </button>
        </div>
      </form>
    </>
  );
}

AddTaskForm.propTypes = {
};
