const db = require("../config/db");

// ================= GET ALL =================
function getAllUserHealthProfiles(req, res) {
  const query = `
    SELECT 
      uhp.profile_id,
      uhp.user_id,
      u.first_name,
      u.last_name,
      u.email,
      uhp.age,
      uhp.date_of_birth,
      uhp.gender,
      uhp.height_cm,
      uhp.weight_kg,
      uhp.bmi,
      uhp.bmi_category_id,
      uhp.food_allergies,
      uhp.dietary_restrictions,
      bc.Category_name,
      bc.Min_bmi,
      bc.Max_bmi,
      bc.Description AS bmi_description,
      uhp.created_at
    FROM user_health_profile uhp
    LEFT JOIN mstuser u
      ON uhp.user_id = u.user_id
    LEFT JOIN bmicategory bc
      ON uhp.bmi_category_id = bc.Bmi_category_id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
}

// ================= GET BY ID =================
function getUserHealthProfileById(req, res) {
  const { id } = req.params;

  const query = `
    SELECT 
      uhp.profile_id,
      uhp.user_id,
      u.first_name,
      u.last_name,
      u.email,
      uhp.age,
      uhp.date_of_birth,
      uhp.gender,
      uhp.height_cm,
      uhp.weight_kg,
      uhp.bmi,
      uhp.bmi_category_id,
      uhp.food_allergies,
      uhp.dietary_restrictions,
      bc.Category_name,
      bc.Min_bmi,
      bc.Max_bmi,
      bc.Description AS bmi_description,
      uhp.created_at
    FROM user_health_profile uhp
    LEFT JOIN mstuser u
      ON uhp.user_id = u.user_id
    LEFT JOIN bmicategory bc
      ON uhp.bmi_category_id = bc.Bmi_category_id
    WHERE uhp.profile_id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "Health profile not found" });
    }

    return res.json(result[0]);
  });
}

// ================= INSERT =================
function insertUserHealthProfile(req, res) {
  const {
    user_id,
    age,
    date_of_birth,
    gender,
    height_cm,
    weight_kg,
    bmi,
    bmi_category_id,
    food_allergies,
    dietary_restrictions
  } = req.body;

  const query = `
    INSERT INTO user_health_profile
    (user_id, age, date_of_birth, gender, height_cm, weight_kg, bmi, bmi_category_id, food_allergies, dietary_restrictions, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    query,
    [
      user_id,
      age,
      date_of_birth,
      gender,
      height_cm,
      weight_kg,
      bmi,
      bmi_category_id,
      food_allergies       || null,
      dietary_restrictions || null
    ],
    (err, result) => {
      if (err) {
        console.log("INSERT ERROR:", err);
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(400).json({ message: "Insert failed" });
      }

      return res.json({
        message: "Health profile inserted successfully",
        insertId: result.insertId,
        affectedRows: result.affectedRows
      });
    }
  );
}

// ================= UPDATE =================
function updateUserHealthProfile(req, res) {
  const { id } = req.params;

  const {
    user_id,
    age,
    date_of_birth,
    gender,
    height_cm,
    weight_kg,
    bmi,
    bmi_category_id,
    food_allergies,
    dietary_restrictions
  } = req.body;

  const query = `
    UPDATE user_health_profile SET
      user_id              = ?,
      age                  = ?,
      date_of_birth        = ?,
      gender               = ?,
      height_cm            = ?,
      weight_kg            = ?,
      bmi                  = ?,
      bmi_category_id      = ?,
      food_allergies       = ?,
      dietary_restrictions = ?
    WHERE profile_id = ?
  `;

  db.query(
    query,
    [
      user_id,
      age,
      date_of_birth,
      gender,
      height_cm,
      weight_kg,
      bmi,
      bmi_category_id,
      food_allergies       || null,
      dietary_restrictions || null,
      id
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Health profile not found" });
      }

      return res.json({ message: "Health profile updated successfully" });
    }
  );
}

// ================= DELETE =================
function deleteUserHealthProfile(req, res) {
  const { id } = req.params;

  db.query(
    "DELETE FROM user_health_profile WHERE profile_id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Health profile not found" });
      }

      return res.json({ message: "Health profile deleted successfully" });
    }
  );
}

module.exports = {
  getAllUserHealthProfiles,
  getUserHealthProfileById,
  insertUserHealthProfile,
  updateUserHealthProfile,
  deleteUserHealthProfile
};