const mongoose = require("mongoose");
const {
    Schema
} = mongoose;

userSchema=new Schema({
    firstName: String,
    lastName: String,
    userName: String,
    email: String,
    password: String
})

mongoose.model('users',userSchema);