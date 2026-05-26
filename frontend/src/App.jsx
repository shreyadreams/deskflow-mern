import { useState, useEffect } from 'react'
import './App.css'
import Board from './components/Board'
import StatsStrip from './components/StatsStrip'
import CreateTicket from './components/CreateTicket'
import Filters from './components/Filters'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [filterPriority, setFilterPriority] = useState('')
  const [showBreachedOnly, setShowBreachedOnly] = useState(false)
  const [loading, setLoading] = useState(true)

  // fetch tickets
  const fetchTickets = async () => {
    try {
      let url = API + '/tickets?'
      if (filterPriority) url = url + 'priority=' + filterPriority + '&'
      if (showBreachedOnly) url += 'breached=true&'
      
      const res = await fetch(url)
      const data = await res.json()
      setTickets(data)
    } catch (err) {
      console.log('fetch error', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch(API + '/tickets/stats')
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.log('stats error', err)
    }
  }

  useEffect(() => {
    fetchTickets()
    fetchStats()
  }, [filterPriority, showBreachedOnly])

  // ye wala part thoda tricky tha
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(API + '/tickets/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        fetchTickets()
        fetchStats()
      } else {
        const errData = await res.json()
        alert(errData.error)
      }
    } catch (err) {
      console.log('update failed', err)
    }
  }

  const handleCreate = async (ticketData) => {
    try {
      const res = await fetch(API + '/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      })
      const data = await res.json()
      if (res.ok) {
        setShowForm(false)
        fetchTickets()
        fetchStats()
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (err) {
      return { success: false, error: 'network error' }
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(API + '/tickets/' + id, { method: 'DELETE' })
      fetchTickets()
      fetchStats()
    } catch (err) {
      console.log('delete err', err)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <h1 className="logo">
            <span className="logo-icon">📋</span> DeskFlow
          </h1>
          <span className="tagline">Support Ticket Triage</span>
        </div>
        <button className="create-btn" onClick={() => setShowForm(true)}>
          + New Ticket
        </button>
      </header>

      {stats && <StatsStrip stats={stats} />}

      <Filters
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        showBreachedOnly={showBreachedOnly}
        setShowBreachedOnly={setShowBreachedOnly}
      />

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading tickets...</p>
        </div>
      ) : (
        <Board
          tickets={tickets}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <CreateTicket
          onClose={() => setShowForm(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  )
}

export default App
