


export default function CopyBoardIdButton() {
    const handleCopy = async () => {
      const boardId = localStorage.getItem("active_board");
      if (boardId) {
        try {
          await navigator.clipboard.writeText(boardId);
          alert('Board copied!');
        } catch (err) {
          console.error('Copy error:', err);
          alert('Copy error');
        }
      } else {
        alert('Board not found.');
      }
    };
  
    return (
      <button className="search-btn" onClick={handleCopy}>
        {<img src="public/copy-32.png" alt="Search" />}
      </button>
    );
  }
  