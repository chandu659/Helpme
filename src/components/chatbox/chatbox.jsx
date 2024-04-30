import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './chatbox.css'; 

const socket = io('http://localhost:8001'); 

function Chatbox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
   
    socket.on('chat message', (message) => {
      setMessages((msgs) => [...msgs, message]);
    });

    
    return () => {
      socket.off('chat message');
    };
  }, []);

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit('chat message', input);
      setInput('');
    }
  };

  return (
    <div className="chatbox">
      <ul id="messages">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))
        ) : (
          <li className="no-messages">No messages yet</li>
        )}
      </ul>
      <form id="form" onSubmit={handleSubmit}>
        <input
          id="input"
          autoComplete="off"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chatbox;
