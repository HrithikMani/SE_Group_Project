const mongoose = require('mongoose');

const trainDetailsSchema = new mongoose.Schema({
  traintype: String,
});

module.exports = mongoose.model('TrainDetail', trainDetailsSchema);
