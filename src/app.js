const express = require("express")
const connectDB = require("./config/database")
const app = express()
const cookieParser = require("cookie-parser")

app.use(express.json())
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);



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


// last 19 min/ e - 13;











