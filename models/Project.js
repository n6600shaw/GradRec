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
matched:[{type:Schema.Types.ObjectId, ref:'users'}],
applied:[{type:Schema.Types.ObjectId, ref:'users'}],
enrolled:[{type:Schema.Types.ObjectId, ref:'users'}],
offers:[{type:Schema.Types.ObjectId,ref:'offers'}],




});

mongoose.model('projects', projectSchema);