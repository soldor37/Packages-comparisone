const express = require('express');
const connection = require('../app');
const router = express.Router();

router.get('/', function (req, res) {
    var packs = [
        { value: null, text: 'Выбери упаковку' },
        { "value": 1, "text": "test1" },
        { "value": 2, "text": "test2" },
        { "value": 3, "text": "test3" },
    ];
    res.send(JSON.stringify(packs));
    //res.send("We are on posts");
    // connection.getConnection.query('SELECT * FROM packaging', function (error, fields, result) {
    //     if (error) {
    //         throw error;
    //     }
    //     const packs = fields;
    //     res.send(JSON.stringify(packs));
    // });
});

router.post('/calc', function (req, res) {
    var ret = {
        x: [1, 3, 4, 1, 3, 5, 7, 2],
        y: [13, 1, 31, 2, 3, 5, 7, 2],
    }
});

router.get('/packmaterialweight', function (req, res) {
    //res.send("We are on posts");
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
    //res.send("We are on posts");
    connection.getConnection.query(`SELECT 
    ecol_name, ecol_value, material_name, pack_name
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