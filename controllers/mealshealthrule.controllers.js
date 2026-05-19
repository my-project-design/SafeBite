const db = require("../config/db");


// GET ALL
function getMealsHealthRuleAll(req, res) {
  const query = `
    SELECT 
      mhr.meal_rule_id,
      mhr.rule_type,
      mhr.created_at,

      m.meal_id,
      m.meal_name,

      hi.health_item_id,
      hi.health_item_name,
      hi.description

    FROM meal_health_rule AS mhr

    LEFT JOIN meals AS m
      ON mhr.meal_id = m.meal_id

    LEFT JOIN health_item AS hi
      ON mhr.health_item_id = hi.health_item_id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
}


// GET BY ID
function getMealsHealthRuleById(req, res) {
  const { id } = req.params;

  const query = `
    SELECT 
      mhr.meal_rule_id,
      mhr.rule_type,
      mhr.created_at,

      m.meal_id,
      m.meal_name,

      hi.health_item_id,
      hi.health_item_name,
      hi.description

    FROM meal_health_rule AS mhr

    LEFT JOIN meals AS m
      ON mhr.meal_id = m.meal_id

    LEFT JOIN health_item AS hi
      ON mhr.health_item_id = hi.health_item_id

    WHERE mhr.meal_rule_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(result[0]);
  });
}
// INSERT
function insertMealsHealthRule(req, res) {
  const { meal_id, health_item_id, rule_type } = req.body;

  const query = `
    INSERT INTO meal_health_rule
    (meal_id, health_item_id, rule_type, created_at)
    VALUES (?, ?, ?, NOW())
  `;

  db.query(query, [meal_id, health_item_id, rule_type], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({
      message: "Inserted successfully",
      insertedId: result.insertId
    });
  });
}
// UPDATE
function updateMealsHealthRule(req, res) {
  const { id } = req.params;
  const { meal_id, health_item_id, rule_type } = req.body;

  const query = `
    UPDATE meal_health_rule
    SET 
      meal_id = ?, 
      health_item_id = ?, 
      rule_type = ?
    WHERE meal_rule_id = ?
  `;

  db.query(query, [meal_id, health_item_id, rule_type, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Updated successfully" });
  });
}
// DELETE

function deleteMealsHealthRule(req, res) {
  const { id } = req.params;

  const query = `
    DELETE FROM meal_health_rule 
    WHERE meal_rule_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Deleted successfully" });
  });
}


module.exports = {
  getMealsHealthRuleAll,
  getMealsHealthRuleById,
  insertMealsHealthRule,
  updateMealsHealthRule,
  deleteMealsHealthRule
};