const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    text:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    isSeen:{
        type:Boolean,
        default:false
    },
    isDelivered:{
        type:Boolean,
        default:false
    },
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Group",
        default:null
    }
}, {timestamps:true})

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;