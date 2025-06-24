const mongoose = require("mongoose");
const data = require("../conf/conf");
 
const connectDB = async () => {
    await mongoose.connect(
        data.dataBaseUrl
    )
}

module.exports = connectDB;