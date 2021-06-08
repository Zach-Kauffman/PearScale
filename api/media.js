const { getDownloadStreamById } = require('../models/photo');

const router = require('express').Router();

/*
 * Downloads pair
 */
router.get('/:id.jpg', async (req, res, next) => {
    console.log('== '+req.params.id);
    getDownloadStreamById(req.params.id)
    .on('error', (err) => {
        if (err.code === 'ENOENT') {
          next();
        } else {
          next(err);
        }
      })
      .on('file', (file) => {
        res.status(200).type(file.metadata.contentType);
      })
      .pipe(res);

});
  
module.exports = router;