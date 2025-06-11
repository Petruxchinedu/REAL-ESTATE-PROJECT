const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
// const cookieParser = require('cookie-parser');
const connectDB = require('./db');

const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const savedRoutes = require('./routes/savedRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');
// const inquiryRoutes = require('./routes/inquiryRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const propertyImageRoutes = require('./routes/propertyImageRoutes');
// const reviewRoutes = require('./routes/reviewRoutes');
// const transactionRoutes = require('./routes/transactionRoutes');
// const approvalRoutes = require('./routes/approvalRoutes');


const app = express();

app.use(cors());
// app.use(cookieParser())
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/saved', savedRoutes);
// app.use('/api/booking', bookingRoutes);
// app.use('/api/inquiry', inquiryRoutes);
// app.use('/api/notification', notificationRoutes);
// app.use('/api/review', reviewRoutes);
// app.use('/api/transaction', transactionRoutes);
// app.use('/api/approval', approvalRoutes);
// app.use('/api/proprtyImage', propertyImageRoutes);


app.get('/', (req, res) => {
  res.send('Real Estate API running...');
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
