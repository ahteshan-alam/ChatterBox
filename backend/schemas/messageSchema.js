import mongoose from "mongoose";
const messageSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    roomId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    type:{
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