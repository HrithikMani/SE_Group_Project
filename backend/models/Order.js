const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    date: String,
    empId: String, 
    itemName: String, 
    price: String, 
    status: String, 
});

module.exports = mongoose.model('Order', OrderSchema);