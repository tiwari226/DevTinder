const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth")
const {validateEditProfileData} = require("../utils/validation")

profileRouter.get("/profile/view", userAuth, async(req, res) => {
    try {
      const user = req.user;
      res.send(user);
    } catch (error) {
       res.status(404).send("error: " + error.message)
    }
  })

  profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try {
      if(!validateEditProfileData(req)){
        throw new Error("Invalid Edit field..")
      }
      const loggedInUser = req.user;
      // edit all fields 
      Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
      await loggedInUser.save();
      res.send(`${loggedInUser.firstName} your profile updated successfully`);
      
    } catch (error) {
      res.status(404).send("error: " + error.message);
    }
  })

 
  module.exports = profileRouter;