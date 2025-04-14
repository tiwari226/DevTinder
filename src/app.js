const express = require("express")
const connectDB = require("./config/database")
const app = express()
const User = require("./models/user")
const validateSignUpData = require("./utils/validation")
app.use(express.json())
const bcrypt = require('bcrypt');


// API for sign up
app.post("/signup", async (req, res) => {
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
    await user.save();
    res.send("Account Created Succesfully....")
  } catch (error) {
     res.status(404).send("Data not saved: " + error.message)
  }
})

// API for login
app.post("/login", async(req, res) => {
  try {
    const {emailId, password} = req.body;
    const user = await User.findOne({emailId: emailId})
    if(!user){
      throw new Error("Email is not Vaild..")
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(isPasswordValid){
      res.send("Login Successfully...")
    }
    else {
      throw new Error("Incorrect Password...")
    }
  } catch (error) {
    res.status(404).send("something went worng: " + error.message)
  }
})

// get document by EmailId
app.get("/feedbyemail", async (req, res) => {
  const email = req.body.emailId;
     try { 
      const user = await User.find({emailId : email});         
      if(user.length === 0) {
        req.send("Not any user for this email")
      }  
      else{
        res.send(user);
      }               
     } catch (error) {
      res.status(404).send("User not found")
     }
})

// Get all documents
app.get("/feed", async (req, res) => {
   const email = req.body.emailId;
     try { 
      const user = await User.find({});         
      if(user.length === 0) {
        req.send("Not any user")
      }  
      else{
        res.send(user);
      }               
     } catch (error) {
      res.status(404).send("Email not found")
     }
})

// Delete the Data
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted Successfully");
  } catch (error) {
    res.status(404).send("Something went wrong");
  }
})

// Upadate the documents
app.patch("/user/:userId",  async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body
    try {
    const ALLOWED_UPDATE = ["photograph","about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) => 
      ALLOWED_UPDATE.includes(k)
    );
    if(!isUpdateAllowed){
        throw new Error("Update is Not allowed due to some restriction")
    }
    if(data?.skills.length > 10){
      throw new Error("skills can't be more than 10")
    }
    const user =  await User.findByIdAndUpdate({_id : userId}, data, {
      returnDocument : "after",
      runValidators : true,
    })
     res.send("Updated Successfully.....");
    } catch (error) {
      res.status(404).send("Update Failed!!!  " + error.message);
    }
})

// connecting data base from cluster
connectDB().then (()=>{
  console.log("Database connection Establised....")
    app.listen(7777, () => {
    console.log("server successfully and Created on port number 7777")
  })
})
.catch((err) => {
    console.error("Databases Can't' be connected");
})








