import { useEffect, useRef } from "react";
import "./chat.css";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { useState } from "react";
import Message from "../message/message";
import ScrollToBottom from "react-scroll-to-bottom";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL;



function Chat() {
  const socket = useRef(null);
  const location = useLocation();
  const username = location.state?.username;

  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [timeline, setTimeline] = useState([]);


  const handleChange = (e) => {

  
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    socket.current.emit("message", { message, username });
    setMessage("");
  };

  useEffect(() => {
    socket.current = io(ENDPOINT, { transports: ["websocket"] });

    socket.current.on("connect", () => {
      setUser(socket.current.id);
    });

    socket.current.emit("joined", { username });

    socket.current.on("welcome", (data) => {
      setTimeline((prev)=>[...prev,{type:"notification", text: `${data.name} ${data.message}`, time: Date.now()}])
    });

    socket.current.on("userJoined", (data) => {
      setTimeline((prev)=>[...prev,{type:"notification", text: `${data.name} ${data.message}`, time: Date.now()}])
    });

    socket.current.on("leave", (data) => {
      setTimeline((prev)=>[...prev,{type:"notification", text: `${data.name} ${data.message}`, time: Date.now()}])
    });

    socket.current.on("sendMessage", ({ username, message, time, id }) => {
      setTimeline(prev => [...prev, {
        type: "message",
        username,
        message,
        time,
        id,
      }]);
      
    });

    return () => {
      socket.current.disconnect();
      socket.current.off();
    };
  }, []);
  
  

  return (
    <div className="chatbox">
      <div className="header">
        <h1>ChatterBox</h1>
      </div>

      <ScrollToBottom className="messages">
        {timeline.map((item, index) => {
  if (item.type === "notification") {
    return <h2 key={index} className="notification">{item.text}</h2>;
  } else {
    return <Message key={item.time} data={item} user={user} />;
  }
})}

      </ScrollToBottom>

      <div className="footer">
        <form className="messageForm" onSubmit={handleSubmit}>
        <input
          type="text"
          className="message"
          value={message}
          onChange={handleChange}
          required
        />
        <button type="submit" >
          send
        </button>
        </form>
        
      </div>
    </div>
  );
}

export default Chat;
