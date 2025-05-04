import { useState } from 'react';
import '../styles/add-board-user.css'; 
import axios from 'axios';
import { getAccessToken } from '../utils/helpers';
import Alert from './Alert';

export default function AddBoardUser() {
  const [hasError, setHasError] = useState(false);
  const [boardId, setBoardId] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Error adding permission');

  function resetFormState() {
    setBoardId('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setHasError(false);
    setSuccess(false);

    if (!boardId.trim()) {
      setErrorMessage('Board ID is required');
      setHasError(true);
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setErrorMessage('Authentication token not found');
      setHasError(true);
      return;
    }

    try {
        const response = await axios.post(
        `http://127.0.0.1:8000/api/api_v1/board/add-permission?board_id=${boardId.trim()}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.id) {
        localStorage.setItem("active_board", response.data.id);
      }

      resetFormState();
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error adding board :', error);
      setErrorMessage(error.response?.data?.detail || 'Error adding board');
      setHasError(true);
    }
  }

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
          text="Board successfully added!"
          onClick={() => setSuccess(false)}
        />
      )}
      <form
        className="add-board-user-form"
        method="post"
        onSubmit={handleSubmit}
        name="add-board-user"
      >
        <label>
          Board request link
          <input
            type="text"
            name="boardId"
            value={boardId}
            onChange={(e) => setBoardId(e.target.value)}
            placeholder="Enter request link"
            required
          />
        </label>
        <div className="add-board-user-form-btns">
          <button className="submit-btn" type="submit">
            Join
          </button>
          <button className="reset-btn" type="reset" onClick={resetFormState}>
            Reset
          </button>
        </div>
      </form>
    </>
  );
}