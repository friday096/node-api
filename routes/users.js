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
router.get('/getTokenData', userController.getTokenData); //Get Data by Token using function in one file

router.get('/getTokenMiddlewareData',[authJwt.verifyToken], userController.getTokenMiddlewareData); //Get Data by Token by Middleware
//Get All Users Data
router.get('/getUsersData',[authJwt.verifyToken], userController.getUsersData);

//Get User By Id  updateUsers
router.get('/getUsersDataById/:user_id',[authJwt.verifyToken],userController.getUsersDataById)

//Update User
router.put('/updateUser/:user_id',[authJwt.verifyToken],userController.updateUser)

//Delete User
router.delete('/deleteUser/:user_id',[authJwt.verifyToken],userController.deleteUser)

//Send Email with Nodemailer
router.post('/send-email',userController.sendEmail)



module.exports = router; 
