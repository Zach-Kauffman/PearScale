const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log("Recieved Client");
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  socket.on('new pear', (msg) => {
    io.emit('new pear', msg);
  });
});

server.listen(3000, () => {
  console.log('Socket listening on port 3000');
});