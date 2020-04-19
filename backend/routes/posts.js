const express = require('express');
const connection = require('../app');
const router = express.Router();
//TODO: перенести в app.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config')

async function selectByLogin(login) {
    let conn = await connection.connect();
    return new Promise((resolve, reject) => {
        conn.promise().query(`SELECT * FROM users WHERE login = ?`, login)
        .then(result =>{
            ObjectUsers = [];
            ObjectUsers = result[0];
            resolve(ObjectUsers);
            conn.release();
          })
          .catch(function(err) {
            console.log(err.message);
          });
    });
}
//аутонтификация по логину и паролю
router.post('/login', (req, res) => {
    (async () => {
        await selectByLogin(req.body.login)
        let passwordIsValid = bcrypt.compareSync(req.body.password, ObjectUsers[0].password);
        //console.log(bcrypt.hashSync(req.body.password,8))
        if (!passwordIsValid)return res.status(401).send({ auth: false, token: null });
        let token = jwt.sign({ id: ObjectUsers[0].id }, config.secret, { expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token, user: ObjectUsers[0] });
    })();
})
// const selectByName = function(name, callback) {
//     return connection.getConnection.query(
//         `SELECT * FROM users WHERE login = ?`,
//         [name],function(err,row){
//             callback(err,row)

//         })
// }
//регистрация новых пользователей
router.post('/register', function(req, res) {
    getConnection().Db_methods.insert([
        req.body.name,
        bcrypt.hashSync(req.body.password, 8)
    ],
    function (err) {
        if (err) return res.status(500).send("There was a problem registering the user.")
        selectByName(req.body.name, (err,user) => {
            if (err) return res.status(500).send("There was a problem getting user")
            let token = jwt.sign({ id: user.id }, config.secret, {expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token, user: user });
        }); 
    }); 
});
router.get('/users', function (req, res) {
    let sql = "SELECT * FROM users WHERE login = 'admin'";
    return new Promise(async (resolve, reject) => {
        let data = await connection.find(sql);
        res.send(JSON.stringify(data));
    });
});
let ObjectUsers = [];

//---------------работа с упаковками------------------
router.get('/', function (req, res) {
    let sql = "SELECT idpack, pack_name FROM packaging";
    return new Promise(async (resolve, reject) => {
        let data = await connection.find(sql);
        res.send(data);
    });
});

router.get('/ecol_dict', function (req, res) {
    let sql = "SELECT distinct ecol_name FROM ecol_charact;";
    return new Promise(async (resolve, reject) => {
        let data = await connection.find(sql);
        res.send(data);
    });
});

router.post('/insert', function (req, res) {
    console.log(req.body)
    let sql1 = `INSERT INTO packaging(pack_name) VALUES('${req.body.name}');LAST_INSERT_ID();`
    // let materials = req.body.materials;
    // let ecolkoeff = req.body.ecolkoeff;
    return new Promise(async (resolve, reject) => {
        await connection.insert(sql1); //вносим изменения в таблицу названий упаковок
        // return new Promise(async (resolve, reject) => {
        //     let conn = await connection.connect();
        //     materials.forEach(function(mat){
        //         conn.promise().query(`UPDATE material_weight SET material_weight = '${mat.mass}' WHERE fk_id_pack = '${req.body.id}' and fk_id_material = '${mat.idmaterials}';`)
        //         .then(result =>{
        //             mat.ecolcharacts.forEach(function(eco){
        //                 conn.promise().query(`UPDATE ecol_charact SET ecol_value = '${eco.value}' WHERE idecol = '${eco.idecol}' and fk_id_material = '${mat.idmaterials}';`)
        //             });
        //         })
        //         .then(result =>{
        //             ecolkoeff.forEach(function(eco){
        //                 conn.promise().query(`UPDATE ecol_criteria SET value = '${eco.value}' WHERE idecol_criteria = '${eco.idecol_criteria}';`)
        //             });
        //         })
        //         .then(result =>{
        //             conn.release();
        //         })
        //         .catch(function(err) {
        //             console.log(err.message);
        //     });
        // })

        
        // });
        res.send('Data insert received');
    });
    
});
//удаление упаковки вместе с принадлежащими ей весовыми значения материалов
router.post('/delete', function (req, res) {
    let sql = `DELETE FROM packaging WHERE idpack = '${req.body.id}';`
    let materials = req.body.materials;
    return new Promise(async (resolve, reject) => {
        await connection.del(sql); //вносим изменения в таблицу названий упаковок
        return new Promise(async (resolve, reject) => {
            let conn = await connection.connect();
            materials.forEach(function(mat){
                conn.promise().query(`DELETE FROM material_weight WHERE fk_id_pack = '${req.body.id}';`)
                .then(result =>{
                    conn.release();
                })
                .catch(function(err) {
                    console.log(err.message);
                });
            })
        res.send('Data delete received')
        });
    });
    
});

