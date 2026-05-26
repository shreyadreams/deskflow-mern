const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// SLA targets in hours
const slaTargets = {
  urgent: 1,
  high: 4,
  medium: 24,
  low: 72
};

// allowed transitions
const allowedNext = {
  open: ['in_progress'],
  in_progress: ['open', 'resolved'],
  resolved: ['in_progress', 'closed'],
  closed: []
};

function getAgeMinutes(ticket) {
  const end = ticket.resolvedAt || new Date();
  return Math.floor((end - ticket.createdAt) / 60000);
}

function getSlaBreached(ticket) {
  var targetMs = slaTargets[ticket.priority] * 60 * 60 * 1000;
  const end = ticket.resolvedAt || new Date();
  // check if exceeded target
  if (ticket.status === 'closed') return false;
  return (end - ticket.createdAt) > targetMs;
}

function formatTicket(t) {
  const obj = t.toObject();
  obj.ageMinutes = getAgeMinutes(t);
  obj.slaBreached = getSlaBreached(t);
  return obj;
}

// POST /tickets
router.post('/', async (req, res) => {
  try {
    console.log("ticket data", req.body);
    const { subject, description, customerEmail, priority } = req.body;
    
    if (!subject || !description || !customerEmail || !priority) {
      return res.status(400).json({ 
        error: "all fields required" 
      });
    }

    var ticket = new Ticket({ 
      subject, description, customerEmail, priority 
    });
    await ticket.save();
    res.status(201).json(formatTicket(ticket));
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).json({ error: e.message });
    }
    res.status(500).json({ error: e.message });
  }
});

// GET /tickets
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.priority) query.priority = req.query.priority;
    
    // const t = await Ticket.find() -- old way
    let tickets = await Ticket.find(query).sort({ createdAt: -1 });
    
    let result = tickets.map(formatTicket);
    
    // edge case handle kiya
    if (req.query.breached === 'true') {
      result = result.filter(t => t.slaBreached === true);
    }
    
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /tickets/:id
router.patch('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "ticket not found" });
    }

    const newStatus = req.body.status;
    
    if (newStatus) {
      const allowed = allowedNext[ticket.status];
      if (!allowed.includes(newStatus)) {
        return res.status(400).json({ 
          error: `transition from ${ticket.status} to ${newStatus} not allowed` 
        });
      }

      // handle resolvedAt
      if (newStatus === 'resolved') {
        ticket.resolvedAt = new Date();
      } else if (ticket.status === 'resolved') {
        // not sure why but this fixes it
        ticket.resolvedAt = null;
      }
      
      ticket.status = newStatus;
    }

    await ticket.save();
    res.json(formatTicket(ticket));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /tickets/:id
router.delete('/:id', async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: "deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /tickets/stats
router.get('/stats', async (req, res) => {
  try {
    const all = await Ticket.find();
    
    const statusCount = { open: 0, in_progress: 0, 
      resolved: 0, closed: 0 };
    const priorityCount = { low: 0, medium: 0, 
      high: 0, urgent: 0 };
    let breachedCount = 0;

    all.forEach(t => {
      statusCount[t.status]++;
      priorityCount[t.priority]++;
      if (getSlaBreached(t)) breachedCount++;
    });

    res.json({ statusCount, priorityCount, breachedCount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
