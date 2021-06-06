const jwt = require('jsonwebtoken');

const secretKey = "SuperSecret";

function generateAuthToken(user) {
    const payload = {
        admin: user.admin,
        id: user.id
    }
    return jwt.sign(payload, secretKey, { expiresIn: '24h' });
}
exports.generateAuthToken = generateAuthToken;

function requireAuthentication(req, res, next) {
    console.log("  -- verifying authentication");
    const authHeader = req.get('Authorization') || '';
    const authHeaderParts = authHeader.split(' ');
    console.log("  -- authHeaderParts:", authHeaderParts);
    const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;

    try {
        req.user = jwt.verify(token, secretKey);
        next();
    } catch (err) {
        res.status(401).send({
            error: "Invalid authentication token."
        });
    }
}
exports.requireAuthentication = requireAuthentication;
