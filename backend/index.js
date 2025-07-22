import 'dotenv/config';
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 5000;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"]
    }
});


let users = {};
let clients=[]
app.use(cors());

app.get("/", (req, res) => {
  res.send("welcome");
});

io.on("connection", (socket) => {
    socket.on("joined", ({ username }) => {
        users[socket.id] = username;
        clients.push({id:socket.id,username:username})
        console.log(clients)
        io.emit("list",{clients})
          socket.broadcast.emit("userJoined", {
            name: "Admin",
            message: `${username} has joined the chat`,
            type: "notification",
            id: uuidv4()
        });
        socket.emit("welcome", {
            name: "Admin",
            message: `welcome to the chat ${username}`,
            type: "notification",
            id: uuidv4()
        });
        
    });
  

  socket.on("message", ({ username, message }) => {
    const id = uuidv4();
    let time = Date.now();
    io.emit("sendMessage", { username, message, id, type: "message",time });
});

  socket.on("disconnect", () => {
    const username = users[socket.id];
    clients=clients.filter((client)=> client.id!==socket.id)
    if (username) {
        socket.broadcast.emit("leave", {
            name: "admin",
            message: `${username} has left the chat`,
            type: "notification",
            id: uuidv4(),
            
        });
    }
    delete users[socket.id];
   io.emit("list",{clients})
    
});
});

server.listen(port, () => {
  console.log("server online at 5000");
});
