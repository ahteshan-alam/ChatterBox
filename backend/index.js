import 'dotenv/config';
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 5000;
const serverimport 'dotenv/config';
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
    origin: process.env.FRONTEND_URL,,
    methods: ["GET", "POST"]
  }
});

let rooms = {};
const userData = new Map();

app.use(cors());

app.get("/", (req, res) => {
  res.send("welcome");
});

io.on("connection", (socket) => {
  socket.on("join-room", ({ username, room }) => {
    if (socket.currRoom) {
      socket.leave(socket.currRoom);
    }
    socket.join(room);
    socket.username = username;
    userData.set(socket.id, { username, room });
    rooms[room] = (rooms[room] || []).filter(c => c.id !== socket.id);
    rooms[room].push({ username: username, id: socket.id });
    socket.to(room).emit("user-joined", {
      message: `${username} joined the chat`,
      type: "notification",
      id: uuidv4(),
      clients: rooms[room]
    });
    socket.emit("welcome", {
      type: "notification",
      message: `welcome to the room ${username}`,
      id: uuidv4(),
      clients: rooms[room]
    });
  });

  socket.on("message", ({ message, username }) => {
    const user = userData.get(socket.id);
    if (!user || !user.room) return;
    io.to(user.room).emit("send-message", {
      message,
      username,
      type: "message",
      id: uuidv4(),
      time: new Date().toISOString(),
      userId: socket.id
    });
  });

  socket.on("typing", ({ username, room }) => {
    if (username === "") {
      socket.to(room).emit("user-typing", { message: "" });
    } else {
      socket.to(room).emit("user-typing", { message: `${username} is typing ...` });
    }
  });

  socket.on("disconnect", () => {
    const user = userData.get(socket.id);
    if (!user || !user.room) return;
    const { room, username } = user;
    rooms[room] = (rooms[room] || []).filter(c => c.id !== socket.id);
    if (rooms[room].length === 0) {
      delete rooms[room];
    }
    socket.to(room).emit("user-left", {
      message: `${username} left the chat`,
      type: "notification",
      id: uuidv4(),
      clients: rooms[room]
    });
    userData.delete(socket.id);
  });
});

server.listen(port, () => {
  console.log("server online at 5000");
});
 = createServer(app);
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
