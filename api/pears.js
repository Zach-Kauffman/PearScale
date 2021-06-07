/*
 * API sub-router for pears collection endpoints.
 */

const router = require('express').Router();

const { validateAgainstSchema } = require('../lib/validation');
const {
  PearSchema,
  getPearsPage,
  insertNewPear,
  getPearDetailsById
} = require('../models/pear');

/*
 * Route to return a paginated list of pears.
 */
router.get('/', async (req, res) => {
  try {
    /*
     * Fetch page info, generate HATEOAS links for surrounding pages and then
     * send response.
     */
    const pearPage = await getPearsPage(parseInt(req.query.page) || 1);
    pearPage.links = {};
    if (pearPage.page < pearPage.totalPages) {
      pearPage.links.nextPage = `/pears?page=${pearPage.page + 1}`;
      pearPage.links.lastPage = `/pears?page=${pearPage.totalPages}`;
    }
    if (pearPage.page > 1) {
      pearPage.links.prevPage = `/pears?page=${pearPage.page - 1}`;
      pearPage.links.firstPage = '/pears?page=1';
    }
    res.status(200).send(pearPage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching pears list.  Please try again later."
    });
  }
});

/*
 * Route to create a new pear.
 */
router.post('/', async (req, res) => {
  if (validateAgainstSchema(req.body, PearSchema)) {
    try {
      const id = await insertNewPear(req.body);
      res.status(201).send({
        id: id,
        links: {
          pear: `/pears/${id}`
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error inserting pear into DB.  Please try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid pear object."
    });
  }
});

/*
 * Route to fetch info about a specific pear.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const pear = await getPearDetailsById(req.params.id);
    if (pear) {
      res.status(200).send(pear);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch pear.  Please try again later."
    });
  }
});

module.exports = router;
