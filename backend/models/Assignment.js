const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    assignId: String,
    trainNo: String,
    empId: String,
    empName: String,
    coachType: String,
    compartment: String,
    issue: String,
    status: String,
});

module.exports = mongoose.model('Assignment', assignmentSchema);
