const jwt = require('jsonwebtoken');

const secretKey = "SuperSecret";

function generateAuthToken(user) {
  const payload = {
      admin: user[0].admin,
      id: user[0]._id
  };
  return jwt.sign(payload, secretKey, { expiresIn: '24h' });
}
exports.generateAuthToken = generateAuthToken;

function requireAuthentication(req, res, next) {
  const authHeader = req.get('Authorization') || '';
  const authHeaderParts = authHeader.split(' ');
  const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;

  try {
    const payload = jwt.verify(token, secretKey);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).send({
      error: "Invalid authentication token."
    });
  }
}
exports.requireAuthentication = requireAuthentication;

function checkAdmin(req, res, next) {
  const authHeader = req.get('Authorization') || '';
  const authHeaderParts = authHeader.split(' ');
  const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;

  try {
    const payload = jwt.verify(token, secretKey);
    req.user = payload;
    next();
  } catch (err) {
    req.user = {admin: false}
    next();
  }
}
exports.checkAdmin = checkAdmin;