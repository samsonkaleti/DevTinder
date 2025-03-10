const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/AuthMiddleware");
const ConnectionRequest = require("../models/connection");
const User = require("../models/user");

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status Type" + status });
    }
    // if (toUserId === fromUserId) {
    //   return res.status(400).json({ message: "You cannot send connection request to yourself" });
    // }

    const validToUserId = await User.findById(toUserId);
    if (!validToUserId) {
      return res.status(400).json({ message: "Invalid toUserId " + toUserId });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already exists" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const data = await connectionRequest.save();
    res.status(201).json({
      message: req.user.firstName + " sent connection request to " + validToUserId.firstName,
      data: data,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}); 

router.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
  try{
    const loggedInUser = req.user;
    const {status,requestId} = req.params;
    const allowedStatus = ['accepted', 'rejected'];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message: 'Invalid status Type' + status});
    }
    const connectionRequest = await ConnectionRequest.findOne({
      _id : requestId,
      toUserId : loggedInUser._id,
      status : 'interested'
    }); 
    if(!connectionRequest){
      return res.status(400).json({message: 'Invalid requestId ' + requestId});
    }
    connectionRequest.status = status;
    await connectionRequest.save();
    res.status(200).json({message: 'Connection request ' + status});
    
  } catch (err){
    res.status(500).json({message: err.message});
  }

});
module.exports = router;
