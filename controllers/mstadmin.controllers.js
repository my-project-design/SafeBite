const db=require("../config/db");

//GetAll
function getAll(req,res)
{
    db.query("select * from mstadmin", (err, result)=>
    {
        if(err)
        {
            return res.status(500).json(err);
        }
        return res.json(result);
    }) 
}

//GetByID
function getmstAdminById(req,res)
{
    const {id} = req.params;

    db.query("select * from mstadmin where admin_id = ? ", [id], (err,result) =>
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
 
//Check
function check(req, res)
{
    const {email,password}=req.body
    db.query(`Select * from mstadmin 
        where email=? and password=?`, [email,password], (err, result)=>
    {
        if(err)
            return res.status(500).json(err);

        if (result.length>0)
            return res.json({Message:true});
        else
            return res.json({Message:false})
    });
}





module.exports=
{
    getAll,
    getmstAdminById,
    check,
}