SELECT 
    ecol_name, ecol_value, material_name, pack_name
FROM
    ecol_charact,
    materials,
    packaging
WHERE
    fk_id_material = idmaterials;