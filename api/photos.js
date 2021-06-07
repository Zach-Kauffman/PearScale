const multer = require('multer');
const crypto = require('crypto');
const router = require('express').Router();
const fs = require('fs/promises');

const { validateAgainstSchema } = require('../lib/validation');


module.exports = router;