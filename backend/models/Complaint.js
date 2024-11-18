const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  trainNo: String,
  coachType: String,
  compartment: String,
  location: String,
  serviceType: String,
  issue: String,
  description: String,
  status: String,
});

module.exports = mongoose.model('Complaint', complaintSchema);
