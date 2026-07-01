const mineflayer = require('mineflayer');

let bot = null;
let shouldReconnect = false;

function startBot(io) {
  if (bot) return;

  shouldReconnect = true;

  bot = mineflayer.createBot({
    host: 'play.strongcraft.org',
    port: 25565,
    username: 'IAMABOY',
    viewDistance: 2,
    hideErrors: false
  });

  bot.once('spawn', () => {
    console.log('Bot joined!');
    bot.physicsEnabled = false;

    io.emit('status', true);

    setTimeout(() => {
      if (bot) {
        bot.chat('/login SAROJGM1');
      }
    }, 5000);

    (setTimeout(() => {
      if (bot) {
        bot.chat('/go sur');
      }
    }, 10000);
  });

  bot.on('messagestr', (msg) => {
    io.emit('chat', msg);
  });

  bot.on('kicked', (reason) => {
    console.log('Kicked:', reason);
  });

  bot.on('error', (err) => {
    console.log('Bot error:', err);
  });

  bot.on('end', () => {
    console.log('Bot disconnected.');

    bot = null;
    io.emit('status', false);

    if (shouldReconnect) {
      setTimeout(() => {
        startBot(io);
      }, 10000);
    }
  });
}

function stopBot() {
  shouldReconnect = false;

  if (bot) {
    bot.quit();
    bot = null;
  }
}

function getBot() {
  return bot;
}

module.exports = {
  startBot,
  stopBot,
  getBot
};
