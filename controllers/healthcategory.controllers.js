const db=require("../config/db");

//GET all
function getAll(req,res)
{
    db.query("select * from Health_category", (err,result) => 
    {
        if(err)
        {
            return res.status(500).json(err);
        }
        return res.json(result);
    });
}

//GetById Query 
function getHealthCategoryById(req,res)
{
    const {id} = req.params;

    db.query("select * from Health_category where Health_category_id = ? ", [id], (err,result) =>
    {
        if(err)
        {
            return res.status(500).json(err);
        }
        if(result.length==0)
        {
            return res.json({Message: "No Record Found"});
        }
        return res.json(result[0]);
    })

}

//INSERT Record
function insertHealthCategory(req,res)
{
    const {Category_name} = req.body;
    const {Description} = req.body;
    const {Is_active} = req.body;
    const {Created_at} = req.body;

    db.query(`insert into Health_category (Category_name, Description, Is_active, Created_at) values (?, ?, ?, ?)`, [Category_name, Description, Is_active, Created_at],
        (err)=>
        {
            if(err)
            {
                return res.status(500).json(err);
            }
            else
            {
                return res.json({Message: "Record inseted successfully"});
            }
        }
    );
}

//UPDATE Record
function updateHealthCategory(req,res)
{
    const {id} = req.params;
    const {Category_name} = req.body;
    const {Description} = req.body;
    const {Is_active} = req.body;
    const {Created_at} = req.body;

    db.query(`update Health_category  set Category_name = ?, 
              Description = ?,
              Is_active = ?,
              Created_at = ?
              where Health_category_id = ?`, 
            [Category_name, Description, Is_active, Created_at, id],
        (err, result)=>
        {
            if(err)
            {
                return res.status(500).json(err);
            }
            if(result.affectedRows == 0)
            {
                return res.json({Message : " No Record Found"});
            }
            return res.json({Message:"Record Updated"});
        }
    );
}

//Delete Query 
function removeHealthCategory(req,res)
{
    const {id} = req.params;
    db.query(`delete from Health_category where Health_category_id = ?`,
        [id],
        (err,result) => 
        {
            if(err)
            {
                return res.result(500).json(err);
            }
            if(result.affectedRows==0)
            {
                return res.json({Message:"No Record Found"});
            }
            return res.json({Message : "Record Deleted Successfully"});
        }
    );
}



module.exports=
{
    getAll,
    getHealthCategoryById,
    insertHealthCategory,
    updateHealthCategory,
    removeHealthCategory
}