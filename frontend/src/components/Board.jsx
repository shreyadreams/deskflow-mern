import TicketCard from './TicketCard'

const columns = [
  { key: 'open', label: 'Open', color: '#6366f1' },
  { key: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { key: 'resolved', label: 'Resolved', color: '#10b981' },
  { key: 'closed', label: 'Closed', color: '#6b7280' },
]

// allowed transitions for buttons
const transitions = {
  open: [{ to: 'in_progress', label: 'Start Progress' }],
  in_progress: [
    { to: 'open', label: '← Reopen' },
    { to: 'resolved', label: 'Resolve →' }
  ],
  resolved: [
    { to: 'in_progress', label: '← Back to Progress' },
    { to: 'closed', label: 'Close →' }
  ],
  closed: []
}

function Board({ tickets, onStatusChange, onDelete }) {
  return (
    <div className="board">
      {columns.map(col => {
        const colTickets = tickets.filter(t => t.status === col.key)
        return (
          <div className="board-column" key={col.key}>
            <div className="column-header" style={{ borderTopColor: col.color }}>
              <span className="column-title">{col.label}</span>
              <span className="column-count">{colTickets.length}</span>
            </div>
            <div className="column-body">
              {colTickets.length === 0 ? (
                <div className="empty-col">No tickets</div>
              ) : (
                colTickets.map(ticket => (
                  <TicketCard
                    key={ticket._id}
                    ticket={ticket}
                    actions={transitions[ticket.status]}
                    onStatusChange={onStatusChange}
                    onDelete={onDelete}
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Board
