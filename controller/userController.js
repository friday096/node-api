const database = require(`../utils/db`)
const constant = require(`../utils/constant`)
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const config = require('../utils/config')

const secret_key = 'my_secret_key'
  //Check SQL Query
  function runQuery(query) {
    return new Promise(resolve => {
  
      //setTimeout(() => {
        var resultData = '';
        database.query(query, (err, result) => {
          if (err) throw err;
          resultData = result
          resolve(resultData);
        });
      //}, 100); 
    });
  }

  //Verify Token with function
  function authenticationToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split('_')[1]
    if(token == null) return res.sendStatus(401)
    jwt.verify(token, secret_key, (err, result)=>{
      console.log('token value +++++++++++++=',result)

      if(err) return res.sendStatus(401)

      req.decode_data = result.decode_data;
      // next();
    })

  }

  //Register 
  exports.regUser = async (req, res) => {
    try {
      console.log('req.body.email', req.body.email)
      let query_email = "SELECT * FROM users where email = '" + req.body.email + "'";
      let check_email  = await runQuery(query_email);
      if (check_email.length > 0) {
        return  res.json({
          code: constant.ERROR_CODE,
          data: 'Email Already Exist'
        })
      }else{
      const query = "INSERT INTO `users` (`fname`, `lname`, `email`, `password`, `phone`, `address`,`status`,`token`) VALUES  ('" + req.body.fname + "', '" + req.body.lname + "', '" + req.body.email + "', '" + req.body.password + "', '" + req.body.phone + "', '" + req.body.address + "','" + constant.ACTIVE + "','" + null + "'); ";

      let reg_user  = await runQuery(query);
      if (reg_user) {
        let query_data = "SELECT * FROM users where id = '" + reg_user.insertId + "'";
        let getData  = await runQuery(query_data);
        console.log('userData', getData)
        // return false;
        const token = jwt.sign({decode_data: getData}, secret_key , { expiresIn: "365d" })
        let updateQuery = `
                            UPDATE
                              users
                            SET
                              token  = '${token}'
                            WHERE
                              email  = '${req.body.email}'
                          `;

        let token_query  = await runQuery(updateQuery);
        return  res.json({
                  code: constant.SUCCESS_CODE,
                  data: 'User Registered Successfully',
                  token:token
                })
  
      } else {
  
        return  res.json({
                  code: constant.ERROR_CODE,
                  data: 'Server error occuered. Please try again later'
                });
  
      }
    }

    } catch (err) {
      res.send({
        code: constant.ERROR_CODE,
        message: err.message,
      });
    }
  };

  //Get Token Data By Function 
  exports.getTokenData = async (req, res) => {
    try {
      // console.log('request', req)
      let getData = authenticationToken(req)
      console.log('Final Token Data', req.decode_data)
      if(req.decode_data){
        res.send({
          code: constant.SUCCESS_CODE,
          message:'Token Data Get successfully',
          data: req.decode_data,
          
        });
      }else{
        res.send({
          code: constant.ERROR_CODE,
          message: 'Something Went Wrong in Token',
        });
      }


    }catch (err) {
      res.send({
        code: constant.ERROR_CODE,
        message: err.message,
      });
    }
  };

  //Using of Middleware Data
  exports.getTokenMiddlewareData = async (req, res) => {
    try {
      // console.log('request', req)
      console.log('Final Token Data', req.decode_data)
      if(req.decode_data){
        res.send({
          code: constant.SUCCESS_CODE,
          message:'Token Data Get successfully',
          data: req.decode_data,
          
        });
      }else{
        res.send({
          code: constant.ERROR_CODE,
          message: 'Something Went Wrong in Token',
        });
      }


    }catch (err) {
      res.send({
        code: constant.ERROR_CODE,
        message: err.message,
      });
    }
  };

  //Get Users All Data
  exports.getUsersData = async (req, res) =>{

   try{
    let get_data  = `  SELECT
                          *
                        FROM
                          users
                      `;

    let get_detail  = await runQuery(get_data);
    if (get_detail.length > 0) {

      return  res.json({
                code: constant.SUCCESS_CODE,
                msg:'Get Details Successfully',
                data: get_detail
              })

    } else {
      return res.json({
              code: constant.ERROR_CODE,
              msg:get_detail,
              data: []
            })

    }

   }catch (err) {
    res.send({
      code: constant.ERROR_CODE,
      message: err.message,
    });
  }
  }

  //Get Users All Data
  exports.getUsersDataById = async (req, res) =>{

    try{
      let user_id = req.params.user_id
      let get_data  = `  SELECT
                              *
                            FROM
                              users
                            WHERE
                              id  = '${user_id}'
                          `;
      let get_detail  = await runQuery(get_data);
      if (get_detail.length > 0) {
        return  res.json({
                  code: constant.SUCCESS_CODE,
                  msg:'Get Details Successfully',
                  data: get_detail
                })
  
      } else {
        return res.json({
                code: constant.ERROR_CODE,
                msg:'No User Found',
                data: []
              })
  
      }
  
    }catch (err) {
      res.send({
        code: constant.ERROR_CODE,
        message: err.message,
      });
    }
  }

  // Update Users 
  exports.updateUser = async (req, res) =>{

    try{
      let user_id = req.params.user_id
      // let update_data  = ` //Some issue in syntax
      //                       UPDATE  
      //                         users
      //                       SET
      //                         fname                     = '${req.body.fname}',
      //                         lname                     = '${req.body.lname}',
      //                         email                     = '${req.body.email}',
      //                         password                  = '${req.body.password}',
      //                         phone                     = '${req.body.phone}',
      //                         address                   = '${req.body.address}',
      //                       WHERE
      //                         id                        = '${user_id}'
      //                     `;
    let update_data = "UPDATE `users` SET `fname`='" + req.body.fname + "', `lname`='" + req.body.lname + "',`email`='" +  req.body.email + "',`password`='" + req.body.password + "',`phone`='" + req.body.phone + "',`address`='" + req.body.address + "' WHERE `id` = '" + user_id + "'";

    console.log('check-query',update_data )
                    
      let get_detail  = await runQuery(update_data);
      console.log('check-get_detail',get_detail )

      if (get_detail.length != '') {
        return  res.json({
                  code: constant.SUCCESS_CODE,
                  msg:'User Update Successfully',
                  // data: get_detail
                })
  
      } else {
        return res.json({
                code: constant.ERROR_CODE,
                msg:'No User Found',
                data: []
              })
  
      }
  
    }catch (err) {
      res.send({
        code: constant.ERROR_CODE,
        message: err.message,
      });
    }
  }


  //Delete User
  exports.deleteUser = async (req, res) =>{

    try{
      let user_id = req.params.user_id

      //Delete Permanently
      // let deleteQuery = "DELETE FROM `users` WHERE `id` = '" + user_id + "'";
      
      // OR can be status change
      let deleteQuery =  `
                            UPDATE  
                            users
                            SET
                              status  = '${constant.INACTIVE}'
                            WHERE
                              id      = ${user_id}
                          `;
                    
      let get_detail  = await runQuery(deleteQuery);
      console.log('check-get_detail',get_detail )

      if (get_detail.length != '') {
        return  res.json({
                  code: constant.SUCCESS_CODE,
                  msg:'User Delete Successfully',
                  // data: get_detail
                })
  
      } else {
        return res.json({
                code: constant.ERROR_CODE,
                msg:'No User Found',
                data: []
              })
  
      }
  
    }catch (err) {
      res.send({
        code: constant.ERROR_CODE,
        message: err.message,
      });
    }
  }

  //Send Email with Nodemailer

  exports.sendEmail = async (req, res) =>{

    try{
      var transporter = nodemailer.createTransport(config.smtp_data);
      var mailOptions = {
        from: config.from_email,
        to: 'rajak3819@gmail.com',
        subject: 'Testing Email',
        html: `<!DOCTYPE html>
            <html lang="en">
           
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Vetrine.com</title>
            </head>
           
            <body>
              <p> Hello Nodemailer </p>
            </body>
           
            </html>`,
    };
    // transporter.sendMail(mailOptions);
    transporter.sendMail (mailOptions, function (error, info) {
      if (error) {
      return res.json({
        code: constant.ERROR_CODE,
        msg:error,
      })
      }
      else {
      return  res.json({
        code: constant.SUCCESS_CODE,
        msg:'Email Send Successfully',
      })
      }
      })
  
    }catch (err) {
      res.send({
        code: constant.ERROR_CODE,
        message: err.message,
      });
    }
  }