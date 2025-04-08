const express = require("express")

const app = express()

//--------------------------------------------Creating a Server ----------------------------------->>

app.listen(3000, () => {
  console.log("server successfully and Created on port number 3000")
})


// ------------------------------------------------- routing concept----------------------------------------->

// // app.use("/", (req, res) => {
// //   res.send("Hello srever and is  most important created Om ji..")
// // })

// app.use("/test/2", (req, res) => {
//   res.send("Routes the elements at test router and some thing else !!!!!!!!!.............")
// })

// app.use("/test", (req, res) => {
//   res.send("Routes the elements at test router")
// })

//----------------------------------------------multimple route handller-------------------------------->

// app.use("/hello", (req, res, next) => {
//   console.log("My name is Om tiwari -1 ")
//     //  res.send("printed hello hello hello hello 1")
//       next();
// }, (req, res, next) => {
//   console.log("My name is Om tiwari-2")
//     //  res.send("printed hello hello hello hello 2")
//       next();
// }, (req, res, next) => {
//   console.log("My name is Om tiwari - 3")
//      res.send("printed hello hello hello hello 3")
//       // next();
// })


//---------------------------------------------------------errorHanding------------------------------------------>

// app.use("/getuser", (err, req, res, next) => {
//          try {
//           res.send("hello every thing is right")
//          } catch (err) {
//           throw err;
//          }
// })