const jwt = require("jsonwebtoken")
const User = require("../models/user");

const userAuth = async(req, res, next) => {
          try {
            const {token} = req.cookies;
            if(!token){
                throw new Error("Token is not found...")
            }
            const decodeObj = await jwt.verify(token, "DEVTinder@790");
            const {_id} = decodeObj;

            const user = await User.findById(_id);
            if(!user){
                throw new Error("User Not Found...");
            }

            req.user = user;
            next();
          } catch (error) {
           res.status(400).send("Eroor: " + error.message);
          }
};
module.exports = {userAuth};