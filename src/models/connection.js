const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required : true,
      enum: {
        values: ["interested", "accepted", "rejected", "ignored"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

connectionRequest.pre("save", function(next){
  if(this.fromUserId.equals(this.toUserId)){
    throw new Error("HaHaH....! You cannot send connection request to yourself");
  }
 
  next();
});
module.exports = mongoose.model("ConnectionRequest", connectionRequest);
