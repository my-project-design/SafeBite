const db = require("../config/db");

//GetAll
function getAllUserDailyLogs(req, res) {
  const query = `
    SELECT 
      udl.daily_log_id,
      udl.user_id,
      u.first_name,
      u.last_name,
      udl.log_date,
      udl.weight,
      udl.bmi,
      udl.water_glasses,
      udl.calories_consumed,
      udl.protein_consumed,
      udl.exercise_minutes,
      udl.notes,
      udl.created_at
    FROM user_daily_logs udl
    LEFT JOIN mstuser u
      ON udl.user_id = u.user_id
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.json(result);
  });
}



//GetById
function getUserDailyLogById(req, res) {
  const { id } = req.params;

  const query = `
    SELECT 
      udl.daily_log_id,
      udl.user_id,
      u.first_name,
      u.last_name,
      udl.log_date,
      udl.weight,
      udl.bmi,
      udl.water_glasses,
      udl.calories_consumed,
      udl.protein_consumed,
      udl.exercise_minutes,
      udl.notes,
      udl.created_at
    FROM user_daily_logs udl
    LEFT JOIN mstuser u
      ON udl.user_id = u.user_id
    WHERE udl.daily_log_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Daily log not found" });
    }

    return res.json(result[0]);
  });
}


//Insert Query 
function insertUserDailyLog(req, res) {
  const {
    user_id,
    log_date,
    weight,
    bmi,
    water_glasses,
    calories_consumed,
    protein_consumed,
    exercise_minutes,
    notes
  } = req.body;

  const query = `
    INSERT INTO user_daily_logs
    (user_id, log_date, weight, bmi, water_glasses, calories_consumed, protein_consumed, exercise_minutes, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    query,
    [
      user_id,
      log_date,
      weight,
      bmi,
      water_glasses,
      calories_consumed,
      protein_consumed,
      exercise_minutes,
      notes
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.json({
        message: "Daily log inserted successfully",
        insertId: result.insertId
      });
    }
  );
}

//update query 
function updateUserDailyLog(req, res) {
  const { id } = req.params;

  const {
    user_id,
    log_date,
    weight,
    bmi,
    water_glasses,
    calories_consumed,
    protein_consumed,
    exercise_minutes,
    notes
  } = req.body;

  const query = `
    UPDATE User_daily_logs SET
      user_id = ?,
      log_date = ?,
      weight = ?,
      bmi = ?,
      water_glasses = ?,
      calories_consumed = ?,
      protein_consumed = ?,
      exercise_minutes = ?,
      notes = ?
    WHERE daily_log_id = ?
  `;

  db.query(
    query,
    [
      user_id,
      log_date,
      weight,
      bmi,
      water_glasses,
      calories_consumed,
      protein_consumed,
      exercise_minutes,
      notes,
      id
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Daily log not found" });
      }

      return res.json({ message: "Daily log updated successfully" });
    }
  );
}

//delete
function deleteUserDailyLog(req, res) {
  const { id } = req.params;

  db.query(
    "DELETE FROM user_daily_logs WHERE daily_log_id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Daily log not found" });
      }

      return res.json({ message: "Daily log deleted successfully" });
    }
  );
}

module.exports=
{
    getAllUserDailyLogs,
    getUserDailyLogById,
    insertUserDailyLog,
    updateUserDailyLog,
    deleteUserDailyLog
}