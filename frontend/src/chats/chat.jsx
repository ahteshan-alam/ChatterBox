import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import "./chat.css";
import Message from "../message/message";
import ScrollToBottom from "react-scroll-to-bottom";
import io from "socket.io-client";


function Chat() {
  const location = useLocation();
  const username = location.state?.username;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const socket = useRef(null);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.current.emit("message", { message, username });
    setMessage("");
  };

  const toggleOnlineUsers = () => {
    setShowOnlineUsers(!showOnlineUsers);
  };

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_BACKEND_URL);


    socket.current.on("connect", () => {
      socket.current.emit("joined", { username });
    });

    socket.current.on("list", ({ clients }) => {
      setOnlineUsers(clients);
      
    });

    socket.current.on("userJoined", ({ name, message, id, type }) => {
      setMessages((prev) => [...prev, { username: name, message, id, type }]);
    });

    socket.current.on("welcome", ({ name, message, id, type }) => {
      setMessages((prev) => [...prev, { username: name, message, id, type }]);
    });

    socket.current.on("leave", ({ name, message, id, type }) => {
      setMessages((prev) => [...prev, { username: name, message, id, type }]);
    });

    socket.current.on("sendMessage", ({ username, message, id, type, time }) => {
      setMessages((prev) => [...prev, { username, message, id, type, time }]);
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
        <div className="online-section">
          <button 
            className="online-count-btn" 
            onClick={toggleOnlineUsers}
          >
            <span className="online-indicator">●</span>
            <span>{onlineUsers.length} online</span>
          </button>
          
          {showOnlineUsers && (
            <div className="online-dropdown">
              <div className="dropdown-header">
                Online Users ({onlineUsers.length})
              </div>
              <div className="online-users-list">
                {onlineUsers.map((client) => (
                  <div key={client.id} className="online-user-item">
                    <span className="user-online-indicator">●</span>
                    <span className="username">{client.username}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ScrollToBottom className="messages">
        {messages.map((item) => {
          if (item.type === "notification") {
            return (
              <h2 key={item.id} className="notification">
                {item.message}
              </h2>
            );
          } else {
            return <Message key={item.id} data={item} user={username} />;
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
          <button type="submit">send</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;