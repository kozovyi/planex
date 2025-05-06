import { useEffect, useState } from "react";
import axios from "axios";
import { getAccessToken } from "../utils/helpers";
import PropTypes from "prop-types";

export default function BoardList({ onBoardSelect }) {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState("");

  useEffect(() => {
    const fetchBoards = async () => {
      const token = getAccessToken();
      if (!token) {
        console.warn("No access token found.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/api_v1/board/get-all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedBoards = response.data;
        setBoards(fetchedBoards);

        const activeBoardId = localStorage.getItem("active_board");

        if (activeBoardId && fetchedBoards.some(board => board.id === activeBoardId)) {
          setSelectedBoardId(activeBoardId);
          onBoardSelect(activeBoardId);
        } else if (fetchedBoards.length > 1) {
          const fallbackId = fetchedBoards[0].id;
           
          localStorage.setItem("active_board", fallbackId);
          setSelectedBoardId(fallbackId);
          onBoardSelect(fallbackId);
        } else {
          localStorage.removeItem("active_board");
          setSelectedBoardId("");
          onBoardSelect("");
        }
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    fetchBoards();
  }, [onBoardSelect]);

  const handleChange = (e) => {
    const boardId = e.target.value;
    console.log("Selected board ID:", boardId);
     
    localStorage.setItem("active_board", boardId);
    setSelectedBoardId(boardId);
    onBoardSelect(boardId);
    
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <select id="user-boards" value={selectedBoardId} onChange={handleChange}>
      <option value="">Select board</option>
      {boards.map((board) => (
        <option key={board.id} value={board.id}>
          {board.title}
        </option>
      ))}
    </select>
  );
}

BoardList.defaultProps = {
  onBoardSelect: () => {},
};

BoardList.propTypes = {
  onBoardSelect: PropTypes.func.isRequired,
};