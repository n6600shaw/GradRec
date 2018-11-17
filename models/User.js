const mongoose = require("mongoose");
const {
    schema
} = mongoose;

userSchema=new Schema({
    userName: String,
    password: String
})

mongoose.model('users',userSchema);