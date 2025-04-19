const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
    },

    lastName:{
        type:String,
    },

    emailId:{
        type:String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Invalid Email Adderss : " + value)
          }
        }
    },

    password: {
        type:String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong Password : " + value)
              }
            }
    },

    age:{
        type: Number,
        min: 18,
    },

    gender : {
       type: String,
       validate(value){
        if(!["male", "female", "other"].includes(value)){
            throw new Error("gender data is not valid");
        }
       }  
    },

    photoUrl : {
    type :String,
    default: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
    }, 

    about : {
        type:String,
        default: "This is default for about this User",
    },

    skills : {
    type : [String],
    },

}, 
{
    timestamps: true,
});

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id}, "DEVTinder@790",{expiresIn: "1h"});
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)
    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);