import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
const app=express();
const server = createServer(app);
const io = new Server(server);
const port=5000;
const users={}
app.use(cors());
app.get("/",(req,res)=>{
    res.send("welcome")
})
io.on('connection', (socket) => {
    
    socket.on("joined",({username})=>{
        users[socket.id]=username
        
        socket.emit("welcome",{name:"Admin : ",message:`welcome to the ChatterBox ${users[socket.id]}`})
         socket.broadcast.emit("userJoined",{name:"Admin : ",message:`${users[socket.id]} has joined the chat`})
    })
    socket.on("message",({username,message})=>{
        let id=socket.id;
        let time = Date.now();
        io.emit("sendMessage",{username,message,time,id})
    })
    socket.on('disconnect',()=>{
        socket.broadcast.emit("leave",{name:"Admin : ",message:`${users[socket.id]} has left the chat`})
        delete users[socket.id];
    })
});

server.listen(port,()=>{
    console.log("server online at 5000")
})
