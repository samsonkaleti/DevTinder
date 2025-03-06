const express = require("express");
const connect_DB = require("./config/db");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const request = require("./routes/request");



app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/', request);




connect_DB()
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })

  .catch((err) => console.error(err));
