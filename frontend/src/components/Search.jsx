import { useState, useEffect } from "react";
import ActionLink from "./ActionLink";

export default function Search({setDataFromSearch}) {
  const [titleFilter, setTitleFilter] = useState(""); // Локальний стан для фільтра

  return (
    <>
      <input  
        className="search-bar"
        type="text"
        placeholder="Search items"
        value={titleFilter} 
        onChange={(e) => {
          setTitleFilter(e.target.value); 
        }}
      />
      <ActionLink titleFilter={titleFilter} setDataFromSearch={setDataFromSearch}/>
    </>
  );
}
