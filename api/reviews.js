
const router = require('express').Router();

const { requireAuthentication } = require('../lib/auth');
const { validateAgainstSchema, extractValidFields } = require('../lib/validation');
const {
  ReviewSchema,
  hasUserReviewedPear,
  insertNewReview,
  getReviewById,
  replaceReviewById,
  deleteReview,
  getReviewsByUserId,
  updateReview
} = require('../models/review');

/*
 * Route to create a new review.
 */
//TODO NEED REQUIRE AUTH
router.post('/', requireAuthentication, async (req, res) => {
  body = {
    ...req.body,
    userid: req.user.id
  }
  if (validateAgainstSchema(body, ReviewSchema)) {
    try {
      /*
       * Make sure the user is not trying to review the same pear twice.
       * If they're not, then insert their review into the DB.
       */
      const alreadyReviewed = await hasUserReviewedPear(body.userid, body.pearid);
      if (alreadyReviewed) {
        res.status(403).send({
          error: "This user has already posted a review of this pear"
        });
      } else {
        const id = await insertNewReview({
          pearid: body.pearid,
          text: body.text,
          rating: body.rating,
          userid: body.userid
        });
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
    const review = await getReviewById(req.params.id);
    if (review) {
      res.status(200).send(review[0]);
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
router.patch('/:id', requireAuthentication, async (req, res, next) => {
  
  const reviewList = await getReviewById(req.params.id);
  const review = reviewList[0];

  const body = {
    ...req.body,
    pearid: review.pearid,
    userid: review.userid
  }
  console.log(body);
  if (review.userid === req.user.id || req.user.admin == true) {
    if (validateAgainstSchema(body, ReviewSchema)) {
      try {
        /*
         * Make sure the updated review has the same pearID and userID as
         * the existing review.  If it doesn't, respond with a 403 error.  If the
         * review doesn't already exist, respond with a 404 error.
         */
        if (reviewList.length === 1) {
          if (body.pearid === review.pearid && req.user.id === review.userid) {
            const updateSuccessful = await updateReview(body, req.params.id);
            if (updateSuccessful) {
              res.status(200).send({
                links: {
                  pear: `/pears/${body.pearid}`,
                  review: `/reviews/${req.params.id}`
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
    } else {
      res.status(400).send({
        error: "Invalid review body"
      });
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
  const reviewList = await getReviewById(req.params.id);
  const review = reviewList[0];
  console.log(reviewList);
  if (reviewList.length > 0) {
    if (review.userid == req.user.id || req.user.admin == true) {
      try {
        const deleteSuccessful = await deleteReview(req.params.id);
        console.log(deleteSuccessful);
        if (deleteSuccessful) {
          res.status(204).send();
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
  } else {
    next();
  }
  
});

module.exports = router;