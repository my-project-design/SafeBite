const db = require("../config/db");

// GET ALL
function getcatAll(req, res) {
    db.query("SELECT * FROM category", (err, result) => {
        if (err) return res.status(500).json(err);
        return res.json(result);
    });
}

// GET BY ID
function getcatById(req, res) {
    const { id } = req.params;
    db.query("SELECT * FROM category WHERE Category_id = ?", [id], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.json({ Message: "No Record Found" });
        return res.json(result[0]);
    });
}

// INSERT
function insertCategory(req, res) {
    const { Category_name, Created_On, Updated_on, Updated_by, Created_by, Is_active } = req.body;
    db.query(
        `INSERT INTO category (Category_name, Created_On, Updated_on, Updated_by, Created_by, Is_active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [Category_name, Created_On, Updated_on, Updated_by, Created_by, Is_active],
        (err) => {
            if (err) return res.status(500).json(err);
            return res.json({ Message: "Record inserted successfully" });
        }
    );
}

// UPDATE
function updateCategory(req, res) {
    const { id } = req.params;
    const { Category_name, Updated_on, Updated_by, Is_active } = req.body;
    db.query(
        `UPDATE category SET
            Category_name = ?,
            Updated_on    = ?,
            Updated_by    = ?,
            Is_active     = ?
         WHERE Category_id = ?`,
        [Category_name, Updated_on, Updated_by, Is_active, id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.affectedRows === 0) return res.json({ Message: "No Record Found" });
            return res.json({ Message: "Record updated successfully" });
        }
    );
}

// DELETE
function removeCategory(req, res) {
    const { id } = req.params;
    db.query(
        "DELETE FROM category WHERE Category_id = ?",
        [id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.affectedRows === 0) return res.json({ Message: "No Record Found" });
            return res.json({ Message: "Record deleted successfully" });
        }
    );
}

module.exports = {
    getcatAll,
    getcatById,
    insertCategory,
    updateCategory,
    removeCategory,
};