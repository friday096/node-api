const jwt = require('jsonwebtoken');
const secret_key = 'my_secret_key'

verifyToken = (req, res, next) => {

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split('_')[1]
  if(token == null) return res.sendStatus(401)
  jwt.verify(token, secret_key, (err, result)=>{
    // console.log('token value +++++++++++++=',result)

    if(err) return res.sendStatus(401)

    req.decode_data = result.decode_data;
    next();
  })
};
const authJwt = {
  verifyToken: verifyToken,
};
module.exports = authJwt