const mongoose = require('mongoose');
const { Schema } = mongoose;

const propertyImageSchema = new Schema({
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  imageUrl: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PropertyImage', propertyImageSchema);
