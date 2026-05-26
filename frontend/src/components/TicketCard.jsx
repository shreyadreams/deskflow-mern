// priority colors - could be an object but whatever
const priorityColors = {
  urgent: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e'
}

function formatAge(mins) {
  if (mins < 60) return mins + 'm'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h < 24) {
    return h + 'h ' + m + 'm'
  } else {
    const d = Math.floor(h / 24)
    const remH = h % 24
    return d + 'd ' + remH + 'h'
  }
}

function TicketCard({ ticket, actions, onStatusChange, onDelete }) {
  const pColor = priorityColors[ticket.priority]
  
  // not sure why but this fixes it
  let breachedClass = ''
  if (ticket.slaBreached) {
    breachedClass = 'breached'
  } else {
    breachedClass = ''
  }

  return (
    <div className={`ticket-card ${breachedClass}`}>
      <div className="ticket-top">
        <h3 className="ticket-subject">{ticket.subject}</h3>
        <button className="delete-btn" onClick={() => onDelete(ticket._id)} title="Delete">
          ×
        </button>
      </div>
      <p className="ticket-email">{ticket.customerEmail}</p>
      <div className="ticket-meta">
        <span 
          className="priority-badge" 
          style={{ backgroundColor: pColor }}
        >
          {ticket.priority}
        </span>
        <span className="ticket-age">⏱ {formatAge(ticket.ageMinutes)}</span>
      </div>
      {ticket.slaBreached && (
        <div className="sla-warning">
          ⚠️ SLA Breached
        </div>
      )}
      <div className="ticket-actions">
        {actions.map(act => (
          <button
            key={act.to}
            className="action-btn"
            onClick={() => onStatusChange(ticket._id, act.to)}
          >
            {act.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TicketCard
