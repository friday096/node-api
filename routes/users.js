var express = require('express');
var router = express.Router();
const userController = require(`../controller/userController`)
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Users Api HIT');
});

router.get('/check', userController.testSql);

module.exports = router;
