import { useEffect, useState } from "react";
import axios from "axios";
import { getAccessToken } from "../utils/helpers";

export default function BoardList() {
  const [boards, setBoards] = useState([]);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchBoards = async () => {
      const token = getAccessToken(); 
      if (!token) {
        console.warn("No access token found.");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/api_v1/board/get-all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBoards(response.data);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    fetchBoards();
  }, []);

  return (
    <select id="user-boards" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
      <option value="">Select board</option>
      {boards.map((board) => (
        <option key={board.id} value={board.id}>
          {board.title}
        </option>
      ))}
    </select>
  );
}
