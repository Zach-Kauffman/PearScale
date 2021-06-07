const router = require('express').Router();

const { getReviewsByUserId } = require('../models/review');
const { getPearsByUserId } = require('../models/pear');

const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const {
  UserSchema,
  insertNewUser,
  getUserById,
  validateUserByEmail
} = require('../models/user');
const { validateAgainstSchema } = require('../lib/validation');

router.post('/login', async (req, res) => {
  if (req.body && req.body.email && req.body.password) {
    try {
      const authenticated = await validateUserByEmail(req.body.email, req.body.password);
      if (authenticated) {
        res.status(200).send({
          token: generateAuthToken(authenticated)
        });
      } else {
        res.status(401).send({
          error: "Invalid authentication credentials."
        });
      }
    } catch (err) {
      console.error("  -- error:", err);
      res.status(500).send({
        error: "Error logging in.  Try again later."
      });
    }
  }
  else {
    res.status(400).send({
      error: "Request body needs `id` and `password`."});
  }
});
//Absolutly terrible funciton
router.post('/', async (req, res) => {
  console.log(req.body);

  //if admin check admin
  if (req.body.admin == true) {
    requireAuthentication(req, res, async () => {
      //If user is admin then do it
      if (req.user.admin == 1) {
        if (validateAgainstSchema(req.body, UserSchema)) {
          try {
            const id = await insertNewUser(req.body);
            res.status(201).send({
              _id: id
            });
          } catch (err) {
            console.error("  -- Error:", err);
            res.status(500).send({
              error: "Error inserting new user.  Try again later."
            });
          }
        } else {
          
          res.status(400).send({
            error: "Request body does not contain a valid User."
          });
        }
      }
      else {
        res.status(403).send({
          error: "Unauthorized to create admin account"
        });
      }
    })
  }
  //Else not trying to make admin
  else {
    if (validateAgainstSchema(req.body, UserSchema)) {
      try {
        const id = await insertNewUser(req.body);
        res.status(201).send({
          _id: id
        });
      } catch (err) {
        console.error("  -- Error:", err);
        res.status(500).send({
          error: "Error inserting new user.  Try again later."
        });
      }
    } else {
      res.status(400).send({
        error: "Request body does not contain a valid User."
      });
    }
  }

});


router.get('/:id', requireAuthentication, async (req, res, next) => {
  console.log(req.user);
  if (req.user.id != req.params.id && req.user.admin !== 1) {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
  else {
    try {
      const user = await getUserById(req.params.id);
      delete user.password;
      if (user) {
        res.status(200).send(user);
      } else {
        next();
      }
    } catch (err) {
      console.error("  -- Error:", err);
      res.status(500).send({
        error: "Error fetching user.  Try again later."
      });
    }
  }
});

/*
 * Route to list all of a user's pears.
 */
router.get('/:id/pears', requireAuthentication, async (req, res, next) => {
    if (req.user.id == req.body.id || req.user.admin === 1) {
      try {
        const pears = await getPearsByUserId(parseInt(req.params.id));
        if (pears) {
          res.status(200).send({ pears: pears });
        } else {
          next();
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Unable to fetch pears.  Please try again later."
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
/*
 * Route to list all of a user's reviews.
 */
router.get('/:id/reviews', requireAuthentication, async (req, res, next) => {
  if (req.user.id !== req.params.id || req.user.admin === 1) {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
  else {
    try {
      const reviews = await getReviewsByUserId(parseInt(req.params.id));
      if (reviews) {
        res.status(200).send({ reviews: reviews });
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to fetch reviews.  Please try again later."
      });
    }
  }
});

