const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access denied!');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    req.user = verified;
    next();
  } catch (error) {
    res.send('Invalid Token');
  }
};
