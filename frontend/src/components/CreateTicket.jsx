import { useState } from 'react'

function CreateTicket({ onClose, onCreate }) {
  const [subject, setSubject] = useState('')
  const [desc, setDesc] = useState('')
  const [email, setEmail] = useState('')
  const [priority, setPriority] = useState('medium')
  const [err, setErr] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')

    // basic validation
    if (!subject.trim() || !desc.trim() || !email.trim()) {
      setErr('all fields are required')
      return
    }

    // email check - ye wala part thoda tricky tha
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      setErr('invalid email format')
      return
    }

    setSubmitting(true)
    const result = await onCreate({
      subject: subject.trim(),
      description: desc.trim(),
      customerEmail: email.trim(),
      priority
    })

    if (result.success) {
      // done
    } else {
      setErr(result.error || 'something went wrong')
    }
    setSubmitting(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Ticket</h2>
          <button className="close-modal" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="ticket-form">
          {err && <div className="form-error">{err}</div>}
          
          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Brief description of the issue"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Detailed explanation..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Customer Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="customer@example.com"
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Ticket'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateTicket
