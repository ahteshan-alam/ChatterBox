import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./chat.css";
import Message from "../message/message";
import ScrollToBottom from "react-scroll-to-bottom";
import io from "socket.io-client";

function Chat() {
  const location = useLocation();
  const username = location.state?.username;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useRef(null);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.current.emit("message", { message, username });
    setMessage("");
  };

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_BACKEND_URL);

    socket.current.on("connect", () => {
      socket.current.emit("joined", { username });
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
