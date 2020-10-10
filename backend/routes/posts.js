const express = require('express');
const connection = require('../app');
const router = express.Router();
//TODO: перенести в app.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config')

let ObjectUsers = [];

async function selectByLogin(login) {
    let conn = await connection.connect();
    return new Promise((resolve, reject) => {
        conn.promise().query(`SELECT * FROM users WHERE login = ?`, login)
            .then(result => {
                ObjectUsers = [];
                ObjectUsers = result[0];
                resolve(ObjectUsers);
                conn.release();
            })
            .catch(function (err) {
                console.log(err.message);
            });
    });
}
//аутентификация по логину и паролю
router.post('/login', (req, res) => {
    (async () => {
        await selectByLogin(req.body.login)
        let passwordIsValid = bcrypt.compareSync(req.body.password, ObjectUsers[0].password);
        //console.log(bcrypt.hashSync(req.body.password,8))
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        let token = jwt.sign({ id: ObjectUsers[0].id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
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
// router.post('/register', function (req, res) {
//     getConnection().Db_methods.insert([
//         req.body.name,
//         bcrypt.hashSync(req.body.password, 8)
//     ],
//         function (err) {
//             if (err) return res.status(500).send("There was a problem registering the user.")
//             selectByName(req.body.name, (err, user) => {
//                 if (err) return res.status(500).send("There was a problem getting user")
//                 let token = jwt.sign({ id: user.id }, config.secret, {
//                     expiresIn: 86400 // expires in 24 hours
//                 });
//                 res.status(200).send({ auth: true, token: token, user: user });
//             });
//         });
// });
router.get('/users', function (req, res) {
    let sql = "SELECT * FROM users WHERE login = 'admin'";
    return new Promise(async (resolve, reject) => {
        let data = await connection.find(sql);
        res.send(JSON.stringify(data));
    });
});
router.get('/usersAdmPanel', function (req, res) {
    let sql = "SELECT id, login, is_admin FROM users";
    return new Promise(async (resolve, reject) => {
        let data = await connection.find(sql);
        res.send(JSON.stringify(data));
    });
});

router.post('/insertUser', function (req, res) {
        let pass = bcrypt.hashSync(req.body.password, 8);
        let adminBooltoInt = Number(Boolean(req.body.is_admin))
        return new Promise(async (resolve, reject) => {
            connection.find(`INSERT INTO users(login, password, is_admin) VALUES('${req.body.login}', '${pass}','${adminBooltoInt}');`)
            res.send('Data insert received');
        });
});

router.post('/deleteUser', function (req, res) {
    console.log(req.body)
    return new Promise(async (resolve, reject) => {
        connection.find(`DELETE FROM users WHERE id = '${req.body.id}';`)
        res.send('Data insert received');
    });
});
//---------------работа с упаковками------------------
router.get('/', function (req, res) {
    let sql = "SELECT idpack, pack_name FROM packaging";
    return new Promise(async (resolve, reject) => {
        let data = await connection.find(sql);
        res.send(data);
    });
});
router.get('/groups', function (req, res) {
    let sql = `SELECT 
    idpack, pack_name, fk_id_group, pack_groups.name
FROM
    packaging
        JOIN
    pack_combination ON id_pack = idpack
        JOIN
    pack_groups ON idpack_groups = fk_id_group`;
    return new Promise(async (resolve, reject) => {
        let data = await connection.find(sql);
        
        let tmp = data.reduce((r, a) => {
            r[a.fk_id_group] = [...r[a.fk_id_group] || [], a];
            return r;
        }, {})

        tmp = Object.values(tmp);
        let groups = tmp.map(combo => {
            let ret = {
                idgroup: combo[0].fk_id_group,
                name: combo[0].name,
                packs: []
            };
            combo.forEach(el => {
                ret.packs.push({idpack:el.idpack, pack_name: el.pack_name})
            });
            return ret
        })

        /*тоже самое, что выше, только некрасиво
        let groups = [];
         for (index in tmp){
             let group = {
                 idgroup: null,
                 name: '',
                 packs: []
             };
             let tmpPack;
             tmp[index].forEach(function (item) {
                 //console.log(item.fk_id_group)
                 if (group.idgroup == 0){
                     group.idgroup = item.fk_id_group;
                     group.name = item.name;
                     tmpPack = {
                         idpack: item.idpack,
                         pack_name: item.pack_name
                     }
                     group.packs.push(tmpPack);
                 }
                 else if(group.idgroup != item.fk_id_group){
                    groups.push(group);
                     group.idgroup = item.fk_id_group;
                     group.name = item.name;
                    tmpPack = {
                        idpack: item.idpack,
                        pack_name: item.pack_name
                     }
                     group.packs.push(tmpPack);
                 }
                 else{
                    tmpPack = {
                         idpack: item.idpack,
                         pack_name: item.pack_name
                 }
                     group.packs.push(tmpPack);
                 }
                
             });
        }*/
        
        //console.log(groups)
        res.send(groups);
    });
});
router.get('/ecol_dict', function (req, res) {
    let sql = `SELECT DISTINCT ecol_name, ecol_measure FROM ecol_charact;`;
    return new Promise(async (resolve, reject) => {
        let data = await connection.find(sql);
        res.send(data);
    });
});

router.post('/insert', function (req, res) {
    
    return new Promise(async (resolve, reject) => {
        let lastID = 0;
        let conn = await connection.connect();
        conn.promise().query(`INSERT INTO packaging(pack_name) VALUES('${req.body.name}')`,
            function (err, result) {
                if (err) throw err;
                lastID = result.insertId;
                //console.log(lastID)
                req.body.materials.forEach(function (mat) {
                    connection.find(`INSERT INTO material_weight(fk_packaging, fk_materials, material_weight) VALUES('${lastID}', '${mat.id}','${mat.value}');`)
                })
            })
            .then(result => {
                conn.release();
            })
            .catch(function (err) {
                console.log(err.message);
            });
        res.send('Data insert received');
    });

});
//удаление упаковки вместе с принадлежащими ей весовыми значения материалов
router.post('/delete', function (req, res) {
    let materials = req.body.materials;
    let sql = `DELETE FROM packaging WHERE idpack = '${req.body.id}';`;
    return new Promise(async (resolve, reject) => {
        await connection.del(sql);
        let conn = await connection.connect();
        materials.forEach(function (mat) {
            conn.promise().query(`DELETE FROM material_weight WHERE fk_packaging = '${req.body.id}';`)
                .then(result => {
                    conn.release();
                })
                .catch(function (err) {
                    console.log(err.message);
                });

        });
        res.send('Data delete received');
    });
});

router.post('/edit', function (req, res) {
    let sql1 = `UPDATE packaging SET pack_name = '${req.body.name}' WHERE idpack = '${req.body.id}';`
    let materials = req.body.materials;
    return new Promise(async (resolve, reject) => {
        await connection.update(sql1); //вносим изменения в таблицу названий упаковок
        return new Promise(async (resolve, reject) => {
            let conn = await connection.connect();
            materials.forEach(function (mat) {
                conn.promise().query(`UPDATE material_weight SET material_weight = '${mat.mass}' WHERE fk_packaging = '${req.body.id}' and fk_materials = '${mat.idmaterials}';`)
                    .then(result => {
                        conn.release();
                    })
                    .catch(function (err) {
                        console.log(err.message);
                    });
            })

            res.send('Data edit received');
        });

    });

});
// ---------------работа с материалами(панель редактирования материалов)----------------
router.post('/insertMaterial', function (req, res) {
    //console.log(req.body)
    let ecol_dict = [
        {
            'name': 'CO2',
            'idecol': '14'
        },
        {
            'name': 'Water',
            'idecol': '15'
        },
        {
            'name': 'Energy',
            'idecol': '13'
        },
        {
            'name': 'OilConsumption',
            'idecol': '16'
        },
        {
            'name': 'Garbage',
            'idecol': '17'
        },
        {
            'name': 'WaterConsumption',
            'idecol': '18'
        },
    ]
    return new Promise(async (resolve, reject) => {
        let lastID = 0;
        let conn = await connection.connect();
        conn.promise().query(`INSERT INTO materials(material_name) VALUES('${req.body.name_material}')`,
            function (err, result) {
                if (err) throw err;
                lastID = result.insertId;
                //console.log(lastID)
                ecol_dict.forEach(function (eco) {
                    //console.log(`INSERT INTO ecol_charact(ecol_name, fk_id_material, ecol_value, ecol_measure) VALUES('${eco.name}', '${lastID}','${req.body[eco.name]}','${eco.message}');`)
                    connection.find(`INSERT INTO ecolchar_value(ecol_value, fk_ecol_charact, fk_materials) VALUES('${req.body[eco.name]}','${eco.idecol}','${lastID}');`)
                })
            })
            .then(result => {
                conn.release();
            })
            .catch(function (err) {
                console.log(err.message);
            });
        res.send('Data insert received');
    });
});
//удаление упаковки вместе с принадлежащими ей весовыми значения материалов
router.post('/deleteMaterial', function (req, res) {
    //console.log(req.body)
    let sql = `DELETE FROM materials WHERE idmaterials = '${req.body.idmaterials}';`;
    return new Promise(async (resolve, reject) => {
        await connection.del(sql);
        let conn = await connection.connect();
        conn.promise().query(`DELETE FROM ecolchar_value WHERE fk_materials = '${req.body.idmaterials}';`)
            .then(result => {
                conn.release();
            })
            .catch(function (err) {
                console.log(err.message);
            });
        res.send('Data delete received');
    });

});

router.post('/editMaterial', function (req, res) {
    return new Promise(async (resolve, reject) => {
        let conn = await connection.connect();
        conn.promise().query(`UPDATE materials SET material_name = '${req.body.name}' WHERE idmaterials = '${req.body.idmaterials}';`,
            function (err, result) {
                if (err) throw err;
                req.body.ecolcharacts.forEach(function (eco) {
                    connection.find(`UPDATE ecolchar_value SET ecol_value = '${eco.value}' WHERE fk_materials = '${req.body.idmaterials}' AND fk_ecol_charact = '${eco.idecol}';`)
                })
            })
            .then(result => {
                conn.release();
            })
            .catch(function (err) {
                console.log(err.message);
            });
        res.send('Data edit received');
    });
});
//--------------------критерии-------------------------
router.post('/editCriteria', function (req, res) {
    return new Promise(async (resolve, reject) => {
        let conn = await connection.connect();
        conn.promise().query(`UPDATE ecol_charact SET ecol_criteria = '${req.body.ecol_criteria}' WHERE idecol = '${req.body.idecol}';`)
            .then(result => {
                conn.release();
            })
            .catch(function (err) {
                console.log(err.message);
            });
        res.send('Data edit received');
    });
});
// ---------------------группы упаковок-----------------
router.post('/newGroup', function (req, res) {
    return new Promise(async (resolve, reject) => {
        let lastID = 0;
        let conn = await connection.connect();
        conn.promise().query(`INSERT INTO pack_groups(name) VALUES('${req.body.groupName}')`,
            function (err, result) {
                if (err) throw err;
                lastID = result.insertId;
                //console.log(lastID)
                req.body.packIDs.forEach(function (pack) {
                    connection.find(`INSERT INTO pack_combination(id_pack, fk_id_group) VALUES('${pack}', '${lastID}');`)
                })
            })
            .then(result => {
                conn.release();
            })
            .catch(function (err) {
                console.log(err.message);
            });
        res.send('Data insert received');
    });
});
//удаление группы упаковок
router.post('/deleteGroup', function (req, res) {
    let sql = `DELETE FROM pack_groups WHERE idpack_groups = '${req.body.idgroup}';`;
    return new Promise(async (resolve, reject) => {
        await connection.del(sql);
        let conn = await connection.connect();
        req.body.packs.forEach(function () {
            conn.promise().query(`DELETE FROM pack_combination WHERE fk_id_group = '${req.body.idgroup}';`)
                .then(result => {
                    conn.release();
                })
                .catch(function (err) {
                    console.log(err.message);
                });

        });
        res.send('Data delete received');
    });
});
//редактирование группы упаковок
// router.post('/editGroup', function (req, res) {
//     let sql = `UPDATE pack_groups SET name = '${req.body.name}' WHERE idpack_groups = '${req.body.idgroup}';`
//     return new Promise(async (resolve, reject) => {
//         await connection.update(sql); //вносим изменения в таблицу названий упаковок
//         return new Promise(async (resolve, reject) => {
//             let conn = await connection.connect();
//             req.body.packs.forEach(function (pack) {
//                 //нужно учитывать, что при редактировании группы можно добавить больше упаковок в группы, чем было до этого, поэтому помимо update требуется insert, тут этого не сделано
//                 conn.promise().query(`UPDATE pack_combination SET id_pack = '${pack.idpack}' WHERE fk_id_group = '${req.body.idgroup}' and idpack_combination = '${??}';`)
//                     .then(result => {
//                         conn.release();
//                     })
//                     .catch(function (err) {
//                         console.log(err.message);
//                     });
//             })

//             res.send('Data edit received');
//         });

//     });
// });
// ---------------------Расчеты для сравнения--------------------------
router.post('/calc', function (req, res) {
    let packid = req.body.params.ID;
    (async () => {
        await calculation(packid);
        data = [ObjectGraph, tableData]
        res.send(data);
    })();

});

var ObjectEcos = {
    packs: [],
    weightMaterial: [],
    calculated: [],
    comparativeWeight: [],
    criteria: {
        Energy: 0,
        CO2: 0,
        Water: 0,
        OilConsumption: 0,
        Garbage: 0,
        WaterConsumption: 0
    },
    totalIndex: []
}
var ObjectGraph = [];
//формирование данных для таблицы на панели сравнения
let tableData = [];

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
    tableData = [];
    for (let variable in packid) {
        if (typeof ObjectGraph[variable] == 'undefined') {
            ObjectGraph[variable] = {};
        }
        if (typeof ObjectGraph[variable].name == 'undefined') {
            ObjectGraph[variable].name = 0;
        }
        await getPacks(packid[variable]);
        ObjectGraph[variable].name = ObjectEcos.packs[0].pack_name;
        await getWeightMaterial(packid[variable]);
        tableData[variable] = {
            idpack: packid[variable],
            name: ObjectEcos.packs[0].pack_name,
            materials: [],
            ecols:[],
            totalIndex: 0
        }
        
        tmpidmat = 0;
        ObjectEcos.weightMaterial.map(function(mat){
            idmat = mat.idmaterials;
            tmp = {
                name: mat.material_name,
                value: mat.material_weight,
            }
            if (idmat != tmpidmat){
                tableData[variable].materials.push(tmp)
                tmpidmat = idmat;
            }
        })

        var end_value = 0; //промежуточное значение
        ObjectEcos.weightMaterial.forEach(function (key) {
            var name = key.ecol_name;
            var weight = key.material_weight;
            var value = key.ecol_value;
            end_value = value * weight / 1000; // переводим граммы в килограммы
            if (typeof ObjectEcos.calculated[variable] == 'undefined') {
                ObjectEcos.calculated[variable] = [];
            }
            if (typeof ObjectEcos.calculated[variable][name] == 'undefined') {
                ObjectEcos.calculated[variable][name] = 0;
            }
            ObjectEcos.calculated[variable][name] += Number(end_value);
        })
    }
    //создаем переменную с критериями в удобном формате
    let ecol_count = 0;
    for (name in ObjectEcos.criteria) {
        ObjectEcos.criteria[name] = ObjectEcos.weightMaterial[ecol_count].ecol_criteria;
        ecol_count++;
    }
    //TODO: Костыль, чтобы не брать ед. измерения из БД. Будет время- уберу
    let ecol_dict = [
        {
            name: 'Energy',
            measure: 'MJ/kg'
        },
        {
            name: 'CO2',
            measure: 'm^3/kg'
        },
        {
            name: 'Water',
            measure: 'l/kg'
        },
        {
            name: 'OilConsumption',
            measure: 'l/kg'
        },
        {
            name: 'Garbage',
            measure: 'kg'
        },
        {
            name: 'WaterConsumption',
            measure: 'l/kg'
        },
    ]

    for (key in ObjectEcos.calculated) {
        ObjectEcos.totalIndex[key] = 0;
        for (let name in ObjectEcos.calculated[key]) {
            ObjectEcos.calculated[key][name] = Number(ObjectEcos.calculated[key][name]) / Number(ObjectEcos.comparativeWeight[name]);
            ObjectEcos.totalIndex[key] = ObjectEcos.totalIndex[key] + ObjectEcos.calculated[key][name] * ObjectEcos.criteria[name];
            if (typeof ObjectGraph[key].data == 'undefined') {
                ObjectGraph[key].data = [];
            }
            ObjectGraph[key].data.push((Number(ObjectEcos.calculated[key][name])).toFixed(3));
            //берем единицы измерения из словаря
            let tmpmeasure = '';
            ecol_dict.map(function(ecol){
                if(ecol.name == name){
                    tmpmeasure = ecol.measure
                }
            })
            tmpecol = {
                name: name,
                measure: tmpmeasure,
                value: (Number(ObjectEcos.calculated[key][name])).toFixed(3)
            }
            tableData[key].ecols.push(tmpecol)
        }
    }



    // считаем сумму по всем упаковкам для 3 формулы
    let IndexSum = 0;
    ObjectEcos.totalIndex.forEach(function (key) {
        IndexSum = IndexSum + key;
    })
    for (key in ObjectEcos.calculated) {
        ObjectEcos.totalIndex[key] = ObjectEcos.totalIndex[key] / IndexSum;
        ObjectGraph[key].data.push((Number(ObjectEcos.totalIndex[key])).toFixed(3));
        tableData[key].totalIndex = (Number(ObjectEcos.totalIndex[key])).toFixed(3);
    }
    //console.log(ObjectEcos.criteria);
    //console.log(ObjectEcos.totalIndex);
    //console.log(ObjectEcos);
    //console.log(ObjectGraph);
    //console.log(tableData[0]);
    return Promise.resolve(ObjectGraph);

}
//Считает сумму абсолютных значений экологических характеристик выбранных упаковок для знаменателя второй формулы
async function calcFormula1(packid) {
    ObjectEcos.comparativeWeight = [];
    for (let variable in packid) {
        //console.log("упаковка -",packid[variable]);
        await getWeightMaterial(packid[variable]);
        var end_value = 0;
        ObjectEcos.weightMaterial.forEach(function (key) {
            var name = key.ecol_name;
            var weight = key.material_weight;
            var value = key.ecol_value;
            end_value = value * weight / 1000; // переводим граммы в килограммы
            //console.log("данные:",value,weight,end_value);
            if (typeof ObjectEcos.comparativeWeight[name] == 'undefined') {
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
        materials.idmaterials, materials.material_name, ecol_charact.ecol_name, ecol_charact.ecol_criteria, ecol_charact.ecol_measure, ecol_value, material_weight.material_weight, material_weight.fk_packaging
    FROM
        ecolchar_value
            JOIN
        ecol_charact ON idecol = fk_ecol_charact
            JOIN
        materials ON idmaterials = fk_materials
         JOIN
        material_weight ON idmaterials = material_weight.fk_materials
        where material_weight.fk_packaging = `+ idpack)
            .then(result => {
                ObjectEcos.weightMaterial = result[0];
            })
            .then(result => {
                //console.log(ObjectEcos.weightMaterial);
                resolve(ObjectEcos.weightMaterial);
                conn.release();
            })
            .catch(function (err) {
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
            .then(result => {
                ObjectEcos.packs = result[0];
            })
            .then(result => {
                //console.log(ObjectEcos.packs);
                resolve(ObjectEcos.packs);
                conn.release();
            })
            .catch(function (err) {
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
    let sql = "SELECT * FROM material_weight;"
    return new Promise(async (resolve, reject) => {
        let data = await connection.find(sql);
        res.send(data);
    });
});
//таблица названий экологических характеристик + критерии
router.get('/DBecolchar', function (req, res) {
    let sql = "SELECT idecol, ecol_measure, ecol_value, fk_materials, ecol_charact.ecol_name FROM ecolchar_value JOIN ecol_charact on fk_ecol_charact = idecol;"
    return new Promise(async (resolve, reject) => {
        let data = await connection.find(sql);
        res.send(data);
    });
});
//таблица критериев ecol_charact
router.get('/DBcriteria', function (req, res) {
    let sql = "SELECT * FROM ecol_charact"
    return new Promise(async (resolve, reject) => {
        let data = await connection.find(sql);
        res.send(data);
    });
});
//таблица значений экол характеристик
router.get('/DBecolvalue', function (req, res) {
    let sql = "SELECT * FROM ecolchar_value;"
    return new Promise(async (resolve, reject) => {
        let data = await connection.find(sql);
        res.send(data);
    });
});

// ---------------страны и года
//таблица значений экол характеристик
// router.get('/DBcountries', function (req, res) {
//     let sql = "SELECT * FROM ecolchar_value;"
//     return new Promise(async (resolve, reject) => {
//         let data = await connection.find(sql);
//         res.send(data);
//     });
// });
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