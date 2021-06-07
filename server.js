const express = require('express');
const morgan = require('morgan');
const api = require('./api');

const app = express();

const { connectToDB } = require('./lib/mongo');


const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = process.env.PORT || 8000;

/*
 * Morgan is a popular logger.
 */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

/*
 * All routes for the API are written in modules in the api/ directory.  The
 * top-level router lives in api/index.js.  That's what we include here, and
 * it provides all of the routes.
 */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

app.use('/', api);


io.on('connection', (socket) => {
  console.log('New connection');
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  socket.on('disconnect', () => {
      console.log('user disconnected');
  });
});

app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  });
}); 

console.log("== Attempting to connect to Mongo...")
connectToDB(() => {
  app.listen(port, () => {
    console.log("== Server is running on port", port);
  });
});
