const mysql=require("mysql2")

const db=mysql.createPool({
    host:process.env.DB_HOST || 'localhost',
    user:process.env.DB_USER || 'root',
    password:process.env.DB_PASSWORD || '',
    database:process.env.DB_NAME || 'safebite',
    port:process.env.DB_PORT || 3306,
});

db.getConnection((err)=>{
    if(err)
    {
        console.error("DB not Connected");
    }
    else
    {
        console.log("DB connected");
    }
});

module.exports=db;