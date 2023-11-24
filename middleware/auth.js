const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

verifyToken = (req, res, next) => {
  // using Bearer Token
  const authHeader = req.headers['authorization']

  const token = authHeader && authHeader.split(' ')[1]

  if(token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded)=>{
    // console.log('token value +++++++++++++=',decoded)

    if(err) return res.sendStatus(401)

    req.decode_data = decoded;
    req.secret = process.env.JWT_SECRET_KEY;
    next();
  })
};
const authJwt = {
  verifyToken: verifyToken,
};
module.exports = authJwt