const express = require("express")
const connectDB = require("./config/database")
const app = express()
const cookieParser = require("cookie-parser")
const cors = require("cors")
const conf = require("./conf/conf")

const PORT = process.env.PORT || conf.port || 4000;

app.use(cors({
  origin:"http://localhost:5173",
  credentials: true
}));

app.use(express.json());
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
    app.listen(PORT, () => {
    console.log("server successfully and Created on port number ****")
  })
})
.catch((err) => {
    console.error("Databases Can't' be connected");
})












