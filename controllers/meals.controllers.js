const db=require("../config/db");

//GET all
function getAll(req,res)
{
    db.query("select * from Meals", (err,result) => 
    {
        if(err)
        {
            return res.status(500).json(err);
        }
        return res.json(result);
    });
}

//GET By Id
function getMealsById(req,res)
{
    const {id} = req.params;

    db.query("select * from Meals where Meal_id = ? ", [id], (err,result) =>
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
function insertMeals(req,res)
{
    const {Meal_name} = req.body;
    const {Meal_type} = req.body;
    const {Description} = req.body;
    const {Is_active} = req.body;
    const {Created_at} = req.body;

    db.query(`insert into Meals (Meal_name, Meal_type, Description,Is_active, Created_at) values (?, ?, ?, ?, ?)`, [Meal_name, Meal_type, Description, Is_active,Created_at],
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
function updateMeals(req,res)
{
    const {id} = req.params;
    const {Meal_name} = req.body;
    const {Meal_type} = req.body;
    const {Description} = req.body;
    const {Is_active} = req.body;
    const {Created_at} = req.body;

    db.query(`update Meals  set 
              Meal_name = ?, 
              Meal_type = ?,
              Description = ?,
              Is_active = ?,
              Created_at = ?
              where Meal_id = ?`, 
            [Meal_name, Meal_type, Description, Is_active, Created_at, id],
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
function removeMeals(req,res)
{
    const {id} = req.params;
    db.query(`delete from Meals where Meal_id = ?`,
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
    getMealsById,
    insertMeals,
    updateMeals,
    removeMeals
}