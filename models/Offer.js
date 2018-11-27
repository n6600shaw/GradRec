const mongoose = require('mongoose');
const {
    Schema
} = mongoose;

const offerSchema = new Schema({
    name:String,
    project:{ type: Schema.Types.ObjectId, ref: 'projects' },
    student:{ type: Schema.Types.ObjectId, ref: 'users' },
    title:String,
    email:String,
    content:String,
    isaccept:Boolean,
    isactive:Boolean,
    


});

mongoose.model('offers', offerSchema);