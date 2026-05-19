const db = require("../config/db");

// Get All
function getMealNutritionAll(req, res) {
  const query = `
    SELECT 
      nutrition_id,
      meal_id,
      calories,
      protein,
      carbs,
      fats,
      sodium
    FROM meals_nutrition
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
}

// Get By ID
function getMealNutritionById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID is missing" });
  }

  db.query(
    "SELECT * FROM meals_nutrition WHERE nutrition_id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.length === 0) {
        return res.status(404).json({ message: "Record not found" });
      }

      res.json(result[0]);
    }
  );
}

// Insert
function insertMealNutrition(req, res) {
  const { meal_id, calories, protein, carbs, fats, sodium } = req.body;

  const query = `
    INSERT INTO meals_nutrition
    (meal_id, calories, protein, carbs, fats, sodium)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [meal_id, calories, protein, carbs, fats, sodium],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        message: "Meal nutrition inserted successfully",
        insertedId: result.insertId
      });
    }
  );
}

// Update
function updateMealNutrition(req, res) {
  const { id } = req.params;
  const { meal_id, calories, protein, carbs, fats, sodium } = req.body;

  db.query(
    `UPDATE meals_nutrition SET
      meal_id = ?,
      calories = ?,
      protein = ?,
      carbs = ?,
      fats = ?,
      sodium = ?
     WHERE nutrition_id = ?`,
    [meal_id, calories, protein, carbs, fats, sodium, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Record not found" });
      }

      res.json({ message: "Record updated successfully" });
    }
  );
}

// Delete
function deleteMealNutrition(req, res) {
  const { id } = req.params;

  db.query(
    `DELETE FROM meals_nutrition WHERE nutrition_id = ?`,
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Record not found" });
      }

      res.json({ message: "Record deleted successfully" });
    }
  );
}

module.exports = {
  getMealNutritionAll,
  getMealNutritionById,
  insertMealNutrition,
  updateMealNutrition,
  deleteMealNutrition
};