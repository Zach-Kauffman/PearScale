const multer = require('multer');
const crypto = require('crypto');
const router = require('express').Router();
const fs = require('fs/promises');

const { validateAgainstSchema } = require('../lib/validation');

const {
  PhotoSchema,
  insertNewPhoto,
  getPhotoById
} = require('../models/photo');

const acceptedFileTypes = {
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

const upload = multer({
  storage: multer.diskStorage({
    destination: `${__dirname}/uploads`,
    filename: (req, file, callback) => {
      const filename = crypto.pseudoRandomBytes(16).toString('hex');
      const extension = acceptedFileTypes[file.mimetype];
      callback(null, `${filename}.${extension}`);
    }
  }),
  fileFilter: (req, file, callback) => {
    callback(null, !!acceptedFileTypes[file.mimetype])
  }
});

/*
 * Route to create a new photo.
 */
router.post('/', upload.single('photo'), async (req, res) => {
  //console.log("== req.body:", req.body);
  //console.log("== req.file:", req.file);
  if (validateAgainstSchema(req.body, PhotoSchema) && req.file && req.body) {
    try {
      const image = {
        contentType: req.file.mimetype,
        caption: req.body.caption,
        filename: req.file.filename,
        businessid: req.body.businessid,
        path: req.file.path,
        
      }
      const id = await insertNewPhoto(image);
      res.status(201).send({
        id: id,
        links: {
          photo: `/photos/${id}`,
          business: `/businesses/${req.body.businessid}`
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error inserting photo into DB.  Please try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid photo object"
    });
  }
});


module.exports = router;