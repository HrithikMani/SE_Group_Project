require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Complaint=require('./models/Complaint');
const Assignment=require('./models/Assignment');
const User=require('./models/User');
const Order=require('./models/Order');
const TrainDetail = require('./models/TrainDetail')
const Train=require('./models/Train');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const session = require('express-session');


const app = express();
// Middleware to parse JSON and form data
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true
}));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});

// MongoDB Atlas connection URI
const dbURI = 'mongodb+srv://root:railcarcaredb@railcarcaredb.wrd5p.mongodb.net/?retryWrites=true&w=majority&appName=railcarcaredb';

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

// API endpoint to handle form submission
app.post('/submit-complaint', async (req, res) => {

  try {
    const newComplaint = new Complaint(req.body);
    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint); // Sending back the saved complaint as a JSON response
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/create-employee', async (req, res) => {
  const {empId, department, role, manager, email, empFirstName, empLastName, password} = req.body;
  console.log(manager);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new employee instance
    const newEmployee = new User({
      empId: empId,
      department: department,
      role: role,
      manager: manager,
      email: email,
      empFirstName: empFirstName,
      empLastName: empLastName,
      password: hashedPassword,
      status: 'active',
      assignstatus: 'unassign'
    });
    const updatedUser = newEmployee.save();

    // Send a welcome email to the employee
    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: 'Welcome to the Company!',
      text: `Dear ${empFirstName},\n\nWelcome to our company! Your employee ID is ${empId} and password: ${password}.\n\nBest regards,\nThe Company Team`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    // Respond with the created employee
    res.status(200).send(newEmployee);
  } catch (error) {
    console.error('Error creating employee:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/assign-order', async (req, res) => {
  try {
    const newAssignment = new Assignment(req.body);
    const savedAssignment = await newAssignment.save();
    res.status(201).json(savedAssignment); // Sending back the saved complaint as a JSON response
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/add-order', async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder); // Sending back the saved complaint as a JSON response
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/get-assigned-tasks', async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/get-orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/get-orders-emp', async (req, res) => {
  const {user} =req.body;
  try {
    const orders = await Order.find({empId: {$eq: user}});
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/get-complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/get-unassigned-complaints', async (req, res) => {
  const status = 'open';
  try {
    const complaints = await Complaint.find({status: {$eq: status}});
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/get-technicians', async (req, res) => {
  const {user} = req.body;
  try {
    const users = await User.find({assignstatus: {$eq: 'unassign'}, manager:{$eq: user}});
    res.json(users);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/update-complaint-assign',async (req, res) => {
  try {
    const {trainNo, compartment, status} = req.body;


    // Find the user by ID and update the specified fields
    const updatedComplaint = await Complaint.findOneAndUpdate(
      { trainNo: {$eq : trainNo}, compartment: {$eq: compartment}},
      { $set: {status: status} },
      { new: true }
    );

    if (updatedComplaint) {
      res.json(updatedComplaint);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
