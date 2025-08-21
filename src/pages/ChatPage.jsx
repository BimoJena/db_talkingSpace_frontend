
import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("User");
  const messagesEndRef = useRef(null);

  const API = "http://localhost:8000/api";

  // load old messages
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.name || "User");

        axios
          .get(`${API}/messages`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setMessages(res.data)) // backend se latest first aa raha hai
          .catch((err) => console.error(err));
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  // socket wala kaam
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [message, ...prev]); // latest upar
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // scroll always top (latest message visible)
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${API}/messages`,
        { content: newMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNewMessage("");
    } catch (err) {
      console.log("message backend error: ", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <div className="bg-blue-600 text-white p-4 flex items-center shadow">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white text-blue-600 font-bold rounded-full flex items-center justify-center">
            {username[0]?.toUpperCase()}
          </div>
          <h1 className="font-semibold text-lg">{username}</h1>
        </div>
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet...</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.author?.name === username ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs ${
                  msg.author?.name === username
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-300 text-gray-900 rounded-bl-none"
                }`}
              >
                <p>{msg.content}</p>
                <span
                  className={`block text-xs mt-1 ${
                    msg.author?.name === username
                      ? "text-white/70"
                      : "text-gray-600"
                  }`}
                >
                  {msg.author?.name}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-white border-t flex items-center space-x-2"
      >
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatPage;
