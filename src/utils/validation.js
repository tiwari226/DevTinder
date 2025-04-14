
const validator = require('validator');

const validateSignUpData = function(req){
        const{firstName, lastName, emailId, password} = req.body;
        if(!firstName || !lastName){
            throw new Error("please Enter Your Name....")
        } else if(!validator.isEmail(emailId)){
            throw new Error("Email is not valid...")
        }
        else if(!validator.isStrongPassword(password)){
            throw new Error("Enter strong Password..")
        }
}
module.exports = validateSignUpData
