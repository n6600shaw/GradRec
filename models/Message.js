const mongoose = require("mongoose");
const {
    Schema
} = mongoose;

messageSchema=new Schema({
from:{ type: Schema.Types.ObjectId, ref: 'User' },
to:{ type: Schema.Types.ObjectId, ref: 'User' },
content:String



});

mongoose.model("messages",messageSchema);