router.post('/edit', function (req, res) {
    let sql1 = `UPDATE packaging SET pack_name = '${req.body.name}' WHERE idpack = '${req.body.id}';`
    let materials = req.body.materials;
    let ecolkoeff = req.body.ecolkoeff;
    return new Promise(async (resolve, reject) => {
        await connection.update(sql1); //вносим изменения в таблицу названий упаковок
        return new Promise(async (resolve, reject) => {
            let conn = await connection.connect();
            materials.forEach(function(mat){
                conn.promise().query(`UPDATE material_weight SET material_weight = '${mat.mass}' WHERE fk_id_pack = '${req.body.id}' and fk_id_material = '${mat.idmaterials}';`)
                .then(result =>{
                    mat.ecolcharacts.forEach(function(eco){
                        conn.promise().query(`UPDATE ecol_charact SET ecol_value = '${eco.value}' WHERE idecol = '${eco.idecol}' and fk_id_material = '${mat.idmaterials}';`)
                    });
                })
                .then(result =>{
                    ecolkoeff.forEach(function(eco){
                        conn.promise().query(`UPDATE ecol_criteria SET value = '${eco.value}' WHERE idecol_criteria = '${eco.idecol_criteria}';`)
                    });
                })
                .then(result =>{
                    conn.release();
                })
                .catch(function(err) {
                    console.log(err.message);
            });
        })

        res.send('Data edit received');
        });
        
    });
    
});
// ---------------работа с материалами(панель редактирования материалов)----------------
router.post('/insertMaterial', function (req, res) {
    let sql = `INSERT INTO materials(material_name) VALUES('${req.body.material_name}')`;
    return new Promise(async (resolve, reject) => {
        await connection.insert(sql);
        res.send('Data insert received');
    });
});
//удаление упаковки вместе с принадлежащими ей весовыми значения материалов
router.post('/deleteMaterial', function (req, res) {
    let sql = `DELETE FROM materials WHERE idmaterials = '${req.body.idmaterials}';`;
    return new Promise(async (resolve, reject) => {
        await connection.update(sql);
        res.send('Data delete received');
    });
    
});

router.post('/editMaterial', function (req, res) {
    let sql = `UPDATE materials SET material_name = '${req.body.material_name}' WHERE idmaterials = '${req.body.idmaterials}';`;
    return new Promise(async (resolve, reject) => {
        await connection.update(sql);
        res.send('Data edit received');
    });
    
});
// ---------------------Расчеты для сравнения--------------------------
router.post('/calc', function (req, res) {
    let packid = req.body.params.ID;
    (async () => {
        await calculation(packid);
        res.send(ObjectGraph);
    })();
        
});
var ObjectEcos = {
    packs: [],
    weightMaterial: [],
    calculated: [],
    comparativeWeight: [],
}
var ObjectGraph = [];

async function calculation(packid) {
    try {
       await calcFormula1(packid);
       await calcFormula2(packid);      
    }
    catch (error) {
        console.log(error.message);
    }
}
//считает по второй формуле, создает 2 объекта с этими данными
async function calcFormula2(packid) {
    ObjectEcos.calculated = [];
    ObjectGraph = [];
    for (let variable in packid){
        if(typeof  ObjectGraph[variable] == 'undefined') 
        {
            ObjectGraph[variable] = {};
        }
        if(typeof  ObjectGraph[variable].name == 'undefined') 
        {
            ObjectGraph[variable].name = 0;
        }
        await getPacks(packid[variable]);
        ObjectGraph[variable].name = ObjectEcos.packs[0].pack_name;
        await getWeightMaterial(packid[variable]);
        var end_value = 0;
        ObjectEcos.weightMaterial.forEach(function (key) {
        var name = key.ecol_name;
        var weight = key.material_weight;
        var value = key.ecol_value;
        end_value = value * weight;
        
        if(typeof  ObjectEcos.calculated[variable] == 'undefined') 
        {
            ObjectEcos.calculated[variable] = [];
        }
        if(typeof  ObjectEcos.calculated[variable][name] == 'undefined') 
        {
            ObjectEcos.calculated[variable][name] = 0;
        }
        ObjectEcos.calculated[variable][name] += Number(end_value);
    })
    }
    for (key in ObjectEcos.calculated){
        for (let name in ObjectEcos.calculated[key]){
            ObjectEcos.calculated[key][name] = Number(ObjectEcos.calculated[key][name]) / Number(ObjectEcos.comparativeWeight[name]);
            if(typeof  ObjectGraph[key].data == 'undefined') 
            {
                ObjectGraph[key].data = [];
            }
            ObjectGraph[key].data.push((Number(ObjectEcos.calculated[key][name])).toFixed(3));
        }
        
    }
    console.log(ObjectGraph);
    //console.log(ObjectEcos.calculated);
    return Promise.resolve(ObjectGraph);
    
}
//Считает сумму абсолютных значений экологических характеристик выбранных упаковок для значенателя второй формулы
 async function calcFormula1(packid) {
            ObjectEcos.comparativeWeight = [];
            for (let variable in packid){
                //console.log("упаковка -",packid[variable]);
              await getWeightMaterial(packid[variable]);
                var end_value = 0;
                ObjectEcos.weightMaterial.forEach(function (key) {
                    var name = key.ecol_name;
                    var weight = key.material_weight;
                    var value = key.ecol_value;
                    end_value = value * weight;
                    //console.log("данные:",value,weight,end_value);
                    if(typeof  ObjectEcos.comparativeWeight[name] == 'undefined') 
                    {
                        ObjectEcos.comparativeWeight[name] = 0;
                    }
                    ObjectEcos.comparativeWeight[name] += Number(end_value);
                })
                //console.log("Добавили в структуру такую вот фигню -",ObjectEcos.comparativeWeight);   
            }    
}

