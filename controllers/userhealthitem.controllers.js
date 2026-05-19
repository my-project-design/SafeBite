const db = require("../config/db");

// GET ALL 
function getUserHealthItemAll(req, res) {
  const query = `
    SELECT 
      uhi.user_health_item_id,
      uhi.created_at,
      u.User_id,
      u.First_name,
      u.Last_Name,
      u.Email,
      hi.health_item_id,
      hi.health_item_name,
      hi.description
      FROM user_health_item AS uhi
      LEFT JOIN mstuser AS u
      ON uhi.user_id = u.User_id
      LEFT JOIN health_item AS hi
      ON uhi.health_item_id = hi.health_item_id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
}
// GET BY ID
function getUserHealthItemById(req, res) {
  const { id } = req.params;

  const query = `
    SELECT 
      uhi.user_health_item_id,
      uhi.created_at,
      u.User_id,
      u.First_name,
      u.Last_Name,
      u.Email,
      hi.health_item_id,
      hi.health_item_name,
      hi.description
      FROM user_health_item AS uhi
      LEFT JOIN mstuser AS u
      ON uhi.user_id = u.User_id
      LEFT JOIN health_item AS hi
      ON uhi.health_item_id = hi.health_item_id
      WHERE uhi.user_health_item_id = ?
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
function insertUserHealthItem(req, res) {
  const { user_id, health_item_id } = req.body;

  const query = `
    INSERT INTO user_health_item
    (user_id, health_item_id, created_at)
    VALUES (?, ?, NOW())
  `;

  db.query(query, [user_id, health_item_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({
      message: "Inserted successfully",
      insertedId: result.insertId
    });
  });
}

// UPDATE
function updateUserHealthItem(req, res) {
  const { id } = req.params;
  const { user_id, health_item_id } = req.body;

  const query = `
    UPDATE user_health_item
    SET user_id = ?, health_item_id = ?
    WHERE user_health_item_id = ?
  `;

  db.query(query, [user_id, health_item_id, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Updated successfully" });
  });
}

// DELETE
function deleteUserHealthItem(req, res) {
  const { id } = req.params;

  db.query(
    `DELETE FROM user_health_item WHERE user_health_item_id = ?`,
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Record not found" });
      }

      res.json({ message: "Deleted successfully" });
    }
  );
}
module.exports = {
  getUserHealthItemAll,
  getUserHealthItemById,
  insertUserHealthItem,
  updateUserHealthItem,
  deleteUserHealthItem
};