import { createContext, useState, useEffect } from "react";

export const BoardContext = createContext();

export function BoardProvider({ children }) {
  const [activeBoardId, setActiveBoardId] = useState(() => {
    return localStorage.getItem("active_board") || "";
  });

  useEffect(() => {
    localStorage.setItem("active_board", activeBoardId);
  }, [activeBoardId]);

  return (
    <BoardContext.Provider value={{ activeBoardId, setActiveBoardId }}>
      {children}
    </BoardContext.Provider>
  );
}
