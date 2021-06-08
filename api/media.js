const { getDownloadStreamById } = require('../models/photo');

const router = require('express').Router();

router.get('/:id', (req, res, next) => {
  console.log(req.params.id);
  getDownloadStreamById(req.params.id)
    .on('file', (file) => {
      res.status(200).type(file.metadata.contentType);
    })
    .on('error', (err) => {
      if (err.code === 'ENOENT') {
        next();
      } else {
        next(err);
      }
    })
    .pipe(res);
});
  
module.exports = router;