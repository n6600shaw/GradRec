const mongoose = require("mongoose");
const {
    Schema
} = mongoose;

userSchema=new Schema({
    firstName: String,
    lastName: String,
    userName: String,
    email: String,
    passWord: String,
    firstTime:Boolean,
    role: String,
    education:{degree:String,department:String},
    interest:[String],
    skills:[String],
    experience:String,
    startDate:Date,
    funds:String,
    matched:[{type:Schema.Types.ObjectId,ref:'Project'}],
    applied:[{type:Schema.Types.ObjectId,ref:'Project'}],
    enrolled:{type:Schema.Types.ObjectId,ref:'Project'},
    offers:[{type:Schema.Types.ObjectId, ref:'Offer'}]

})

mongoose.model('users',userSchema);