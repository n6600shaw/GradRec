const mongoose = require('mongoose');
const {
    Schema
} = mongoose;

const offerSchema = new Schema({

    proj:{ type: Schema.Types.ObjectId, ref: 'projects' },
    std:{ type: Schema.Types.ObjectId, ref: 'users' },
    content:String,
    isaccept:Boolean,
    isactive:Boolean,


});

mongoose.model('offers', offerSchema);