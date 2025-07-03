const express = require("express");
const router = express.Router();
const { initiatePayment, verifyWebhook, getUserTransactions, getAllTransactions } = require("../controllers/transactionController");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

// INITIATE PAYMENT
router.post("/pay", auth, initiatePayment);

// PAYSTACK WEBHOOK
router.post("/webhook", verifyWebhook);

// GET MY TRANSACTIONS
router.get("/my", auth, getUserTransactions);

// GET ALL TRANSACTIONS (ADMIN)
router.get("/", auth, admin, getAllTransactions);

module.exports = router;
