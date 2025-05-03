import { useState } from "react";
import { getAccessToken } from "../utils/helpers"; // Припустимо, що є функція для отримання токену

export default function ActionLink({ titleFilter }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();

    const token = getAccessToken(); // Отримання токену
    const boardId = localStorage.getItem("active_board"); // Отримання active_board з localStorage

    if (!boardId) {
      console.log("Board ID не знайдено.");
      return;
    }

    const url = `http://127.0.0.1:8000/api/api_v1/task/tasks-by-board-title?title_filter=${titleFilter}&board_id=${boardId}`;

    setLoading(true); // Показуємо, що запит відправляється

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`, // Додаємо токен до заголовків
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Виводимо отримані дані в консоль
      } else {
        console.error("Помилка при отриманні даних:", response.statusText);
      }
    } catch (error) {
      console.error("Запит не вдалося виконати:", error);
    } finally {
      setLoading(false); // Закриваємо індикатор завантаження
    }
  };

  return (
    <button className="search-btn" onClick={handleClick}>
      {<img src="icons8-search-32.png" alt="Search" />}
    </button>
  );
}
