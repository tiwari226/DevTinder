const express= require("express")
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation")
const bcrypt = require('bcrypt');
const User = require("../models/user");
// This is new 
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");


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
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
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
  // res.cookie("token", null, {
  //   expires: new Date(Date.now()),
  // })
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.send("Logout successfully..")
})


//  Forgot Password api

authRouter.post("/forgot-password", async (req, res) => {
  try {
    const { emailId } = req.body;

    if (!emailId) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({
      emailId: emailId.toLowerCase()
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const resetUrl =
      `${process.env.FRONTURL}/reset-password/${resetToken}`;

    await sendEmail(user.emailId, resetUrl);

    res.json({ message: "Reset link sent to email" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// rest password api

authRouter.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = authRouter;