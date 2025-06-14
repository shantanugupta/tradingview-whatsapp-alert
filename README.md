# TradingView WhatsApp Alert Service

This service receives webhook alerts from TradingView and forwards them to WhatsApp using Twilio.

## Features

- Receives POST webhooks from TradingView
- Forwards alerts to WhatsApp via Twilio
- Configurable message templates
- Easy deployment to Render
- Environment variable based configuration

## Prerequisites

- Node.js 14+ installed
- Twilio account with WhatsApp enabled
- TradingView account with alerts configured
- Render account for deployment

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tradingview-whatsapp-alert.git
   cd tradingview-whatsapp-alert
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=whatsapp:+14155238886
   RECIPIENT_PHONE_NUMBER=whatsapp:+1234567890
   PORT=3000
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment to Render

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure the following environment variables in Render:
   - TWILIO_ACCOUNT_SID
   - TWILIO_AUTH_TOKEN
   - TWILIO_PHONE_NUMBER
   - RECIPIENT_PHONE_NUMBER
   - NODE_ENV=production

## TradingView Alert Setup

1. In TradingView, create a new alert
2. In the "Webhook URL" field, enter your deployed service URL + `/tradingview`
   Example: `https://your-app-name.onrender.com/tradingview`
3. Configure the alert message to include the following JSON structure:
   ```json
   {
     "symbol": "{{ticker}}",
     "price": "{{close}}",
     "action": "{{strategy.order.action}}",
     "strategy": "{{strategy.name}}"
   }
   ```

## Security Notes

- Never commit the `.env` file to version control
- Keep your Twilio credentials secure
- Use environment variables for all sensitive information
- The service uses CORS to restrict access

## License

ISC
