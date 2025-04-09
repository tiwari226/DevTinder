const express = require("express")
const connectDB = require("./config/database")
const app = express()
const User = require("./models/user")

app.post("/signup", async (req, res) => {
  const user = new User({
    "firstName": "Om",
    "lastName" : "Tiwari",
    "emailId" : "omti@gmail.com",
    "password" : "123@123",
    "age" : "22",
    "gender" : "Male"
  })
  try {
    await user.save();
    res.send("Account Created Succesfully....")
  } catch (error) {
    res.status(404).send("Data not saved !!")
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








