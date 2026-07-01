const socket = io();
const chat = document.getElementById('chat');

socket.on('chat', (msg) => {
  const div = document.createElement('div');
  div.className = 'message';
  div.textContent = msg;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

socket.on('status', (online) => {
  document.getElementById('status').textContent =
    online ? '🟢 Online' : '🔴 Offline';
});

document.getElementById('send').onclick = () => {
  const input = document.getElementById('message');

  if (!input.value.trim()) return;

  socket.emit('sendChat', input.value);
  input.value = '';
};

document.getElementById('message')
  .addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('send').click();
    }
  });
