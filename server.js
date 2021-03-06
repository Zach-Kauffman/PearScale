const express = require('express');
const redis = require('redis');
const morgan = require('morgan');
const api = require('./api');
const app = express();
const { connectToDB } = require('./lib/mongo');
const { checkAdmin } = require('./lib/auth');



const redisClient = redis.createClient(
  process.env.REDIS_PORT || '6379',
  process.env.REDIS_HOST || 'localhost'
);

const rateLimitWindowMS = 60000;
const rateLimitWindowMSAdmin = 10000;
const rateLimitMaxRequests = 5;
const port = process.env.PORT || 8000;

/*
 * Morgan is a popular logger.
 */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

function getUserTokenBucket(ip) {
  return new Promise((resolve, reject) => {
    redisClient.hgetall(ip, (err, tokenBucket) => {
      if (err) {
        reject(err);
      } else if (tokenBucket) {
        tokenBucket.tokens = parseFloat(tokenBucket.tokens);
        resolve(tokenBucket);
      } else {
        resolve({
          tokens: rateLimitMaxRequests,
          last: Date.now()
        });
      }
    });
  });
}

function saveUserTokenBucket(ip, tokenBucket) {
  return new Promise((resolve, reject) => {
    redisClient.hmset(ip, tokenBucket, (err, resp) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

const rateLimit = async function (req, res, next) {
  
  checkAdmin(req, res, async () => {
    try {
      const tokenBucket = await getUserTokenBucket(req.ip);
  
      const currentTimestamp = Date.now();
      const ellapsedTime = currentTimestamp - tokenBucket.last;
      if (req.user.admin) {
        tokenBucket.tokens += ellapsedTime *
          (rateLimitMaxRequests / rateLimitWindowMSAdmin);
      }
      else {
        tokenBucket.tokens += ellapsedTime *
          (rateLimitMaxRequests / rateLimitWindowMS);
      }
      tokenBucket.tokens = Math.min(
        tokenBucket.tokens,
        rateLimitMaxRequests
      );
      tokenBucket.last = currentTimestamp;
  
      if (tokenBucket.tokens >= 1) {
        tokenBucket.tokens -= 1;
        await saveUserTokenBucket(req.ip, tokenBucket);
        next();
      } else {
  
        res.status(429).send({
          error: "Too many request per minute.  Please wait a bit..."
        });
      }
    } catch (err) {
      next();
    }
  });
}

app.use(rateLimit);

/*
 * All routes for the API are written in modules in the api/ directory.  The
 * top-level router lives in api/index.js.  That's what we include here, and
 * it provides all of the routes.
 */

app.use('/', api);

const io = require("socket.io-client");
const socket = io("http://localhost:3000/");

socket.on("connect", () => {
  console.log("== Connected to Socket Server"); 
});
//Method to send message
//socket.emit('chat message', "hello");

socket.on("disconnect", () => {
  console.log("== Disconnected to Socket Server");
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
