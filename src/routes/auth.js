const express= require("express")
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation")
const bcrypt = require('bcrypt');
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);
    const {firstName, lastName, emailId, password} = req.body;

    // enctyption of password
   const passwordHash = await bcrypt.hash(password, 10);

   // creating a new instance of User;
    const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    })
    res.json({message: "Account Created Succesfully....",
      data: savedUser
    })
  } catch (error) {
     res.status(404).send("Data not saved: " + error.message)
  }
})

authRouter.post("/login", async(req, res) => {
  try {
    const {emailId, password} = req.body;
    const user = await User.findOne({emailId: emailId});
    if(!user){
      throw new Error("Email is not Vaild..")
    }
    const isPasswordValid = await user.validatePassword(password);
    if(isPasswordValid){
      // create token 
      const token = await user.getJWT()
      res.cookie("token", token);
      res.json(user);
    }
    else {
      throw new Error("Incorrect Password...")
    }
  } catch (error) {
    res.status(404).send("something went worng: " + error.message)
  }
})

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  })
  res.send("Logout successfully..")
})
module.exports = authRouter;