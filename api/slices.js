
const router = require('express').Router();
const multer = require('multer');

const { requireAuthentication } = require('../lib/auth');
const { validateAgainstSchema } = require('../lib/validation');
const {
  SliceSchema,
  getSlicesPage,
  insertNewSlice,
  getSliceDetailsById,
  replaceSliceById,
  deleteSliceById,
  getSlicesByOwnerdId
} = require('../models/slice');
const { getUserById } = require('../models/user');

/*
 * Route to return a paginated list of slices.
 */
router.get('/', async (req, res) => {
  try {
    /*
     * Fetch page info, generate HATEOAS links for surrounding pages and then
     * send response.
     */
    const slicePage = await getSlicesPage(parseInt(req.query.page) || 1);
    slicePage.links = {};
    if (slicePage.page < slicePage.totalPages) {
      slicePage.links.nextPage = `/slices?page=${slicePage.page + 1}`;
      slicePage.links.lastPage = `/slices?page=${slicePage.totalPages}`;
    }
    if (slicePage.page > 1) {
      slicePage.links.prevPage = `/slices?page=${slicePage.page - 1}`;
      slicePage.links.firstPage = '/slices?page=1';
    }
    res.status(200).send(slicePage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching slices list.  Please try again later."
    });
  }
});

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
 * Route to create a new slice.
 */
router.post('/', requireAuthentication, async (req, res) => {
  if (validateAgainstSchema(req.body, SliceSchema)) {
    try {
      const id = await insertNewSlice(req.body);
      res.status(201).send({
        id: id,
        links: {
          slice: `/slices/${id}`
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error inserting slice into DB.  Please try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid slice object."
    });
  }
});

/*
 * Route to fetch info about a specific slice.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const slice = await getSliceDetailsById(parseInt(req.params.id));
    if (slice) {
      res.status(200).send(slice);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch slice.  Please try again later."
    });
  }
});

/*
 * Route to replace data for a slice.
 */
router.put('/:id', requireAuthentication, async (req, res, next) => {
  if (req.user.id == req.body.ownerid || req.user.admin === 1) {
    if (validateAgainstSchema(req.body, SliceSchema)) {
      try {
        const id = parseInt(req.params.id)
        const updateSuccessful = await replaceSliceById(id, req.body);
        if (updateSuccessful) {
          res.status(200).send({
            links: {
              slice: `/slices/${id}`
            }
          });
        } else {
          next();
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Unable to update specified slice.  Please try again later."
        });
      }
    } else {
      res.status(400).send({
        error: "Request body is not a valid slice object"
      });
    }
  }
  else {
    res.status(403).send({
      error: "Not permited"
    });
  }
});

/*
 * Route to delete a slice.
 */
router.delete('/:id', requireAuthentication, async (req, res, next) => {
  if (req.user.id == req.body.ownerid || req.user.admin === 1) {
    try {
      const deleteSuccessful = await deleteSliceById(parseInt(req.params.id));
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to delete slice.  Please try again later."
      });
    }
  }
  else {
    res.status(403).send({
      error: "Not permited"
    });
  }

});

module.exports = router;