const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

//Multer config 
const storage = multer.diskStorage
({
    destination: function (req, file, cb) 
    {
        cb(null, "brandlogo");
    },
    filename: function (req, file, cb) 
    {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage }).single("logo");


//Get All Query 
function getAll(req,res)
{
    db.query("select * from brand", (err,result)=>
    {
        if(err)
        {
            return res.result(500).json(err);
        }
        return res.json(result);
    })
}

//Select Query 
function getBrandById(req,res)
{
    const {id}=req.params
    db.query("select * from brand where Brand_id=?",[id],(err,result)=>
    {
        if(err)
        {
            return res.status(500).json(err);
        }
        if(result.length==0)
        {
            return res.json({Message:"No Record Found"})
        }
        return res.json(result);
    })
} 

//Insert Query For Brand
function insertBrand(req, res) {
    upload(req, res, function (err) {
        if (err) {
            return res.status(500).json(err);
        }

        const { Brand_name, Description, Logo_url, Status , Created_at, Updated_at} = req.body;
        const logo_url = req.file ? req.file.filename : null;
        console.log(Brand_name)
        console.log(Description)
        console.log( Status) 
        console.log( Created_at) 
        console.log(Updated_at)
        db.query(
            `INSERT INTO brand (Brand_name, Description, Logo_url, Status , Created_at, Updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
            [Brand_name, Description, logo_url, Status, Created_at, Updated_at],
            (err) => {
                if (err) 
                {
                    return res.status(500).json(err);
                } 
                else 
                {
                        return res.json
                        ({
                        message: "Brand Inserted Successfully"
                    });
                }
            }
        );
    });
}

//Update Query 
function updateBrand(req, res) {
    upload(req, res, function (err) {
        if (err) {
            return res.status(500).json(err);
        } else {
            const { id } = req.params;
            const { Brand_name, Description, Status, Created_at, Updated_at } = req.body;

            let Logo_url;

            if (req.file) {
                Logo_url = req.file.filename;
            } else {
                Logo_url = null;
            }

            db.query(
                "UPDATE brand SET Brand_name = ?, Description = ?, Logo_url = ?, Status = ?, Created_at = ?, Updated_at = ? WHERE Brand_id = ?",
                [Brand_name, Description, Logo_url, Status, Created_at, Updated_at, id],
                function (err, result) {
                    if (err) {
                        return res.status(500).json(err);
                    } else {
                        if (result.affectedRows === 0) {
                            return res.json({ message: "Brand not found" });
                        } else {
                            return res.json({
                                message: "Brand updated successfully"
                            });
                        }
                    }
                }
            );
        }
    });
}

//Delete Query 
function deleteBrand(req, res) {
  const { id } = req.params;

  db.query(
    "SELECT Logo_url FROM brand WHERE brand_id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.json({ message: "Brand not found" });
      }

      const logo = result[0].logo_url;

      if (logo) {
        const filePath = path.join(uploadDir, logo);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      db.query(
        "DELETE FROM brand WHERE Brand_id = ?",
        [id],
        (err) => {
          if (err) {
            return res.status(500).json(err);
          }

          return res.json({
            message: "Brand and logo deleted successfully"
          });
        }
      );
    }
  );
}

module.exports=
{
    getAll,
    getBrandById,
    insertBrand,
    updateBrand,
    deleteBrand
}