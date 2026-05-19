const db = require("../config/db");

function getAllUserMealLogs(req, res) {
  const query = `
    SELECT 
      uml.meal_log_id,
      uml.user_id,
      u.first_name,
      u.last_name,
      uml.meal_id,
      m.meal_name,
      m.meal_type AS meal_category,
      uml.log_date,
      uml.meal_type,
      uml.quantity,
      uml.created_at
    FROM user_meal_log uml
    LEFT JOIN mstuser u
      ON uml.user_id = u.user_id
    LEFT JOIN meals m
      ON uml.meal_id = m.meal_id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
}

//getById
function getUserMealLogById(req, res) {
  const { id } = req.params;

  const query = `
    SELECT 
      uml.meal_log_id,
      uml.user_id,
      u.first_name,
      u.last_name,
      uml.meal_id,
      m.Meal_name,
      m.Meal_type AS meal_category,
      uml.log_date,
      uml.meal_type,
      uml.quantity,
      uml.created_at
    FROM user_meal_log uml
    LEFT JOIN mstuser u
      ON uml.user_id = u.user_id
    LEFT JOIN Meals m
      ON uml.meal_id = m.Meal_id
    WHERE uml.meal_log_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.log(err); // IMPORTANT: See real error
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Meal log not found" });
    }

    return res.json(result[0]);
  });
}

//Insert Query 
function insertUserMealLog(req, res) {
  const {
    user_id,
    meal_id,
    log_date,
    meal_type,
    quantity,
    created_at
  } = req.body;

  const query = `
    INSERT INTO user_meal_log
    (user_id, meal_id, log_date, meal_type, quantity, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [user_id, meal_id, log_date, meal_type, quantity, created_at],
    (err, result) => {
      if (err) return res.status(500).json(err);

      return res.json({
        message: "Meal log inserted successfully",
        insertId: result.insertId
      });
    }
  );
}

//update query 
function updateUserMealLog(req, res) {
  const { id } = req.params;

  const {
    user_id,
    meal_id,
    log_date,
    meal_type,
    quantity
  } = req.body;

  const query = `
    UPDATE user_meal_log SET
      user_id = ?,
      meal_id = ?,
      log_date = ?,
      meal_type = ?,
      quantity = ?
    WHERE meal_log_id = ?
  `;

  db.query(
    query,
    [user_id, meal_id, log_date, meal_type, quantity, id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Meal log not found" });
      }

      return res.json({ message: "Meal log updated successfully" });
    }
  );
}

//delete query 
function deleteUserMealLog(req, res) {
  const { id } = req.params;

  const query = `
    DELETE FROM user_meal_log
    WHERE meal_log_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Meal log not found" });
    }

    return res.json({ message: "Meal log deleted successfully" });
  });
}



module.exports=
{
    getAllUserMealLogs,
    getUserMealLogById,
    insertUserMealLog,
    updateUserMealLog,
    deleteUserMealLog
}