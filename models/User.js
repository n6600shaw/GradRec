const mongoose = require("mongoose");
const {
    Schema
} = mongoose;

userSchema=new Schema({
    userName: String,
    email: String,
    password: String
})

mongoose.model('users',userSchema);