const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "productlogo";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ── GET ALL PRODUCTS ──────────────────────────────────────
// FIX: Added p.category_id and p.brand_id to SELECT so the
//      frontend filters and edit-modal dropdowns work correctly.
function getAllProducts(req, res) {
  const query = `
    SELECT 
      p.product_id,
      p.product_name,
      p.description,
      p.image_url,
      p.created_at,
      p.category_id,
      p.brand_id,
      c.Category_name,
      b.brand_name,
      b.status
    FROM product p
    LEFT JOIN Category c ON p.category_id = c.Category_id
    LEFT JOIN brand    b ON p.brand_id    = b.brand_id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
}

// ── GET PRODUCT BY ID ─────────────────────────────────────
// FIX: Added p.category_id and p.brand_id here too.
function getProductById(req, res) {
  const { id } = req.params;

  const query = `
    SELECT 
      p.product_id,
      p.product_name,
      p.description,
      p.image_url,
      p.created_at,
      p.category_id,
      p.brand_id,
      c.Category_name,
      b.brand_name,
      b.status
    FROM product p
    LEFT JOIN Category c ON p.category_id = c.Category_id
    LEFT JOIN brand    b ON p.brand_id    = b.brand_id
    WHERE p.product_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: "Product not found" });
    return res.json(result[0]);
  });
}

// ── INSERT PRODUCT ────────────────────────────────────────
function insertProduct(req, res) {
  const { category_id, brand_id, product_name, description, created_at } = req.body;
  const image_url = req.file ? req.file.filename : null;

  const query = `
    INSERT INTO product (category_id, brand_id, product_name, description, image_url, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [category_id, brand_id, product_name, description, image_url, created_at], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Product inserted successfully", insertId: result.insertId });
  });
}

// ── UPDATE PRODUCT ────────────────────────────────────────
// FIX: Now also updates created_at when provided.
function updateProduct(req, res) {
  const { id } = req.params;
  const { category_id, brand_id, product_name, description, created_at } = req.body;
  const image_url = req.file ? req.file.filename : null;

  let query, values;

  if (image_url) {
    query = `
      UPDATE product SET
        category_id  = ?,
        brand_id     = ?,
        product_name = ?,
        description  = ?,
        image_url    = ?,
        created_at   = ?
      WHERE product_id = ?
    `;
    values = [category_id, brand_id, product_name, description, image_url, created_at, id];
  } else {
    query = `
      UPDATE product SET
        category_id  = ?,
        brand_id     = ?,
        product_name = ?,
        description  = ?,
        created_at   = ?
      WHERE product_id = ?
    `;
    values = [category_id, brand_id, product_name, description, created_at, id];
  }

  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
    return res.json({ message: "Product updated successfully" });
  });
}

// ── DELETE PRODUCT ────────────────────────────────────────
function deleteProduct(req, res) {
  const { id } = req.params;

  db.query("DELETE FROM product WHERE product_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found" });
    return res.json({ message: "Product deleted successfully" });
  });
}

module.exports = { getAllProducts, upload, getProductById, insertProduct, updateProduct, deleteProduct };