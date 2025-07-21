const mongoose = require("mongoose");
var mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI);

var connection = mongoose.connection;
connection.on("error", () => {
  console.log("connection failed");
});
connection.on("connected", () => {
  console.log("mongodb connected successfully");
});

module.exports = mongoose