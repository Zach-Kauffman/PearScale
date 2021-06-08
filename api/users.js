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
  getUserByEmail,
  updateUser,
  deleteUser,
  checkForDuplicateEmail

} = require('../models/user');
const { validateAgainstSchema } = require('../lib/validation');

//get a user's info
router.get('/:id', requireAuthentication, async (req, res, next) => {
  console.log(req.user);
  if(!req.user.admin) {
    if (req.user.id != req.params.id) {
      res.status(403).send({
        error: "Unauthorized to access the specified resource"
      });
    }
    else {
      try {
        const user = await getUserById(req.params.id);
        if (user[0]) {
          console.log("fdsafs");
          res.status(200).send({
            _id: user[0]._id,
            email: user[0].email,
            name: user[0].name,
            links: {
              pears: `/users/${user[0]._id}/pears`,
              reviews: `/users/${user[0]._id}/reviews`
            }
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
    if(user[0]) {
      res.status(200).send({
        _id: user[0]._id,
        email: user[0].email,
        name: user[0].name,
        password: user[0].password, 
        admin: user[0].admin,
        links: {
          pears: `/users/${user[0]._id}/pears`,
          reviews: `/users/${user[0]._id}/reviews`
        }
      });
    } else {
      next();
    }
  }
});

//login endpoint
//returns an auth token if successful
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

//Create new user
//admin accounts can only be created with an admin auth token
router.post('/', async (req, res, next) => {  
  //if making an admin account, require auth
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
router.get('/:id/pears', async (req, res, next) => {
  try {
    const pears = await getPearsByUserId(req.params.id);
    const user = await getUserById(req.params.id);
    const links = [];
    for (const pear of pears) {
      links.push({
        ...pear,
        links: {
          image: `/media/${pear._id}`,
          user: `/users/${pear.metadata.userid}`
        }
      });
    }
    if(user.length === 0) {
      res.status(404).send({error: "User not found"});
    } else {
      if (pears) {
        res.status(200).send( links );
      } else {
        next();
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch pears.  Please try again later."
    });
  }
});
  
/*
 * Route to list all of a user's reviews.
 */
router.get('/:id/reviews', requireAuthentication, async (req, res, next) => {
  if (req.user.id == req.params.id || req.user.admin == true) {
    try {
      const reviews = await getReviewsByUserId(req.params.id);
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
  else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
});

//update a user's details
//admins can update any user and may give users admin permissions
//normal users may not give themselves admin permissions or edit other users besides themselves
//users may not set their email equal to another user's email
router.patch('/:id', requireAuthentication, async (req, res, next) => {
  if (req.user.id == req.params.id || req.user.admin == true) {
    if(validateAgainstSchema(req.body, UserSchema)) {
      try {
        if(req.body.admin == true && req.user.admin != true) {
          res.status(403).send({error: "Non-admins cannot edit admin permissions"});
        } else {

          //make sure that we're not setting 2 users to the same email
          const isDupe = await getUserByEmail(req.body.email);
          if(isDupe[0]) {
            if(isDupe[0]._id != req.user.id) {
              res.status(500).send({error: "A user already exists with that email"});
            }
          }

          //if email doesn't already exist, we can update the user
          const result = await updateUser(req.body, req.params.id);
          if(result) {
            res.status(204).send();
          } else {
            //update fails if there's no changes made
            res.status(500).send({
              error: "Update failed. This could be due to there being no changes to the user."
            });
          }
          
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Unable to update this user. Please try again later."
        });
      }
    }
    else {
      res.status(500).send({error: "Invalid user body"});
    }
  } 
  else {
    res.status(403).send({
      error: "Unauthorized to access the specified resource"
    });
  }
});

//endpoint for deleting users and all their pears and reviews
//admins may delete any user
router.delete('/:id', requireAuthentication, async (req, res, next) => {
  if(req.params.id == req.user.id || req.user.admin == true) {
    console.log("deleting stuff");
    await deleteUser(req.params.id);
    res.status(204).send();
  } else {
    res.status(403).send({error: "Unauthorized to delete this user"});
  }
});

module.exports = router;
