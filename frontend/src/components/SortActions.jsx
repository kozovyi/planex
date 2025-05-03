
export default function SortActions({ sortBy, setSortBy }) {
  return (
    <select id="column-sort-actions" value={sortBy} onChange={(e) => {
      setSortBy(e.target.value);
    }}>
      <option value="">Sort By</option>
      <option value="name">Name</option>
      <option value="created-at">Created At</option>
    </select>
  );
}