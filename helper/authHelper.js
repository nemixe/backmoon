const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  jwt.verify(req.headers.token, '1n1p455w0rd', (err) => {
    if (err) {
      return res.status(401).json({ message: "Auth required" })
    } else {
      next()
    }
  })
}