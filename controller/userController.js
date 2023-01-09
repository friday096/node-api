const database = require(`../utils/db`)
const constant = require(`../utils/constant`)
const jwt = require('jsonwebtoken')
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

  //Verify Token
  function authenticationToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split('_')[1]
    if(token == null) return res.sendStatus(401)
    jwt.verify(token, secret_key, (err, result)=>{
      console.log('token value +++++++++++++=',result)

      if(err) return res.sendStatus(401)

      req.decode_data = result.decode_data;
      next();
    })

  }

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