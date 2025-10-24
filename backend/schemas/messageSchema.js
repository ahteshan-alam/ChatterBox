import mongoose from "mongoose";
const messageSchema=new mongoose.Schema({
    sender:{
        type:String,
        required:true
    },
    roomId:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    }
})
const Message=mongoose.model("Message",messageSchema);
export default Message;