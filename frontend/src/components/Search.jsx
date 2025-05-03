import { useState } from "react";
import ActionLink from "./ActionLink";

export default function Search() {
  const [titleFilter, setTitleFilter] = useState(""); // Локальний стан для фільтра

  return (
    <>
      <input  
        className="search-bar"
        type="text"
        placeholder="Search items"
        value={titleFilter} // Прив'язуємо значення фільтра
        onChange={(e) => {
          setTitleFilter(e.target.value); // Оновлюємо значення фільтра
        }}
      />
      <ActionLink titleFilter={titleFilter} />
    </>
  );
}
