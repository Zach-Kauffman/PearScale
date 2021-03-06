
const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');

const { requireAuthentication } = require('../lib/auth');
const { validateAgainstSchema } = require('../lib/validation');
const {
  SliceSchema,
  getSlicesPage,
  insertNewSlice,
  replaceSliceById,
  deleteSlice,
  getSliceByName
} = require('../models/slice');

const io = require("socket.io-client");
const socket = io("http://localhost:3000/");

const {
  PearSchema,
  getPearById,
  getPearsBySlicename
} = require('../models/pear');

const {
  insertNewPear,
  acceptedFileTypes
} = require('../models/photo');

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

router.post('/:slicename', requireAuthentication, upload.single('image'), async (req, res) => {

  if (validateAgainstSchema(req.body, PearSchema) && req.file) {
    try {
      const slicename = req.params.slicename;
      const exists = await getSliceByName(slicename);
      if (!exists) {
        res.status(404).send({
          error: "Slice not found"
        })
        return;
      }
      const pear = {
        contentType: req.file.mimetype,
        path: req.file.path,
        filename: req.file.filename,
        title: req.body.title,
        description: req.body.description,
        userid: req.user.id,
        slice: slicename
      }
      const id = await insertNewPear(pear);

      const toSend = {
        img: 'http://localhost:8000/media/' + `${id}`,
        title: image.title,
        link: 'http://localhost:8000/slices/' + `${image.slice}/${id}`
      };

      socket.emit('new pear', toSend );
      res.status(201).send({
        id: id,
        links: {
          pear: `/${pear.slice}/pears/${id}`,
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
 */
router.post('/',requireAuthentication, async (req, res) => {
  const slice = {
    title: (req.body) ? req.body.title : undefined,
    description: (req.body) ? (req.body.description) : undefined,
    userid: req.user.id
  };
  if (validateAgainstSchema(slice, SliceSchema)) {
    try {
      const id = await getSliceByName(slice.title);
      if (id) {
        res.status(401).send({
          error: "This slice already exists."
        })
        return;
      } 
      const newSliceId = await insertNewSlice(slice)
      res.status(201).send({
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
      error: "Request body is not a valid slice object."
    });
  }
});
/*
 * Route to fetch pears and 
 * TODO: PAGMATION
 */
router.get('/:slicename', async (req, res, next) => {
  try {
    const slicename = req.params.slicename
    const slice = await getSliceByName(slicename);
    console.log("Slice:", slice);

    if (slice) {
      const pears = await getPearsBySlicename(slicename);
      console.log("pears:",pears);
      const response = {
        slice,
        pears: pears
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
 * Route to fetch a singular pear and reviews
 */
router.get('/:slicename/:pearid', async (req, res, next) => {
  try {
    // Check if Slicename exists
    const slicename = req.params.slicename
    if (await getSliceByName(slicename)) {
      // Check if pear exists
      const pearid = req.params.pearid;
      const pears = await getPearById(pearid);
      console.log("pears:", pears);
      if (pears) {
        res.status(200).send(pears);
      } else {
        res.status(404).send(`Pear with id '${pearid}' does not exist.`);
      }
    } else {
      res.status(404).send(`Slice '${slicename}' does not exist.`);
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
  if (req.user.id == req.body.userid || req.user.admin === 1) {
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
  const slice = await getSliceByName(req.params.id);
  if (req.user.id == slice.userid || req.user.admin == true) {
    try {
      const deleteSuccessful = await deleteSlice(req.params.id);
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