async function getWeightMaterial(idpack) {
    let conn = await connection.connect();
    return new Promise((resolve, reject) => {
        //console.log("За инфой Пришла пачка -",idpack);
        conn.promise().query(`SELECT
        material_weight.fk_id_material, ecol_name, ecol_value, material_weight, fk_id_pack
        FROM
        mydb.ecol_charact
        inner join
        material_weight
        on
        ecol_charact.fk_id_material = material_weight.fk_id_material
        where
        material_weight.fk_id_pack = `+ idpack)
        .then(result =>{
            ObjectEcos.weightMaterial = result[0];
          })
          .then(result =>{
            //console.log(ObjectEcos.weightMaterial);
            resolve(ObjectEcos.weightMaterial);
            conn.release();
          })
          .catch(function(err) {
            console.log(err.message);
            reject();
          });
    });
}

async function getPacks(idpack) {
    let conn = await connection.connect();
    return new Promise((resolve, reject) => {
        //console.log("За инфой Пришла пачка -",idpack);
        conn.promise().query(`SELECT idpack, pack_name FROM packaging WHERE idpack =` + idpack)
        .then(result =>{
            ObjectEcos.packs = result[0];
          })
          .then(result =>{
            console.log(ObjectEcos.packs);
            resolve(ObjectEcos.packs);
            conn.release();
          })
          .catch(function(err) {
            console.log(err.message);
            reject();
          });
    });
}
 
//------------Парсинг таблиц из БД----------------
//таблица названий материалов
router.get('/DBmaterials', function (req, res) {
    let sql = "SELECT * FROM materials;"
    return new Promise(async (resolve, reject) => {
        let data = await connection.find(sql);
        res.send(data);
    });
});
//таблица весов материалов
router.get('/DBweight', function (req, res) {
    let sql = "SELECT * FROM mydb.material_weight;"
    return new Promise(async (resolve, reject) => {
        let data = await connection.find(sql);
        res.send(data);
    });
});
//таблица экологических характеристик
router.get('/DBecolchar', function (req, res) {
    let sql = "SELECT * FROM mydb.ecol_charact;"
    return new Promise(async (resolve, reject) => {
        let data = await connection.find(sql);
        res.send(data);
    });
});
//таблица экол критериев (коэфф)
router.get('/DBecolkoeff', function (req, res) {
    let sql = "SELECT * FROM mydb.ecol_criteria;"
    return new Promise(async (resolve, reject) => {
        let data = await connection.find(sql);
        res.send(data);
    });
});
// function getSettingsEco(packid) {
//     connection.getConnection.query(`SELECT 
//     *
// FROM
//     ecol_charact,
//     materials,
//     packaging
// WHERE
//     fk_id_material = idmaterials && idpack = `+ packid, function (error, fields) {
//         if (error) {
//             throw error;
//         }
//         ObjectEcos.eco = fields;
//         //console.log(ObjectEcos.eco);
//     });
// }




// const mass1 = [];
// //получаем значения экол харок по 1 упаковке для air
// router.get('/mass1', function (req, res) {
//     connection.getConnection.query(`SELECT 
//     ecol_value
// FROM
//     ecol_charact,
//     materials,
//     packaging
// WHERE
//     fk_id_material = idmaterials && idpack = 1 && ecol_name = 'air';`, function (error, fields, result) {
//         if (error) {
//             throw error;
//         }
//         mass1.push(fields);
//         res.send(JSON.stringify(mass1));
//     });

// });

// router.get('/packmaterialweight', function (req, res) {
//     connection.getConnection.query(`SELECT 
//     pack_name, material_name, material_weight
// FROM
//     materials
//         LEFT JOIN
//     material_weight ON fk_id_material = idmaterials
//         LEFT JOIN
//     packaging ON idpack = fk_id_pack`, function (error, fields, result) {
//         if (error) {
//             throw error;
//         }
//         const packs = fields;
//         res.send(JSON.stringify(packs));
//     });
// });

// router.get('/packmaterialecol', function (req, res) {
//     connection.getConnection.query(`SELECT 
//     *
// FROM
//     ecol_charact,
//     materials,
//     packaging
// WHERE
//     fk_id_material = idmaterials;`, function (error, fields, result) {
//         if (error) {
//             throw error;
//         }
//         const packs = fields;
//         res.send(JSON.stringify(packs));
//     });
// });

module.exports = router;