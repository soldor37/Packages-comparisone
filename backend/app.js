const mysql = require("mysql2");
require('dotenv').config();
const bodyParser = require("body-parser");
// получаем модуль Express
const express = require("express");
//для работы с аутонтификацией по токену
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// создаем приложение
const app = express();
const router = express.Router();
var cors = require('cors')
app.use(router)
app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.set("view engine", "hbs");

const urlencodedParser = bodyParser.urlencoded({extended: false});
console.log({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
let pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});
let connect = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            !err ? resolve(connection) : reject(err)
        });
    })
}

let find = (sql, params) => {
    return new Promise(async (resolve, reject) => {
        let connection = await connect();
        connection.query(sql, [{
            ...params
        }], (err, results, fields) => {
            !err ? resolve(results) : reject(err)
            connection.release();
        });
    })
}

let insert = (sql, params) => {
    return new Promise(async (resolve, reject) => {
        let connection = await connect();
        connection.query(sql, [{
            ...params
        }], (err, results, fields) => {
            !err ? resolve(results) : reject(err)
            connection.release();
        })
    })
}

let del = (sql, params) => {
    return new Promise(async (resolve, reject) => {
        let connection = await connect();
        connection.query(sql, [{
            ...params
        }], (err, results, fields) => {
            !err ? resolve(results) : reject(err)
            connection.release();
        })
    })
}

let update = (sql, params1, params2) => {
    return new Promise(async (resolve, reject) => {
        let connection = await connect();
        //`UPDATE ${table} SET ? WHERE ?`
        connection.query(sql, [{
            ...params1
        }, {
            ...params2
        }], (err, results, fields) => {
            !err ? resolve(results) : reject(err)
            connection.release();
        })
    })
}
module.exports = {
    connect,
    find,
    insert,
    del,
    update
}



//Import Routes
//руты для работы с упаковками
const postsRoute = require('./routes/posts');
app.use('/posts', postsRoute);
// запускаем сервер на порту 3000
app.listen(3000);
// отправляем сообщение
console.log('Сервер стартовал!');

// получение списка упаковок
// app.get("/packs", function(req, res){
//     getConnection().query("SELECT * FROM packaging", function(err, data) {
//       if(err) return console.log(err);
//       res.render("index.hbs", {
//           packs: data
//       });
//     });
// });


//аутентификация
//CORS middleware
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}
router.use(allowCrossDomain)

//вывод списка пользователей
router.get('/users', function(req, res) {
    return new Promise(async (resolve, reject) => {
        sql = 'SELECT * FROM users';
        let users = await find(sql);
        res.send(JSON.stringify(users));
    });
});
// //аутонтификация по логину и паролю
// router.post('/login', (req, res) => {
//     console.log(req.body)
//     selectByName(req.body.login, (err, user) => {
//         if (err) return res.status(500).send('Error on the server.');
//         if (!user) return res.status(404).send('No user found.');
//         let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
//         if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
//         let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 // expires in 24 hours
//         });
//         res.status(200).send({ auth: true, token: token, user: user });
//     });
// })


// //регистрация администратора
// router.post('/register-admin', function(req, res) {
//     db.insertAdmin([
//         req.body.name,
//         bcrypt.hashSync(req.body.password, 8),
//         1
//     ],
//     function (err) {
//         if (err) return res.status(500).send("There was a problem registering the user.")
//         db.selectByName(req.body.name, (err,user) => {
//             if (err) return res.status(500).send("There was a problem getting user")
//             let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 // expires in 24 hours
//             });
//             res.status(200).send({ auth: true, token: token, user: user });
//         }); 
//     }); 
// });
    


    // insertAdmin(user, callback) {
    //     return this.db.run(
    //         'INSERT INTO users (name,password,is_admin) VALUES (?,?,?)',
    //         user, (err) => {
    //             callback(err)
    //         })
    // }


    // insert(user, callback) {
    //     return this.db.run(
    //         'INSERT INTO users (name,password) VALUES (?,?)',
    //         user, (err) => {
    //             callback(err)
    //         })
    // }


// router.get('/users', function(req, res) {
//     getConnection().query(`SELECT * FROM users`, function (err, data) {
//         if (err) return res.status(500).send("There was a problem getting users.");
//         res.send(JSON.stringify(data));
//     }); 
// });
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
  