
const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');

const { requireAuthentication } = require('../lib/auth');
const { validateAgainstSchema } = require('../lib/validation');
const {
  SliceSchema,
  getSlicesPage,
  insertNewSlice,
  getSliceDetailsById,
  replaceSliceById,
  deleteSliceById,
  getSliceByName
} = require('../models/slice');
const { getUserById } = require('../models/user');

const {
  PearSchema,
  insertNewPear,
  getPearById
} = require('../models/pear');

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


/*
 * Route to create a new pear.
 */
router.post('/', upload.single('photo'), async (req, res) => {
  if (validateAgainstSchema(req.body, PearSchema) && req.file && req.body) {
    try {
      const image = {
        contentType: req.file.mimetype,
        path: req.file.path,
        filename: req.file.filename,
        slice: req.body.slice,
        caption: req.body.caption,
      }
      const id = await insertNewPear(image);
      res.status(201).send({
        id: id,
        links: {
          pear: `/${sliceName}/pears/${id}`,
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
      error: "Request body is not a valid pear object."
    });
  }
});
/*
 * Route to create a new slice.
 * TODO: ERROR IF SLICENAME ALREADY EXISTS
 */
router.post('/:slicename', async (req, res) => {
  const slice = {
    title: req.params.slicename,
    description: (req.body) ? (req.body.description) : undefined
  };
  if (validateAgainstSchema(slice, SliceSchema)) {
    try {
      const id = await getSliceByName(slice.slicename);
      if (id) {
        res.status(401).send({
          error: "This slice already exists."
        })
        return;
      } 
      const newSliceId = await insertNewSlice(slice)
      res.status(201).send({
        id: newSliceId,
        links: {
          slicepage: `/slices/${slice.title}`,
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
      error: "Request body is not a valid pear object."
    });
  }
});
/*
 * Route to fetch info about a specific slice.
 */
router.get('/:slicename', async (req, res, next) => {
  try {
    const slicename = req.params.slicename
    const slice = await getSliceByName(slicename);
    if (slice) {
      //const pears = await getPearsBySlice(slicename)
      const response = {
        slice,
        // todo: pears: { await getPearsBySlice() }
        
      }
      res.status(200).send(response);
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
router.put('/:slicename', requireAuthentication, async (req, res, next) => {
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