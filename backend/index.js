const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ticketRoutes = require('./routes/tickets');

const app = express();
app.use(cors());
app.use(express.json());

// connect to mongodb
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('db connected'))
  .catch(err => console.log('db error', err));

// TODO: clean later
app.use('/tickets', ticketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('server on ' + PORT));
