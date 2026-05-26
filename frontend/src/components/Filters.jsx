function Filters({ filterPriority, setFilterPriority, showBreachedOnly, setShowBreachedOnly }) {
  return (
    <div className="filters-bar">
      <div className="filter-group">
        <label>Priority:</label>
        <select 
          value={filterPriority} 
          onChange={e => setFilterPriority(e.target.value)}
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      <div className="filter-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showBreachedOnly}
            onChange={e => setShowBreachedOnly(e.target.checked)}
          />
          Show SLA Breached Only
        </label>
      </div>
    </div>
  )
}

export default Filters
