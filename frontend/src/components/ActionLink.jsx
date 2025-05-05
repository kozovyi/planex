import { useState } from "react";
import { getAccessToken } from "../utils/helpers"; 

export default function ActionLink({ titleFilter, setDataFromSearch}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();

    const token = getAccessToken(); 
    const boardId = localStorage.getItem("active_board");

    if (!boardId) {
      console.log("Board ID не знайдено.");
      return;
    }

    const url = `http://127.0.0.1:8000/api/api_v1/task/tasks-by-board-title?title_filter=${titleFilter}&board_id=${boardId}`;

    setLoading(true); // Показуємо, що запит 

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`, 
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.removeItem("myTasks");
        localStorage.setItem("myTasks", JSON.stringify(data));
        
      } else {
        console.error("Помилка при отриманні даних:", response.statusText);
      }
    } catch (error) {
      console.error("Запит не вдалося виконати:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <button
      className="search-btn"
      onClick={async (e) => {
        await handleClick(e); 
        setDataFromSearch(1);          
      }}
    >
      {<img src="icons8-search-32.png" alt="Search" />}
    </button>
    
  
    
    </>
  );
}
