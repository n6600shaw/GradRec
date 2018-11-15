const mongoose = require('mongoose');
const {
    Schema
} = mongoose;

const projectSchema = new Schema({
title:String


});

mongoose.model('projects', projectSchema);