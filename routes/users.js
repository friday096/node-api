var express = require('express');
var router = express.Router();
const { authJwt } = require("../middleware")

//controller
const userController = require(`../controller/userController`)

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Users Api HIT');
});



router.post('/register', userController.regUser);
router.post('/getTokenData', userController.getTokenData); //Get Data by Token using function in one file

router.post('/getTokenMiddlewareData',[authJwt.verifyToken], userController.getTokenMiddlewareData); //Get Data by Token by Middleware

module.exports = router; 
