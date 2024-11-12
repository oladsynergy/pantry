import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const SMTP_CONFIG_URL = 'https://license-generator-bucket.s3.dualstack.us-east-2.amazonaws.com/pantry_smtp.json';
const FALLBACK_SMTP_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'oladsynergysolutions@gmail.com',
    pass: 'krxaovegahhvudkt'
  }
};

async function getSmtpConfig() {
  try {
    const response = await fetch(SMTP_CONFIG_URL);
    if (!response.ok) throw new Error('Failed to fetch SMTP config');
    const data = await response.json();
    return {
      host: data.smtp.host,
      port: data.smtp.port,
      auth: {
        user: data.smtp.username,
        pass: data.smtp.password
      }
    };
  } catch (error) {
    console.warn('Failed to load remote SMTP config, using fallback:', error.message);
    return FALLBACK_SMTP_CONFIG;
  }
}

// Create transporter lazily
let transporter = null;

async function getTransporter() {
  if (!transporter) {
    const config = await getSmtpConfig();
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: false,
      auth: config.auth,
      tls: {
        rejectUnauthorized: true
      }
    });
  }
  return transporter;
}

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Feedback route
app.post('/api/feedback', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ 
      message: 'Missing required fields' 
    });
  }

  try {
    const mailer = await getTransporter();
    await mailer.sendMail({
      from: `"${name}" <${email}>`,
      to: 'oladsynergysolutions@gmail.com',
      replyTo: email,
      subject: `Pantry Chef Feedback: ${subject}`,
      html: `
        <h2>New Feedback from Pantry Chef</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    res.status(200).json({ message: 'Feedback sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      message: 'Failed to send feedback', 
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}`);
  console.log(`Feedback endpoint: http://localhost:${PORT}/api/feedback`);
});