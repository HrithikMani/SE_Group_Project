const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  empId: { type: String, unique: true},
  password: { type: String},
  role: { type: String},
  manager: String,
  department: String,
  assignstatus: String,
  phone: String,
  birthDate: String,
  empFirstName: String,
  empLastName: String,
  email: String,
  profileImage: String,
  status: String,
  assignstatus: String
});

module.exports = mongoose.model('User', UserSchema);
