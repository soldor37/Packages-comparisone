const express = require('express');
const connection = require('../app');
const router = express.Router();

router.get('/', function (req, res) {
    // var packs = [
    //     { value: null, text: 'Выберите упаковку'},
    //     { "value": 1, "text": "test1" },
    //     { "value": 2, "text": "test2" },
    //     { "value": 3, "text": "test3" },
    // ];
    // console.log(packs);
    // res.send(JSON.stringify(packs));
    connection.getConnection.query("SELECT idpack, pack_name FROM packaging", function (err, data) {
        if (err) return console.log(err);
        res.send(data);
    });
    //код ниже для изменения в бд таблиц https://metanit.com/web/nodejs/8.6.php
    // connection.getConnection.query("SELECT * FROM packaging", function(err, data) {
    //     if(err) return console.log(err);
    //     res.render("index.hbs", {
    //         packs: data
    //     });

    //   });
});


router.post('/calc', function (req, res) {
    let packid = req.body.params.ID;
    // new Promise((resolve, reject) => {
    //     calcFormula1(packid)
    //     .then(result =>{
    //         calcFormula2(packid);
            
    //     })
    //     .then(result => {
    //         console.log(ObjectGraph);
    //         res.send(ObjectGraph);  
    //         resolve();
    //     })
    //     .catch(function(err){
    //         console.log(err.message);
    //         reject();
    //     })
    // });
    (async () => {
        await askMom(packid);
        res.send(ObjectGraph);
    })();
        
});
var ObjectEcos = {
    eco: [],
    weightMaterial: [],
    calculated: [],
    comparativeWeight: [],
}
var ObjectGraph = [];

async function askMom(packid) {
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
        if(typeof  ObjectGraph[variable].idpack == 'undefined') 
        {
            ObjectGraph[variable].idpack = 0;
        }
        ObjectGraph[variable].idpack = packid[variable];
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
        //ObjectEcos.calculated[variable][name] = Number(ObjectEcos.calculated[variable][name]) / Number(ObjectEcos.comparativeWeight[name]); 
    })
    }
    for (key in ObjectEcos.calculated){
        for (let name in ObjectEcos.calculated[key]){
            ObjectEcos.calculated[key][name] = Number(ObjectEcos.calculated[key][name]) / Number(ObjectEcos.comparativeWeight[name]);
            if(typeof  ObjectGraph[key].data == 'undefined') 
            {
                ObjectGraph[key].data = [];
            }
            ObjectGraph[key].data.push(ObjectEcos.calculated[key][name]);
        }
        
    }
    //console.log(ObjectGraph);
    return Promise.resolve(ObjectGraph);
    //console.log(ObjectEcos.calculated);
}
//Сумма значений экол характеристик для значенателя второй формулы
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
    return new Promise((resolve, reject) => {
        //console.log("За инфой Пришла пачка -",idpack);
        connection.getConnection.query(`SELECT
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
          })
          .catch(function(err) {
            console.log(err.message);
            reject();
          });
    });
}

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
router.get('/packmaterialweight', function (req, res) {
    connection.getConnection.query(`SELECT 
    pack_name, material_name, material_weight
FROM
    materials
        LEFT JOIN
    material_weight ON fk_id_material = idmaterials
        LEFT JOIN
    packaging ON idpack = fk_id_pack`, function (error, fields, result) {
        if (error) {
            throw error;
        }
        const packs = fields;
        res.send(JSON.stringify(packs));
    });
});

router.get('/packmaterialecol', function (req, res) {
    connection.getConnection.query(`SELECT 
    *
FROM
    ecol_charact,
    materials,
    packaging
WHERE
    fk_id_material = idmaterials;`, function (error, fields, result) {
        if (error) {
            throw error;
        }
        const packs = fields;
        res.send(JSON.stringify(packs));
    });
});
module.exports = router;