const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const mongoose = require('mongoose');
const dotenv = require("dotenv");

require('./service/config-passport')

dotenv.config();

const urlDb = process.env.DB_HOST;
 
const connectDatabase = async () => {
  await mongoose
    .connect(urlDb, {
      dbName: 'db-contacts'
    })
    .then(() => console.log("Database connection successful"))
    .catch((err) => {
      console.log("Error in connecting to db" + err);
      process.exit(1);
    });
};

connectDatabase();
const app = express(); 
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
const router = require("./routes/routes");

app.use(morgan(formatsLogger))

app.use(cors())

app.use(express.json())
 
app.use(router); 

app.use((req, res) => {
  res.status(404).json({ message: "Not found" })
});
  
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
});

module.exports = app;