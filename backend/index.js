import { verifyToken } from './middleware/auth.js'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import User from './schemas/userSchema.js';
import Message from './schemas/messageSchema.js'
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const app = express()
const url = 'mongodb+srv://ahteshan_04:ahteshan0904@cluster0.poux9.mongodb.net/chatterbox?retryWrites=true&w=majority&appName=Cluster0'
app.use(express.json());
app.use(cors())
const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: "https://chatterbocs.netlify.app",
    methods: ["GET", "POST"]
  }
})

let rooms = {};
const userData = new Map();
io.on("connection", (socket) => {
  socket.on('join-room', ({ id, formData }) => {
    if (socket.currRoom) {
      socket.leave(socket.currRoom);
    }
    socket.room = formData.room
    socket.username = formData.username
    userData.set(socket.id, { username: formData.username, room: formData.room });
    if (!rooms[formData.room]) {
      rooms[formData.room] = []
    }
    rooms[formData.room] = rooms[formData.room].filter(client => client.id !== socket.id)
    rooms[formData.room].push({ username: formData.username, id: socket.id, busy: false, partner: null })
    socket.join(formData.room)
    const members = rooms[formData.room]

    socket.broadcast.to(formData.room).emit('user-joined', {
      
      message: `${socket.username} joined the chat`,
      type: "notification",
      id: uuidv4(),
      members
    })
    io.to(id).emit('welcome', {
      type: "notification",
      message: `welcome to the room ${socket.username}`,
      id: uuidv4(), members
    })


  })
  socket.on("message", ({ message, username }) => {
    const user = userData.get(socket.id);
    if (!user || !user.room) return;
    io.to(user.room).emit("send-message", {
      message,
      username,
      type: "message",
      id: uuidv4(),
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
      
    });
  });
  socket.on("typing", ({ username, room }) => {
    if (username === "") {
      socket.to(room).emit("user-typing", { message: "" });
    } else {
      socket.to(room).emit("user-typing", { message: `${username} is typing ...` });
    }
  });
  socket.on('offer', (payload) => {
    const room = rooms[socket.room];
    if (!room) return;
    const targetUser = rooms[socket.room]?.find(client => client.id === payload.target)

    if (targetUser && !targetUser.busy) {
      io.to(payload.target).emit('offer', payload)
    }
    else {

      io.to(payload.caller.id).emit('userBusy', { message: `${payload.target} is busy in another call` })
    }

  })
  socket.on('answer', (payload) => {
    const room = rooms[socket.room];
    if (!room) return;
    rooms[socket.room].forEach(client => { if (client.id === payload.caller.id || client.id === payload.target) { client.busy = true } })
    const caller = rooms[socket.room]?.find(client => client.id === payload.caller.id)
    const callee = rooms[socket.room]?.find(client => client.id === payload.target)
    if (caller && callee) {
      rooms[socket.room].forEach(client => { if (client.id === payload.caller.id) client.partner = callee.id })
      rooms[socket.room].forEach(client => { if (client.id === payload.target) client.partner = caller.id })
      console.log(caller, callee)
      io.to(payload.target).emit('answer', payload)
    }

  })
  socket.on('ice-candidate', (payload) => {
    io.to(payload.target).emit('ice-candidate', payload)
  })
  socket.on('call_reject', ({ targetUser, callee }) => {
    console.log('call reject')
    rooms[socket.room]?.find(client => { if (client.id === targetUser) { client.busy = false, client.partner = null } })
    rooms[socket.room]?.find(client => { if (client.id === callee) { client.busy = false, client.partner = null } })
    io.to(targetUser).emit('call_declined')
  })
  socket.on('call_canceled', ({ target, caller }) => {
    console.log(target.username)
    rooms[socket.room]?.find(client => { if (client.id === caller) { client.busy = false, client.partner = null } })
    rooms[socket.room]?.find(client => { if (client.id === target.id) { client.busy = false, client.partner = null } })
    io.to(target.id).emit('call_cancel')
  })
  socket.on('call_ended', ({ target }) => {
    const room = rooms[socket.room];
    if (!room) return;

    rooms[socket.room].forEach(client => { if (client.id === target) { client.partner = null, client.busy = false } });

    rooms[socket.room].forEach(client => { if (client.id === socket.id) { client.partner = null, client.busy = false } });
    io.to(target).emit('call_ended')
  })


  socket.on("disconnect",async() => {
    const room = rooms[socket.room];
    if (!room) return;
    const disconnectingUser = room.find(client => client.id === socket.id);
    if (!disconnectingUser) return;

    if (disconnectingUser.partner) {
      const partner = room.find(client => client.id === disconnectingUser.partner)

      if (partner) {
        partner.partner = null
        partner.busy = false
        io.to(partner.id).emit('call_ended');
      }
    }
    rooms[socket.room] = rooms[socket.room].filter(client => client.id !== socket.id)
    const members = rooms[socket.room]
    socket.to(socket.room).emit('user-left', {
      message: `${socket.username} left the chat`,
      type: "notification",
      id: uuidv4(),
      members
    })
    userData.delete(socket.id);
    if (rooms[socket.room].length === 0) {
      delete rooms[socket.room]
      await deleteMessages({roomId:socket.room})
    }






  })




})
app.post("/signUp", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields." });
    }

    const existingUser1 = await User.findOne({ username });
    if (existingUser1) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const existingUser2 = await User.findOne({ email });
    if (existingUser2) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
    res.status(201).json({ message: "User registered successfully", token, newUser });

  } catch (error) {
    // This is the safety net!
    console.error("SIGNUP ERROR:", error); // This shows you the real error in your Render logs
    return res.status(500).json({ message: "Server error during signup." });
  }
});
app.post("/logIn", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ message: `Logging in as ${user.username}`, token, user });

  } catch (error) {
    // The safety net!
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error during login." });
  }
});
app.post("/message",async(req,res)=>{
  const {username,message,type,roomId,userId,time=new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}=req.body;
  const newMessage=new Message({username,message,roomId,time,userId,type})
  console.log(type,"this is type")
  await newMessage.save()
  return res.status(200).json({message:"message saved successfully"})
})
app.get("/getMessage",async(req,res)=>{
  const { room } = req.query;
  const messages = await Message.find({ roomId: room });
  if (!messages || messages.length === 0) {
    return res.status(400).json({warning:"no previous message found"})
  }
  
  messages.forEach(msg=>console.log(msg.message))
  return res.status(200).json({message:messages})

})
const deleteMessages=async({roomId})=>{
 
   
    
   
     await Message.deleteMany({roomId})
  
}
  


app.get("/verify",verifyToken,(req,res)=>{
  res.status(200).json({ message: "Token is valid", userId: req.user.id });
})
const startServer = async () => {
  try {
    await mongoose.connect(url);
    console.log(' Connected to database');

    server.listen(2000, () => {
      console.log(' Server online at port 2000');
    });
  } catch (err) {
    console.error(' Error occurred while connecting to database:', err);
  }
};

startServer();
app.get('/',(req,res)=>{
  res.send("welcome to backend of chatterbocs")
})
