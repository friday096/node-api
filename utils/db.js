let mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node-api'
});
connection.connect(function(err) {
    if (err) {
      return console.error('MySQL Error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
  });

module.exports = connection;