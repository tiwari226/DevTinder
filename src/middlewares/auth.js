const jwt = require("jsonwebtoken")
const User = require("../models/user");
const data = require("../conf/conf")

const userAuth = async(req, res, next) => {
          try {
            const {token} = req.cookies;
            if(!token){
               return res.status(401).send("please login..");
            }
            const decodeObj = await jwt.verify(token, data.jwt_key);
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