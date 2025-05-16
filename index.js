const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db');

const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const savedRoutes = require('./routes/savedRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/saved', savedRoutes);

app.get('/', (req, res) => {
  res.send('Real Estate API running...');
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
