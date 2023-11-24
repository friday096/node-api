var express = require('express');
var router = express.Router();
const { authJwt } = require("../middleware")

const userController = require('../controller/userController')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/signup', userController.signup)
router.post('/login', userController.login)
router.post('/add_post', [authJwt.verifyToken], userController.createPost)
router.post('/check-user', userController.checkUser)



module.exports = router;