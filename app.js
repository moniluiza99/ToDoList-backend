const express = require('express')
var mysql      = require('mysql');
const base64 = require('js-base64');
var jwt = require('jsonwebtoken');
var jwtMiddleware = require('express-jwt');





console.log('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'ToDoList'
});
 

const bodyParser = require('body-parser')
const app = express() 
app.use(bodyParser.json())
const port = 8000


const generateToken= (username, userId) => {
    const Payload = {username, userId}
    var token = jwt.sign(Payload, 'your-256-bit-secret', { algorithm: 'HS256'});
    return token
}
app.post('/register', (req, res) =>  {
   console.log(req.body)
 
   connection.query(
   `INSERT INTO user (username, password) VALUES ('${req.body.username}', '${req.body.password}');`, 
   function (error, results, fields) {
        res.send({
            userId: results.insertId,
        username:req.body.username,
        token: generateToken(req.body.username, results.insertId)
        })

   });
})

app.post('/login', (req, res) =>  {
    console.log(req.body)
  
    connection.query(
    `SELECT count(*) FROM user where username='${req.body.username}' and password='${req.body.password}';`, 
    function (error, results, fields) {
        console.log(results[0]["count(*)"])

        if (results[0]["count(*)"]) 
            res.send('userfound')

        else 
            res.send('not found')
 
    });
     
 })

app.get('/',jwtMiddleware({ secret: 'your-256-bit-secret', algorithms: ['HS256']}), (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

