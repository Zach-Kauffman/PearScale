const router = require('express').Router();

const { getReviewsByUserId } = require('../models/review');
const { getPearsByUserId } = require('../models/pear');

const { generateAuthToken, requireAuthentication } = require('../lib/auth');
const {
  UserSchema,
  insertNewUser,
  getUserById,
  validateUser,
  validateUserByEmail,
  getUserByEmail

} = require('../models/user');
const { validateAgainstSchema } = require('../lib/validation');

router.get('/:id', requireAuthentication, async (req, res, next) => {
  if(!req.user.admin) {
    if (req.user.id != req.params.id) {
      res.status(403).send({
        error: "Unauthorized to access the specified resource"
      });
    }
    else {
      try {
        const user = await getUserById(req.params.id);
        if (user) {
          res.status(200).send({
            _id: user[0]._id,
            email: user[0].email,
            name: user[0].name
          });
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
  } else {
    //if user is an admin then just send the requested user
    const user = await getUserById(req.params.id);
    if(user) {
      res.status(200).send(user);
    } else {
      next();
    }
  }
});


router.post('/login', async (req, res) => {
  if (req.body && req.body.email && req.body.password) {
    try {
      const authenticated = await validateUserByEmail(req.body.email, req.body.password);
      if (authenticated) {
        const userid = await getUserByEmail(req.body.email);
        res.status(200).send({
          token: generateAuthToken(authenticated),
          id: userid[0]._id
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

//Absolutely terrible funciton
router.post('/', async (req, res, next) => {  
  //if admin check admin
  if (req.body.admin == true) {

    requireAuthentication(req, res, async () => {
      //If user is admin then do it
      if (req.user.admin == true) {
        if (validateAgainstSchema(req.body, UserSchema)) {
          try {
            const id = await insertNewUser(req.body);
            //id returns as false if a user already exists with given email
            if (!id) {
              res.status(401).send({
                error: "A user with that email already exists. Please use a different email"
              });
            } else {
              res.status(201).send({
                _id: id
              });
            }
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
        //id returns as false if a user already exists with given email
        if (!id) {
          res.status(401).send({
            error: "A user with that email already exists. Please use a different email"
          });
        } else {
          res.status(201).send({
            _id: id
          });
        }
        
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

