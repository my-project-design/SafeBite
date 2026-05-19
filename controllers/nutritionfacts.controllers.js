const db = require("../config/db");

//GetAll
function getAllNutritionFacts(req, res) {
  const query = `
    SELECT 
      nf.nutrition_id,
      nf.calories,
      nf.protein,
      nf.carbs,
      nf.fat,
      nf.fiber,
      nf.product_id,
      p.product_name,
      p.image_url
    FROM nutrition_facts nf
    LEFT JOIN product p
      ON nf.product_id = p.product_id
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(result);
  });
}


//GetById
function getNutritionFactsById(req, res) {
  const { id } = req.params;

  const query = `
    SELECT 
      nf.nutrition_id,
      nf.product_id,
      p.product_name,
      nf.calories,
      nf.protein,
      nf.carbs,
      nf.fat,
      nf.fiber
    FROM nutrition_facts nf
    LEFT JOIN product p
      ON nf.product_id = p.product_id
    WHERE nf.nutrition_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Nutrition record not found" });
    }

    return res.json(result[0]);
  });
}

//Insert Query
function insertNutritionFacts(req, res) {
  const {
    product_id,
    calories,
    protein,
    carbs,
    fat,
    fiber
  } = req.body;

  const query = `
    INSERT INTO nutrition_facts
    (product_id, calories, protein, carbs, fat, fiber)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [product_id, calories, protein, carbs, fat, fiber],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      return res.json({
        message: "Nutrition facts inserted successfully"
      });
    }
  );
}

//update Query
function updateNutritionFacts(req, res) {
  const { id } = req.params;

  const {
    product_id,
    calories,
    protein,
    carbs,
    fat,
    fiber
  } = req.body;

  const query = `
    UPDATE nutrition_facts
    SET
      product_id = ?,
      calories = ?,
      protein = ?,
      carbs = ?,
      fat = ?,
      fiber = ?
    WHERE nutrition_id = ?
  `;

  db.query(
    query,
    [product_id, calories, protein, carbs, fat, fiber, id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Nutrition facts not found" });
      }

      return res.json({
        message: "Nutrition facts updated successfully"
      });
    }
  );
}

//Delete Query 
function deleteNutritionFacts(req, res) {
  const { id } = req.params;

  db.query(
    "DELETE FROM nutrition_facts WHERE nutrition_id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Nutrition facts not found" });
      }

      return res.json({
        message: "Nutrition facts deleted successfully"
      });
    }
  );
}



module.exports=
{
    getAllNutritionFacts,
    getNutritionFactsById,
    insertNutritionFacts,
    updateNutritionFacts,
    deleteNutritionFacts
}