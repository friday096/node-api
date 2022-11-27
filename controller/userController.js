const database = require(`../utils/db`)
const constant = require(`../utils/constant`)

  //Check SQL Query
  function runQuery(query) {
    return new Promise(resolve => {
  
      //setTimeout(() => {
        var resultData = '';
        con.query(query, (err, result) => {
          if (err) throw err;
          resultData = result
          resolve(resultData);
        });
      //}, 100);
    });
  }

  exports.testSql = async (req, res) => {
    try {

//         let get_user_info_query = `
//         SELECT
//           *
//         FROM
//           users
//       `;

// let get_user_info   = await runQuery(get_user_info_query);
// console.log('check users',get_user_info )
        res.send({
            code: constant.SUCCESS_CODE,
            message: 'HIIIIIIII',
          });
    } catch (err) {
      res.send({
        code: constant.ERROR_CODE,
        message: err.message,
      });
    }
  };