const http = require("http");
const mysql = require("mysql2");
// получаем модуль Express
const express = require("express");
// создаем приложение
const app = express();

/**
 * @type {Pool}
 */
var db = null;
 
// http.createServer(router).listen(3000);
// console.log('Server running on port 3000.');
//------------------------------------------------//
/**
 * @return {Pool}
 */
function getConncetion() {
    if (db === null) {
        db = mysql.createPool(getConfig())
    }
    return db;
}
/**
 * @returns {Object}
 */
function getConfig() {
    return {
        host: 'localhost',
        user: 'root',
        password: 'admin',
        database: 'mydb'
    };
}
app.get('/', function(req, res) {
    res.sendfile('index.html');
  });

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
  