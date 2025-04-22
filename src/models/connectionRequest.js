const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId:{
            type:mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",           // storing ref for fromUserId from User schema to find name for each sender 
        },
        toUserId: {
            type:mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type`
            },
        },
    },
    {timestamps : true}
);

// indexing for multiplerequest------------------>
connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

// check user can't send request himself
connectionRequestSchema.pre("save", function(next) {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You can not send request himself..")
    }
    next();
})
 
const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
)
module.exports = ConnectionRequestModel;