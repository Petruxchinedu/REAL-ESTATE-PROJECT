const Transaction = require("../models/Transaction");
const Property = require("../models/Property");
const axios = require("axios");
const crypto = require("crypto");
const Joi = require("joi");

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;

// Schema for payment initiation validation
const paymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  propertyId: Joi.string().required(),
});

exports.initiatePayment = async (req, res) => {
  // Step 1: Validate input
  const { error } = paymentSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { amount, propertyId } = req.body;

  try {
    // Step 2: Check property existence
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ error: "Property not found" });

    // Step 3: Generate unique reference
    const reference = `ref_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

    const payload = {
      email: req.user.email,
      amount: Math.floor(amount * 100), // Paystack requires amount in kobo
      reference,
      metadata: {
        userId: req.user._id.toString(),
        propertyId: property._id.toString(),
      },
    };

    const config = {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
    };

    // Step 4: Call Paystack API
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      payload,
      config
    );

    // Step 5: Save pending transaction
    await Transaction.create({
      user: req.user._id,
      property: propertyId,
      amount,
      reference,
      status: "pending",
    });

    res.json({ authorization_url: response.data.data.authorization_url });
  } catch (err) {
    console.error("Payment init error:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment initialization failed" });
  }
};

exports.verifyWebhook = async (req, res) => {
  const signature = req.headers["x-paystack-signature"];
  const computedHash = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  // Step 1: Validate Paystack signature
  if (computedHash !== signature) {
    return res.status(401).json({ error: "Invalid webhook signature" });
  }

  const event = req.body;

  // Step 2: Handle only successful charge
  if (event.event === "charge.success") {
    const { reference, paid_at, channel, amount } = event.data;

    // Step 3: Update transaction
    const txn = await Transaction.findOne({ reference });
    if (!txn) return res.status(404).json({ error: "Transaction not found" });

    // Prevent duplicate success updates
    if (txn.status !== "success") {
      txn.status = "success";
      txn.paidAt = paid_at || new Date();
      txn.channel = channel;
      txn.amount = amount / 100;
      await txn.save();
    }
  }

  res.sendStatus(200); // Always return 200 for webhook
};

exports.getUserTransactions = async (req, res) => {
  try {
    const txns = await Transaction.find({ user: req.user._id })
      .populate("property")
      .sort({ createdAt: -1 });

    res.json({ txns });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve transactions" });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const txns = await Transaction.find()
      .populate("user", "name email")
      .populate("property", "title price")
      .sort({ createdAt: -1 });

    res.json({ txns });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};
