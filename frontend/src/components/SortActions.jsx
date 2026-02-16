
import React from 'react';

export default function SortActions({ sortBy, setSortBy }) {
  const handleChange = (e) => {
    if (typeof setSortBy === 'function') {
      setSortBy(e.target.value);
    } else {
      console.warn('setSortBy is not a function in SortActions');
    }
  };

  return (
    <select 
      id="column-sort-actions" 
      value={sortBy} 
      onChange={handleChange}
      className="sort-selector"
    >
      <option value="">Sort By</option>
      <option value="title">Name</option>
      <option value="created_at">Created At</option>
    </select>
  );
}