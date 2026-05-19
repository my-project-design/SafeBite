const db = require("../config/db");

/* =========================
   GET ALL (WITH JOIN)
========================= */
function getAllUserFavourites(req, res) {

  const query = `
    SELECT 
      uf.favourite_id,
      uf.created_at,
      u.User_id,
      u.First_name,
      u.Last_Name,
      u.Email,
      p.product_id,
      p.product_name,
      p.image_url
    FROM user_favourites AS uf
    LEFT JOIN mstuser AS u
      ON uf.user_id = u.User_id
    LEFT JOIN product AS p
      ON uf.product_id = p.product_id
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    return res.status(200).json(result);
  });
}

/* =========================
   GET BY ID
========================= */
function getUserFavouritesById(req, res) {

  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  const query = `
    SELECT 
      uf.favourite_id,
      uf.created_at,
      u.User_id,
      u.First_name,
      u.Last_Name,
      u.Email,
      p.product_id,
      p.product_name,
      p.image_url
    FROM user_favourites AS uf
    LEFT JOIN mstuser AS u
      ON uf.user_id = u.User_id
    LEFT JOIN product AS p
      ON uf.product_id = p.product_id
    WHERE uf.favourite_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json(result[0]);
  });
}

/* =========================
   INSERT
========================= */
function insertUserFavourites(req, res) {

  const { user_id, product_id } = req.body;

  // Validation
  if (!user_id || !product_id) {
    return res.status(400).json({
      message: "user_id and product_id are required"
    });
  }

  const query = `
    INSERT INTO user_favourites
    (user_id, product_id, created_at)
    VALUES (?, ?, NOW())
  `;

  db.query(query, [user_id, product_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    return res.status(201).json({
      message: "Inserted successfully",
      insertedId: result.insertId
    });
  });
}

/* =========================
   UPDATE
========================= */
function updateUserFavourites(req, res) {

  const id = req.params.id;
  const { user_id, product_id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  if (!user_id || !product_id) {
    return res.status(400).json({
      message: "user_id and product_id are required"
    });
  }

  const query = `
    UPDATE user_favourites
    SET user_id = ?, product_id = ?
    WHERE favourite_id = ?
  `;

  db.query(query, [user_id, product_id, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json({ message: "Updated successfully" });
  });
}

/* =========================
   DELETE
========================= */
function deleteUserFavourites(req, res) {

  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  const query = `
    DELETE FROM user_favourites
    WHERE favourite_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(200).json({ message: "Deleted successfully" });
  });
}

module.exports = {
  getAllUserFavourites,
  getUserFavouritesById,
  insertUserFavourites,
  updateUserFavourites,
  deleteUserFavourites
};