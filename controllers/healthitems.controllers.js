const db=require("../config/db")

//GetAll
function getHealthItemAll(req, res) {
  const query = `
    SELECT 
      hi.health_item_id,
      hi.health_item_name,
      hi.description AS item_description,
      hi.is_active,
      hi.created_at,
      hc.health_category_id,
      hc.category_name,
      hc.description AS category_description
    FROM health_item hi
    LEFT JOIN health_category hc
      ON hi.health_category_id = hc.health_category_id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json(result);
  });
}

//GetByID
function getHealthItemById(req, res) {
  console.log(req.params); // DEBUG LINE

  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "ID is missing" });
  }

  db.query(
    "SELECT * FROM health_item WHERE health_item_id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({ message: "Record not found" });
      }

      res.json(result[0]);
    }
  );
}



//Insert Query 
function insertHealthItem(req, res) 
{
  const {
    health_category_id,
    health_item_name,
    description,
    is_active,
    created_at
  } = req.body;

  const query = `
    INSERT INTO health_item
    (health_category_id, health_item_name, description, is_active, created_at)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [health_category_id, health_item_name, description, is_active, created_at],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Health item inserted successfully" });
    }
  );
};

//Update Query 
function updateHealthItem(req,res)
{
  const {id}=req.params
  const {health_category_id, health_item_name, description, is_active, created_at}=req.body

  db.query(`update health_item set health_category_id =?,
     health_item_name =?, 
     description =?,
      is_active =?,
       created_at =? where health_item_id =?`, [health_category_id, health_item_name, description, is_active, created_at,id],
      (err,result) =>
      {
        if(err)
        {
          return res.status(500).json(err)
        }
        return res.json({message:"Record Successfully"})
      })
}

//Delete Query
function deleteHealthItem(req, res) 
{
  const {id} = req.params.id;
  //const {health_item_name ,description ,is_active ,created_at}=req.body;

  db.query(`DELETE FROM health_item WHERE health_item_id = ?`, [ id], (err,result)=>
  {
    if(err)
    {
      return res.status(500).json(err);
    }
    return res.json({message:"Record Deleted Successfully"});
  })

};

module.exports=
{
    getHealthItemAll,
    getHealthItemById,
    insertHealthItem,
    updateHealthItem,
    deleteHealthItem
}