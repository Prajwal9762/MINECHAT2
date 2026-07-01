const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { startBot, stopBot, getBot } = require('./bot');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/start', (req, res) => {
  startBot(io);
  res.send('Bot started');
});

app.get('/stop', (req, res) => {
  stopBot();
  io.emit('status', false);
  res.send('Bot stopped');
});

io.on('connection', (socket) => {
  socket.emit('status', !!getBot());

  socket.on('sendChat', (msg) => {
    const bot = getBot();
    if (!bot) return;

    if (msg.trim()) {
      bot.chat(msg);
      io.emit('chat', `[You] ${msg}`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Dashboard running on ${PORT}`);
  startBot(io); // Auto-start the bot
});
