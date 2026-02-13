// Health check and monitoring server for Queen Angela MD
// This runs alongside the main bot to provide HTTP endpoints
const express = require('express');
const app = express();
const settings = require('./settings');

// Health check endpoint for uptime monitoring
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    bot: 'Queen Angela MD',
    version: '1.0.2',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Queen Angela MD</title>
        <style>
          body {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #e0d4f5;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            text-align: center;
            padding: 50px;
            margin: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.18);
          }
          h1 {
            font-size: 3em;
            margin: 0 0 20px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          }
          .status {
            font-size: 1.2em;
            margin: 10px 0;
          }
          .online {
            color: #4ecca3;
          }
          .info {
            margin: 30px 0;
            padding: 20px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 10px;
          }
          .info-item {
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>👑 Queen Angela MD</h1>
          <p style="font-size: 1.2em;">Your Royal WhatsApp Assistant</p>
          <div class="status">
            Status: <span class="online">🟢 Online</span>
          </div>
          <div class="info">
            <div class="info-item">⏱️ Uptime: ${Math.floor(process.uptime())} seconds</div>
            <div class="info-item">📦 Version: 1.0.2</div>
            <div class="info-item">🔧 Node.js: ${process.version}</div>
          </div>
          <p style="font-size: 0.9em; opacity: 0.7;">
            Health Check: <a href="/health" style="color: #4ecca3;">/health</a>
          </p>
        </div>
      </body>
    </html>
  `);
});

// Webhook endpoint placeholder (if needed for WhatsApp Cloud API)
app.get('/webhook', (req, res) => {
  // Verify webhook
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  const verifyToken = process.env.VERIFY_TOKEN || 'queen_angela_verify';
  
  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook verified successfully!');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', express.json(), (req, res) => {
  console.log('Webhook POST received:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Start HTTP server
const PORT = settings.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`👑 Queen Angela MD - HTTP Server Started`);
  console.log(`${'='.repeat(50)}`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🏠 Home: http://localhost:${PORT}/`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🔗 Webhook: http://localhost:${PORT}/webhook`);
  console.log(`${'='.repeat(50)}\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

// Now load the main bot
console.log('Loading main bot...\n');
require('./index.js');
