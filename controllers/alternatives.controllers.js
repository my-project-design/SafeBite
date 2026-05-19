const db = require("../config/db");

//getAll
function getAllAlternatives(req, res) {
  const query = `
    SELECT 
      a.alternative_id,
      a.product_id,
      p.product_name,
      a.health_category_id,
      hc.category_name,
      a.recipe_name,
      a.instruction,
      a.ingredients,
      a.reason,
      a.calories,
      a.created_at
    FROM alternative a
    LEFT JOIN product p
      ON a.product_id = p.product_id
    LEFT JOIN health_category hc
      ON a.health_category_id = hc.health_category_id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
}

//getById
function getAlternativeById(req, res) {
  const { id } = req.params;

  const query = `
    SELECT 
      a.alternative_id,
      a.product_id,
      p.product_name,
      a.health_category_id,
      hc.category_name,
      a.recipe_name,
      a.instruction,
      a.ingredients,
      a.reason,
      a.calories,
      a.created_at
    FROM alternative as a
    LEFT JOIN product as p
      ON a.product_id = p.product_id
    LEFT JOIN health_category hc
      ON a.health_category_id = hc.health_category_id
    WHERE a.alternative_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "Alternative not found" });
    }

    return res.json(result[0]);
  });
}

//insert query 
function insertAlternative(req, res) {
  const {
    product_id,
    health_category_id,
    recipe_name,
    instruction,
    ingredients,
    reason,
    calories,
    created_at
  } = req.body;

  const query = `
    INSERT INTO alternative
    (product_id, health_category_id, recipe_name, instruction, ingredients, reason, calories, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      product_id,
      health_category_id,
      recipe_name,
      instruction,
      ingredients,
      reason,
      calories,
      created_at
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);

      return res.json({
        message: "Alternative inserted successfully",
        insertId: result.insertId
      });
    }
  );
}

//update query 
function updateAlternative(req, res) {
  const { id } = req.params;

  const {
    product_id,
    health_category_id,
    recipe_name,
    instruction,
    ingredients,
    reason,
    calories
  } = req.body;

  const query = `
    UPDATE alternative SET
      product_id = ?,
      health_category_id = ?,
      recipe_name = ?,
      instruction = ?,
      ingredients = ?,
      reason = ?,
      calories = ?
    WHERE alternative_id = ?
  `;

  db.query(
    query,
    [
      product_id,
      health_category_id,
      recipe_name,
      instruction,
      ingredients,
      reason,
      calories,
      id
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Alternative not found" });
      }

      return res.json({ message: "Alternative updated successfully" });
    }
  );
}

//delete query 
function deleteAlternative(req, res) {
  const { id } = req.params;

  const query = `
    DELETE FROM alternative
    WHERE alternative_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Alternative not found" });
    }

    return res.json({ message: "Alternative deleted successfully" });
  });
}


module.exports=
{
    getAllAlternatives,
    getAlternativeById,
    insertAlternative,
    updateAlternative,
    deleteAlternative
}