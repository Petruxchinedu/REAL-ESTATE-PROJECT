const express = require("express");
const router = express.Router();

const {
  initiatePayment,
  verifyWebhook,
  getUserTransactions,
  getAllTransactions,
} = require("../controllers/transactionController");
const { verifyAdmin } = require("../middlewares/admin");
const { authenticateToken, authorizeAgent } = require("../middlewares/authmiddleware");
const admin = require("../middlewares/admin");

// This route is protected and only requires login
router.post("/pay", authenticateToken, initiatePayment);
router.get("/my-transactions", authenticateToken, getUserTransactions);

// This route requires the user to be both logged in AND an agent
router.get("/agent-dashboard", authenticateToken, authorizeAgent, (req, res) => {
  res.json({ message: "Welcome to the agent dashboard!" });
});
router.get("/", authenticateToken, admin, getAllTransactions);

router.post("/webhook", verifyWebhook);
module.exports = router;
