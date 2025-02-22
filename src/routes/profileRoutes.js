
const express = require('express'); 
const router = express.Router();
const userAuth = require("../middleware/AuthMiddleware");
const {validateEditProfileData} = require("../utils/validations");

router.get("/profile/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.status(200).json(user);
    } catch (err) {
      res.json({ message: err.message });
    }
  }); 

  router.patch('/profile/edit', userAuth, async (req, res) => {
    try{
     if(!validateEditProfileData(req)){
        return res.status(400).json({message: "Invalid field"});
     }

      const user = req.user;
       Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
        await user.save();
      
       res.status(200).json({message: `Hey! ${user.firstName},Your Profile updated successfully....!!!`, data : user});
      
      


    } catch{
      res.status(400).send("Error updating profile");
    }
  });

  module.exports = router;