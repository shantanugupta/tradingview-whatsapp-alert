require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

// Validate required environment variables
const requiredEnvVars = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'RECIPIENT_PHONE_NUMBER'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please create a .env file with the required variables. See README.md for details.');
  process.exit(1);
}

// Initialize Twilio client
let twilioClient;
try {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
} catch (error) {
  console.error('Failed to initialize Twilio client:', error.message);
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    environment: process.env.NODE_ENV,
    twilioConfigured: !!twilioClient
  });
});

// TradingView webhook endpoint
app.post('/tradingview', async (req, res) => {
  try {
    const alertData = req.body;
    
    // Log incoming webhook data
    console.log('Received webhook data:', JSON.stringify(alertData, null, 2));
    
    // Format the message based on TradingView alert data
    const message = formatAlertMessage(alertData);
    
    // Send WhatsApp message
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.RECIPIENT_PHONE_NUMBER
    });

    console.log('Message sent successfully:', result.sid);
    res.status(200).json({ success: true, message: 'Alert sent successfully' });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send alert',
      details: error.message 
    });
  }
});

// Helper function to format alert message
function formatAlertMessage(alertData) {
  // Customize this based on your TradingView alert payload
  return `🔔 TradingView Alert!\n\n` +
         `Symbol: ${alertData.symbol || 'N/A'}\n` +
         `Price: ${alertData.price || 'N/A'}\n` +
         `Action: ${alertData.action || 'N/A'}\n` +
         `Strategy: ${alertData.strategy || 'N/A'}\n` +
         `Time: ${new Date().toISOString()}`;
}

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Health check available at: http://localhost:${port}/health`);
}); 