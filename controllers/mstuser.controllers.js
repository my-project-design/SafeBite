const db = require("../config/db");

// GET ALL
function getAll(req, res) {
  db.query("SELECT * FROM `mstuser`", (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });
    return res.status(200).json({ success: true, data: result });
  });
}

// GET BY ID
function getmstuserById(req, res) {
  const { id } = req.params;
  db.query("SELECT * FROM mstuser WHERE User_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.json({ Message: "No Record Found" });
    return res.json(result[0]);
  });
}

// REGISTER
function registerUser(req, res) {
  const { first_name, last_name, email, password, contact } = req.body;

  db.query("SELECT * FROM mstuser WHERE email = ?", [email], (err, existing) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (existing.length > 0) return res.status(400).json({ success: false, message: "Email already registered." });

    db.query(
      `INSERT INTO mstuser (first_name, last_name, email, password, contact, is_active) VALUES (?, ?, ?, ?, ?, 1)`,
      [first_name, last_name, email, password, contact || null],
      (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        return res.json({ success: true, message: "Registered successfully", userId: result.insertId });
      }
    );
  });
}

// LOGIN
function loginUser(req, res) {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM mstuser WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (result.length > 0) return res.json({ success: true, user: result[0] });
      return res.json({ success: false, message: "Invalid credentials" });
    }
  );
}

// LOGIN
function loginUser(req, res) {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM mstuser WHERE Email = ? AND Password = ?",
    [email, password],
    (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (result.length > 0) return res.json({ success: true, user: result[0] });
      return res.json({ success: false, message: "Invalid credentials" });
    }
  );
}

module.exports = {
  getAll,
  getmstuserById,
  registerUser,
  loginUser,
};