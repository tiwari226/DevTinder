const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName age skills about photoUrl gender"

// all users that are interseted in my profile---------------
userRouter.get("/user/requests/recieved", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", "firstName lastName age skills about photoUrl gender");

        res.json({
            message: "Data fetched Successfully...", 
            Data: connectionRequests,
        })
    } catch (error) {
        res.status(404).send("ERROR: " + error.message);
    }
})

// all users that are accepetd state with my profile 
userRouter.get("/user/connections", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId : loggedInUser._id, status: "accepted"},
            ]
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);
    const data = connectionRequests.map((row) => {
        if(row.fromUserId._id === loggedInUser._id){
            return row.toUserId;
        }
            return row.fromUserId;
    })
        res.json({data});
        
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

// all users feed that are not connected with me or not ignored profile
userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [{fromUserId: loggedInUser._id}, 
                  {toUserId: loggedInUser._id}]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();

        connectionRequests.forEach((req) => {
             hideUserFromFeed.add(req.fromUserId.toString());
             hideUserFromFeed.add(req.toUserId.toString());
        });

         console.log(hideUserFromFeed);
       const users = await User.find({
        $and:[
          {_id: {$nin: Array.from(hideUserFromFeed)}},  // not in hideFromUserfeed
          {_id: {$ne: loggedInUser._id} },              // not equal to loggedInUser id
        ],
       }).select(USER_SAFE_DATA);
         res.send(users);
    } catch (error) {
        res.status(400).json({"ERROR: ": error.message});
    }
})

module.exports = userRouter;

