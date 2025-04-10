const express = require("express")
const connectDB = require("./config/database")
const app = express()
const User = require("./models/user")
app.use(express.json())


// API for sign up
app.post("/signup", async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save();
    res.send("Account Created Succesfully....")
  } catch (error) {
    res.status(404).send("Data not saved !!")
  }
})


// get by EmailId
app.get("/feed", async (req, res) => {
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

// Get all document 
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


connectDB().then (()=>{
  console.log("Database connection Establised....")
    app.listen(7777, () => {
    console.log("server successfully and Created on port number 7777")
  })
})
.catch((err) => {
    console.error("Databases Can't' be connected");
})








