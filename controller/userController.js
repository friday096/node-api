const constant = require('../utils/constant')
 
const {createUser, loginUser, createPost, checkUser } = require('../service/user.service');

exports.signup = async (req, res) => {
    try {
        let data = req.body
        createUser(data, (err, result) => {
          if (err) {
              console.log('throw-err', err);
              res.status(500).send({
                  status: constant.error_code,
                  message:err.message
              });
          } else {
              res.status(200).send({
                  status: constant.success_code,
                  message: "User successfully created",
                  data: result.data
              });
          }
      });

    } catch (err) {
        res.send({
            status: constant.error_code,
            message: err.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        let data = req.body
        loginUser(data, (err, result) => {
            if (err) {
                console.log('throw-err', err);
                res.status(500).send({
                    status: constant.error_code,
                    message:err.message
                });
            } else {
                res.status(200).send({
                    status: constant.success_code,
                    message: "User successfully created",
                    data: result.data
                });
            }
        });
    } catch (err) {
        res.send({
            code: constant.error_code,
            message: err.message
        })
    }
}

exports.createPost = async (req, res) => {
    try {

        createPost(req, res, (err, result) => {
            if (err) {
                // console.log('throw-err', err);
                res.status(500).send({
                    status: constant.error_code,
                    message:err.message
                });
            } else {
                res.status(200).send({
                    status: constant.success_code,
                    message: "Post successfully created",
                    data: result.data
                });
            }
        });
     
    } catch (err) {
        res.send({
            code: constant.error_code,
            message: err.message
        })
    }
}

exports.checkUser = async (req, res) => {
    try {
        let data = req.body
        checkUser(data, (err, result) => {
            if (err) {
                // console.log('throw-err', err);
                res.status(500).send({
                    status: constant.error_code,
                    message:err.message
                });
            } else {
                res.status(200).send({
                    status: constant.success_code,
                    message: "Post successfully created",
                    data: result.data
                });
            }
        });
     
    } catch (err) {
        res.send({
            code: constant.error_code,
            message: err.message
        })
    }
}

