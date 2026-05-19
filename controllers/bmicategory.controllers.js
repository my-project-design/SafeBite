const db=require("../config/db");

//GET all
function getAll(req,res)
{
    db.query("select * from bmicategory", (err,result) => 
    {
        if(err)
        {
            return res.status(500).json(err);
        }
        return res.json(result);
    });
}

//GET By Id
function getBmiCategoryById(req,res)
{
    const {id} = req.params;

    db.query("select * from bmicategory where Bmi_category_id = ? ", [id], (err,result) =>
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
function insertBmiCategory(req,res)
{
    const {Category_name} = req.body;
    const {Min_bmi} = req.body;
    const {Max_bmi} = req.body;
    const {Description} = req.body;
    const {Created_at} = req.body;

    db.query(`insert into bmicategory (Category_name, Min_bmi, Max_bmi, Description, Created_at) values (?, ?, ?, ?, ?)`, [Category_name, Max_bmi, Min_bmi, Description, Created_at],
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
function updateBmiCategory(req,res)
{
    const {id} = req.params;
    const {Category_name} = req.body;
    const {Min_bmi} = req.body;
    const {Max_bmi} = req.body;
    const {Description} = req.body;
    const {Created_at} = req.body;

    db.query(`update bmicategory  set Category_name = ?, 
              Min_bmi = ?,
              Max_bmi = ?,
              Description = ?,
              Created_at = ?
              where Bmi_category_id = ?`, 
            [Category_name, Min_bmi, Max_bmi, Description, Created_at, id],
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
function removeBmiCategory(req,res)
{
    const {id} = req.params;
    db.query(`delete from bmicategory where Bmi_category_id = ?`,
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
    getBmiCategoryById,
    insertBmiCategory,
    updateBmiCategory,
    removeBmiCategory
}