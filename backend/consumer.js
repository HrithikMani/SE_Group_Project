const kafka = require('kafka-node'); // Import kafka-node
const nodemailer = require('nodemailer');

// Kafka Client Configuration
const kafkaClient = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' }); // Adjust host if needed

// Configure MailHog SMTP
const transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025, // MailHog's SMTP port
  ignoreTLS: true,
});

// Kafka Consumer Configuration
const Consumer = kafka.Consumer; // Use the Consumer class from kafka-node
const consumer = new Consumer(
  kafkaClient,
  [{ topic: 'email-service', partition: 0 }], // Adjust the topic name as needed
  { autoCommit: true }
);

consumer.on('message', async (message) => {
  try {
    const emailEvent = JSON.parse(message.value);

    // MailHog Email Options
    const mailOptions = {
      from: 'no-reply@example.com',
      to: emailEvent.to,
      subject: emailEvent.subject,
      text: emailEvent.text,
    };

    // Send email via MailHog
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  } catch (err) {
    console.error('Error processing email event:', err);
  }
});

consumer.on('error', (err) => {
  console.error('Kafka Consumer error:', err);
});

console.log('Kafka Consumer is running and waiting for messages...');
