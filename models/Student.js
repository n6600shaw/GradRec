const mongoose = require('mongoose');
const {
    Schema
} = mongoose;

const studentSchema = new Schema({
    name: String


});

mongoose.model('students', studentSchema);