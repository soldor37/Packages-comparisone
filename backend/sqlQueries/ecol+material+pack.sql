<<<<<<< HEAD
SELECT 
    ecol_name, ecol_value, material_name, pack_name
FROM
    ecol_charact,
    materials,
    packaging
WHERE
=======
SELECT 
    ecol_name, ecol_value, material_name, pack_name
FROM
    ecol_charact,
    materials,
    packaging
WHERE
>>>>>>> 7c674413fe2cea5fdbc49d2664d04217f24bd20b
    fk_id_material = idmaterials;