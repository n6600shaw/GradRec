const mongoose = require('mongoose');
const {
    Schema
} = mongoose;

const projectSchema = new Schema({
title:String,
description:String,
posMaster:Number,
posPhd:Number,
department:String,
interest:[String],
skills:[String],
startDate:Date,
funds:String,
matched:[{type:Schema.Types.ObjectId, ref:'User'}],
applied:[{type:Schema.Types.ObjectId, ref:'User'}],
enrolled:[{type:Schema.Types.ObjectId, ref:'User'}],
offers:[{type:Schema.Types.ObjectId,ref:'User'}],




});

mongoose.model('projects', projectSchema);