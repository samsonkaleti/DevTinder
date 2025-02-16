const mongoose = require("mongoose");
const Dotenv = require("dotenv");
Dotenv.config();

const MONGO_URL = "mongodb+srv://kaletishyam:Shyam1234@cluster0.rm785.mongodb.net/DevTinder"
const connect_DB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}; 


module.exports = connect_DB; 


