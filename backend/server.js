const app = require("./app");
const connectDatabase = require("./db/Database");

//Hanndeling uncaught Exceptions
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(err.stack);
    console.log(`Shutting down the server for uncaught exception`);
    process.exit(1);
});

//config
if(process.env.NODE_ENV != "PRODUCTION"){
    require("dotenv").config({
        path:"config/.env"
    })
};

//connect db
connectDatabase();

//create server
const server= app.listen(8000, ()=>{
   console.log(
    `Server is running on http://localhost:${process.env.PORT}`
   );    
});


//unhandeled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the server for: ${err?.message}`);
    console.log(err?.stack || err); // handles case where err isn't a real Error
    server.close(() => {
        process.exit(1);
    });
});