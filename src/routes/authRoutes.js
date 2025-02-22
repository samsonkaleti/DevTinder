const express = require('express'); 
const router = express.Router();  
const User = require("../models/user");
const bcrypt = require('bcrypt');


router.post("/signup", async (req, res) => {
    const {
      firstName,
      lastName,
      emailID,
      password,
      age,
      bio,
      location,
      skills,
      photoUrl,
      gender,
    } = req.body;
    try {
      if (emailID) {
        const user = await User.findOne({ emailID: emailID });
        if (user)
          return res
            .status(400)
            .json({ message: "User already exists with this email" });
      } else if (firstName || lastName || password || emailID) {
        return res
          .status(400)
          .json({ message: "Please provide all the required fields" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        firstName,
        lastName,
        emailID,
        password: hashedPassword,
        age,
        bio,
        location,
        skills,
        photoUrl,
        gender,
      });
      await newUser.save();
      res.status(201).json({ message: "User created successfully" });
    } catch (err) {
      res.json({ message: err.message });
    }
  }); 

  router.post("/login", async (req, res) => {
    const { emailID, password } = req.body;
    try {
      const user = await User.findOne({ emailID: emailID });
      if (!user) return res.status(400).json({ message: "User not found" });
      const validPassword = await user.validatePassword(password);
  
      if (!validPassword)
        return res.status(400).json({ message: "Invalid password" });
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 3600000), // 1 hour
      });
      res.json({ message: "Logged in successfully" });
    } catch {
      res.json({ message: err.message });
    }
  });

  router.post("/logout", (req,res) =>{
    res.cookie("token",null,{
      expires:new Date(Date.now())
    }).send({ message: "Logged out successfully" });
  })


module.exports = router 
