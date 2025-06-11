const mongoose = require('mongoose');
const { Schema } = mongoose;

const approvalSchema = new Schema({
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  moderatorNotes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Approval', approvalSchema);
