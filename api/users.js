/*
 * API routes for 'users' collection.
 */

const router = require('express').Router();

const {validateAgainstSchema} = require('../lib/validation');
const {generateAuthToken, requireAuthentication} = require('../lib/auth');
const {getPhotosByUserId} = require('../models/photo');
const {getReviewsByUserId} = require('../models/review');
const {getBusinessesByUserId} = require('../models/review');
const {
    UserSchema,
    insertNewUser,
    getUserById,
    validateUser
} = require('../models/user');

router.post('/', async (req, res) => {
    if (validateAgainstSchema(req.body, UserSchema)) {
        try {
            if (req.user && req.body.admin === true && req.user.admin === false) {
                res.status(403).send({
                    error: "You're not an admin, foo"
                })
                return;
            }
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
});

router.post('/login', async (req, res) => {
    if (req.body && req.body.email && req.body.password) {
        try {
            const authenticated = await validateUser(req.body.email, req.body.password);
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
    } else {
        res.status(400).send({
            error: "Request body needs `email` and `password`."
        });
    }
});

router.get('/:id', requireAuthentication, async (req, res, next) => {
    console.log('USER:', req.user);
    if (req.user.id != req.params.id || req.user.admin) {
        res.status(403).send({
            error: "Unauthorized to access the specified resource"
        });
    } else {
        try {
            const user = await getUserById(req.params.id);
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

router.get('/:id/photos', requireAuthentication, async (req, res, next) => {
    if (req.user.id != req.params.id || req.user.admin) {
        res.status(403).send({
            error: "Unauthorized to access the specified resource"
        });
    } else {
        try {
            const photos = await getPhotosByUserId(req.params.id);
            if (photos) {
                res.status(200).send(photos);
            } else {
                next();
            }
        } catch (err) {
            console.error("  -- Error:", err);
            res.status(500).send({
                error: "Error fetching photos.  Try again later."
            });
        }
    }
});

router.get('/:id/businesses', requireAuthentication, async (req, res, next) => {
    if (req.user.id != req.params.id || req.user.admin) {
        res.status(403).send({
            error: "Unauthorized to access the specified resource"
        });
    } else {
        try {
            const businesses = await getBusinessesByUserId(req.params.id);
            if (businesses) {
                res.status(200).send(businesses);
            } else {
                next();
            }
        } catch (err) {
            console.error("  -- Error:", err);
            res.status(500).send({
                error: "Error fetching photos.  Try again later."
            });
        }
    }
});

router.get('/:id/reviews', requireAuthentication, async (req, res, next) => {
    if (req.user.id != req.params.id || req.user.admin) {
        res.status(403).send({
            error: "Unauthorized to access the specified resource"
        });
    } else {
        try {
            const reviews = await getReviewsByUserId(req.params.id);
            if (reviews) {
                res.status(200).send(reviews);
            } else {
                next();
            }
        } catch (err) {
            console.error("  -- Error:", err);
            res.status(500).send({
                error: "Error fetching photos.  Try again later."
            });
        }
    }
});

module.exports = router;