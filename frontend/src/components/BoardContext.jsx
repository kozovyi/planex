import { createContext, useState, useEffect } from "react";

export const BoardContext = createContext();

export function BoardProvider({ children }) {
  const [activeBoardId, setActiveBoardId] = useState(() => {
    return localStorage.getItem("active_board") || "";
  });

  useEffect(() => {
    const previousBoardId = localStorage.getItem("active_board");
    
    if (previousBoardId && previousBoardId !== activeBoardId) {
      localStorage.setItem("previous_board", previousBoardId);
    }

     
    localStorage.setItem("active_board", activeBoardId);

    console.log("-------------------")
    console.log("-------------------")

  }, [activeBoardId]);

  return (
    <BoardContext.Provider value={{ activeBoardId, setActiveBoardId }}>
      {children}
    </BoardContext.Provider>
  );
}
