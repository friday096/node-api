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

// 2nd Method
// if (req.headers['authorization']) {
//   try {
//       let authorization = req.headers['authorization'].split(' ');
//       if (authorization[0] !== 'Bearer') {
//           return res.status(401).send();
//       } else {
//           req.jwt = jwt.verify(authorization[1], secret);
//           return next();
//       }
//   } catch (err) {
//       return res.status(403).send();
//   }
// } else {
//   return res.status(401).send();
// }

};
const authJwt = {
  verifyToken: verifyToken,
};
module.exports = authJwt