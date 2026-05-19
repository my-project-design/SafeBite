const db = require("../config/db");

//getAll
function getAllRatings(req, res) {
  const query = `
    SELECT 
      r.rating_id,
      r.rating,
      r.review,
      r.created_at,

      p.product_id,
      p.product_name,
      p.image_url,

      u.user_id,
      u.first_name,
      u.last_name,
      u.email

    FROM product_rating r
    LEFT JOIN product p
      ON r.product_id = p.product_id
    LEFT JOIN mstuser u
      ON r.user_id = u.user_id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
}

//getById
function getRatingById(req, res) {
  const { id } = req.params;

  const query = `
    SELECT 
      r.rating_id,
      r.rating,
      r.review,
      r.created_at,

      p.product_id,
      p.product_name,
      p.image_url,

      u.user_id,
      u.first_name,
      u.last_name,
      u.email

    FROM product_rating r
    LEFT JOIN product p
      ON r.product_id = p.product_id
    LEFT JOIN mstuser u
      ON r.user_id = u.user_id
    WHERE r.rating_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "Rating not found" });
    }

    return res.json(result[0]);
  });
}

//insert query 
function insertRating(req, res) {
  const {
    rating_id,
    user_id,
    product_id,
    rating,
    review
  } = req.body;

  const query = `
    INSERT INTO product_rating
    (user_id, product_id, rating, review, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(
    query,
    [user_id, product_id, rating, review],
    (err, result) => {
      if (err) return res.status(500).json(err);

      return res.json({
        message: "Rating inserted successfully",
        insertId: result.insertId
      });
    }
  );
}

//update query 
function updateRating(req, res) {
  const { id } = req.params;

  const {
    rating,
    review
  } = req.body;

  const query = `
    UPDATE product_rating SET
      rating = ?,
      review = ?
    WHERE rating_id = ?
  `;

  db.query(query, [rating, review, id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Rating not found" });
    }

    return res.json({ message: "Rating updated successfully" });
  });
}

//delete query 
function deleteRating(req, res) {
  const { id } = req.params;

  const query = `
    DELETE FROM product_rating
    WHERE rating_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Rating not found" });
    }

    return res.json({ message: "Rating deleted successfully" });
  });
}

module.exports=
{
    getAllRatings,
    getRatingById,
    insertRating,
    updateRating,
    deleteRating
}