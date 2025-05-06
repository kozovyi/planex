import { useState } from 'react';
import '../styles/add-board-form.css'; 
import axios from 'axios';
import { getAccessToken } from '../utils/helpers';
import Alert from './Alert';

export default function AddBoardForm() {
  const [hasError, setHasError] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Error creating board');

  function resetFormState() {
    setName('');
    setDescription('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setHasError(false);
    setSuccess(false);

    const token = getAccessToken();
    if (!token) {
      setErrorMessage('Authentication token not found');
      setHasError(true);
      return;
    }

    const payload = {
      title: name.trim(),
      description: description.trim()
    };

    console.log(payload)

    try {
      const response = await axios.post(
        'http://localhost:8000/api/api_v1/board/',
        payload,
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
      console.error('Error creating board:', error);
      setErrorMessage(error.response?.data?.detail || 'Error creating board');
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
          text="Board successfully created!"
          onClick={() => setSuccess(false)}
        />
      )}
      <form
        className="add-board-form"
        method="post"
        onSubmit={handleSubmit}
        name="add-board"
      >
        <label>
          Name <input 
            type="text" 
            name="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </label>
        <label>
          Description <br />
          <textarea 
            name="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </label>
        <div className="add-board-form-btns">
          <button className="submit-btn" type="submit">
            Create Board
          </button>
          <button className="reset-btn" type="reset" onClick={resetFormState}>
            Reset
          </button>
        </div>
      </form>
    </>
  );
}