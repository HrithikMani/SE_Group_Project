const mongoose = require('mongoose');

const TrainSchema = new mongoose.Schema({
  trainNo: String,
  traintype: String
});

module.exports = mongoose.model('Train', TrainSchema);
