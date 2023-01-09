const jwt = require('jsonwebtoken');
const secret_key = 'my_secret_key'

verifyToken = (req, res, next) => {

  // const authHeader = req.headers['authorization']
  // const token = authHeader && authHeader.split('_')[1]
  // if(token == null) return res.sendStatus(401)
  // jwt.verify(token, secret_key, (err, result)=>{
  //   console.log('token value +++++++++++++=',result)

  //   if(err) return res.sendStatus(401)

  //   req.decode_data = result.decode_data;
  //   next();
  // })
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split('_')[1]
      if (!token) {
    res.send({
      'status': 400,
      message: "something went wrong in token"
    })

  } else {

    jwt.verify(token, secret_key, (err, decoded) => {
      console.log('token value +++++++++++++=',decoded)
      if (err) {
        res.send({
          'status': 400,
          Message: "auth token verification failed"
        })
      }
      req.userId = decoded.userId;
      next();
    })
  }
};
const authJwt = {
  verifyToken: verifyToken,
};
module.exports = authJwt