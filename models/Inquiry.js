const mongoose = require('mongoose');
const { Schema } = mongoose;

const inquirySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'in_progress', 'closed'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
