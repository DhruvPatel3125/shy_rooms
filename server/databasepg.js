const {Client} = require('pg')

const client = new Client({
    host:"localhost",
    user:"postgres",
    port:54321,
    password:"rootUser",
    database:"postgres"
})

Client.connect();
client.query(`select * from users`,(err,res)=>{
    if(!err){
        console.log(res.rows)
    }
    else{
        console.log(err.message)
    }
    client.end;
})