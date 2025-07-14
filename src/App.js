import React, { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    { id: 1, text: 'Welcome to AI Engineering Assistant! How can I help you?', sender: 'bot' }
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      setChat([...chat, 
        { id: Date.now(), text: message, sender: 'user' },
        { id: Date.now() + 1, text: `You said: "${message}". AI response coming soon!`, sender: 'bot' }
      ]);
      setMessage('');
    }
  };

  return (
    <div className="App">
      <header>
        <h1>🤖 AI Engineering Assistant</h1>
        <p>LHR86 DCEO Support System</p>
      </header>
      
      <main>
        <div className="chat-box">
          {chat.map(msg => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        
        <div className="input-area">
          <input 
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about procedures, sites, teams..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </main>
    </div>
  );
}

export default App;