require('dotenv').config(); 
const conf = {   
    dataBaseUrl: process.env.DATABASE_URL,
    port: process.env.PORT,
    jwt_key: process.env.JWTKEY,
    front: process.env.FRONTURL,
}
module.exports = conf;