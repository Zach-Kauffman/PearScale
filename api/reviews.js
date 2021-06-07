
const router = require('express').Router();

const { requireAuthentication } = require('../lib/auth');
const { validateAgainstSchema } = require('../lib/validation');
const {
  ReviewSchema,
  hasUserReviewedPear,
  insertNewReview,
  getReviewById,
  replaceReviewById,
  deleteReviewById
} = require('../models/review');

/*
 * Route to create a new review.
 */
//TODO NEED REQUIRE AUTH
router.post('/',  async (req, res) => {
  if (validateAgainstSchema(req.body, ReviewSchema)) {
    try {
      /*
       * Make sure the user is not trying to review the same pear twice.
       * If they're not, then insert their review into the DB.
       */
      const alreadyReviewed = await hasUserReviewedPear(req.body.userid, req.body.pearid);
      if (alreadyReviewed) {
        res.status(403).send({
          error: "User has already posted a review of this pear"
        });
      } else {
        const id = await insertNewReview(req.body);
        res.status(201).send({
          id: id,
          links: {
            review: `/reviews/${id}`,
            pear: `/pears/${req.body.pearid}`
          }
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error inserting review into DB.  Please try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid review object."
    });
  }
});

/*
 * Route to fetch info about a specific review.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const review = await getReviewById(parseInt(req.params.id));
    if (review) {
      res.status(200).send(review);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch review.  Please try again later."
    });
  }
});

/*
 * Route to update a review.
 */
router.put('/:id', requireAuthentication, async (req, res, next) => {
  if (req.user.id == req.body.userid || req.user.admin === 1) {
    if (validateAgainstSchema(req.body, ReviewSchema)) {
      try {
        /*
         * Make sure the updated review has the same pearID and userID as
         * the existing review.  If it doesn't, respond with a 403 error.  If the
         * review doesn't already exist, respond with a 404 error.
         */
        const id = parseInt(req.params.id);
        const existingReview = await getReviewById(id);
        if (existingReview) {
          if (req.body.pearid === existingReview.pearid && req.body.userid === existingReview.userid) {
            const updateSuccessful = await replaceReviewById(id, req.body);
            if (updateSuccessful) {
              res.status(200).send({
                links: {
                  pear: `/pears/${req.body.pearid}`,
                  review: `/reviews/${id}`
                }
              });
            } else {
              next();
            }
          } else {
            res.status(403).send({
              error: "Updated review must have the same pearID and userID"
            });
          }
        } else {
          next();
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Unable to update review.  Please try again later."
        });
      }
    }
  } 
  else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
});

/*
 * Route to delete a review.
 */
router.delete('/:id', requireAuthentication, async (req, res, next) => {
  if (req.user.id == req.body.userid || req.user.admin === 1) {
    try {
      const deleteSuccessful = await deleteReviewById(parseInt(req.params.id));
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to delete review.  Please try again later."
      });
    }
  }
  else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
});

module.exports = router;