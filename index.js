require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');          // ← add this
const cookieParser = require('cookie-parser'); // ← install or comment out
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const savedRoutes = require('./routes/savedRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const propertyImageRoutes = require('./routes/propertyImageRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const userRoutes = require('./routes/userRoutes');

//middleware
const app = express();
const allowedOrigin = "http://localhost:5173";
app.use(
  cors({ origin: allowedOrigin,
    credentials: true, })
);
// app.options("*", cors()); // preflight support

app.use(cookieParser())
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// //routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/inquiry', inquiryRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/approval', approvalRoutes);
app.use('/api/propertyImage', propertyImageRoutes);

app.use('/api', userRoutes);
app.get('/', (req, res) => {
  res.send('Real Estate API running...');
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
