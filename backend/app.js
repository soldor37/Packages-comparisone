const mysql = require("mysql2");
require('dotenv').config();
const bodyParser = require("body-parser");
// получаем модуль Express
const express = require("express");
// создаем приложение
const app = express();
var cors = require('cors')
app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


const urlencodedParser = bodyParser.urlencoded({extended: false});
/**
 * @type {Pool}
 */
var db = null;
/**
 * @return {Pool}
 */
function getConnection() {
    if (db === null) {
        db = mysql.createPool(getConfig())
    }
    console.log('Connected to DB');
    return db;
}
module.exports.getConnection = getConnection();
/**
 * @returns {Object}
 */
function getConfig() {
    return {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    };
}



//Middlewares
// app.use('/posts', () => {
//     console.log('This is a middleware running');
// });

//Import Routes
const postsRoute = require('./routes/posts');
app.use('/posts', postsRoute);

//ROUTES
// app.get('/', function(req, res) {
//     res.sendfile('index.html');
//   });
  // запускаем сервер на порту 3000
app.listen(3000);
// отправляем сообщение
console.log('Сервер стартовал!');


// http.createServer(function(request,response){
//     response.write("Hello world!");
//     response.end();
//     }).listen(3000, "127.0.0.1",function(){
//         console.log("Сервер начал прослушивание запросов на порту 3000");
//     });



// function router(req, res) {
//     getConncetion().query('SELECT * FROM packaging', function (error, fields, result) {
//         if (error) {
//             throw error;
//         }
//         const packs = fields;
//         res.end(JSON.stringify(packs));
//     });
// }




// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     database: "mydb",
//     password: "admin"
//   });

 
//   // тестирование подключения
//    connection.connect(function(err){
//       if (err) {
//         return console.error("Ошибка: " + err.message);
//       }
//       else{
//         console.log("Подключение к серверу MySQL успешно установлено");
//       }
//    });

//    // закрытие подключения
//    connection.end(function(err) {
//     if (err) {
//       return console.log("Ошибка: " + err.message);
//     }
//     console.log("Подключение закрыто");
//   });
  