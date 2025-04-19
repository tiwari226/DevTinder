const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest")

requestRouter.post("/request/send/:status/:toUserId",
   userAuth, 
   async(req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];
      if(!allowedStatus.includes(status)){
        return res.status(400).send({message: "Invalid status type : " + status});
  
      }
      const toUser = await User.findById(toUserId);
      if(!toUser){
        throw new Error("User not Found...")
      }
      //-----------check all condition that aleardy connection exist or not------------------>
      
      // const existinConnectionRequest = await ConnectionRequest.findOne({
      //   $or:[
      //     {fromUserId: toUserId},
      //     {fromUserId: toUserId, toUserId: fromUserId},
      //   ],
      // })

      const existinConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId }
        ]
      })

      if(existinConnectionRequest){
        return res.status(400).send({message: "Connection request already Exist !!"})
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
     // Save the data to databases ------------------------------------------
     const data = await connectionRequest.save();
     res.send({
      message: req.user.firstName+ " is " + status + " to " + toUser.firstName,
      data,
     })
    } catch (error) {

      res.status(400).send("Error: " + error.message);
    }
  })

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allowedStatus = ["accepted", "rejected"];
    const {status, requestId} = req.params;
    if(!allowedStatus.includes(status)){ 
      throw new Error("Invalid Status type !!!");
    }

    // check any request present or not and touserId also be loggedIn ----------------------------->
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested", 
    })
    if(!connectionRequest){
      throw new Error("Not any request available !!!");
    }
    // updata the status in database before save the data----------------------------->
    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({message: loggedInUser.firstName + " is " + status+" your request", data});
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
})



  module.exports = requestRouter;
  