function StatsStrip({ stats }) {
  if (!stats) return null

  const { statusCount, priorityCount, breachedCount } = stats
  
  return (
    <div className="stats-strip">
      <div className="stat-card stat-open">
        <span className="stat-num">{statusCount.open}</span>
        <span className="stat-label">Open</span>
      </div>
      <div className="stat-card stat-progress">
        <span className="stat-num">{statusCount.in_progress}</span>
        <span className="stat-label">In Progress</span>
      </div>
      <div className="stat-card stat-resolved">
        <span className="stat-num">{statusCount.resolved}</span>
        <span className="stat-label">Resolved</span>
      </div>
      <div className="stat-card stat-closed">
        <span className="stat-num">{statusCount.closed}</span>
        <span className="stat-label">Closed</span>
      </div>
      <div className="stat-card stat-breached">
        <span className="stat-num">{breachedCount}</span>
        <span className="stat-label">SLA Breached</span>
      </div>
    </div>
  )
}

export default StatsStrip
