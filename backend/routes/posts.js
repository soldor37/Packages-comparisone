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
    // for (let variable in packid){
    //     calcFormula1(packid[variable]);
    // }
    calcFormula2(packid);
    //res.send(ObjectEcos.calculated);
    res.send(ObjectEcos.comparativeWeight);
});
var ObjectEcos = {
    eco: [],
    weightMaterial: [],
    calculated: 0,
    comparativeWeight: []
}
//возвращает первую формулу по одной упаковке, перезаписывает объект с этими данными
function calcFormula1(packid) {
    ObjectEcos.calculated = [];
    ObjectEcos.comparativeWeight = [];
    getSettingsEco(packid);
    getWeightMaterial(packid);
    var end_value = 0;

    ObjectEcos.weightMaterial.forEach(function (key) {
        var pack = key.fk_id_pack;
        var name = key.ecol_name;
        var weight = key.material_weight;
        var value = key.ecol_value;
        end_value = value * weight;
        
        if(typeof  ObjectEcos.calculated[name] == 'undefined') 
        {
            ObjectEcos.calculated[name] = 0;
        }
        
        ObjectEcos.calculated[name] += Number(end_value);
        
    })
    console.log(ObjectEcos.calculated);
}
//возвращает вторую формулу по выбранным упаковкам, перезаписывает объект с этими данными
function calcFormula2(packid) {
    for (let variable in packid){
        ObjectEcos.comparativeWeight = [];
        //console.log("упаковка -",packid[variable]);
        getWeightMaterial(packid[variable]);
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
        console.log("Добавили в структуру такую вот фигню -",ObjectEcos.comparativeWeight);
    }
    
}

function getWeightMaterial(idpack) {
    console.log("За инфой Пришла пачка -",idpack);
    connection.getConnection.query(`SELECT
    material_weight.fk_id_material, ecol_name, ecol_value, material_weight
    FROM
    mydb.ecol_charact
    inner join
    material_weight
    on
    ecol_charact.fk_id_material = material_weight.fk_id_material
    where
    material_weight.fk_id_pack = `+ idpack, function (error, fields, result) {
        if (error) {
            throw error;
        }
        ObjectEcos.weightMaterial = fields;
        console.log(ObjectEcos.weightMaterial)
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