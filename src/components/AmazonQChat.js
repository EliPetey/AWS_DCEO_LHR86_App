import React, { useState } from 'react';
import './AmazonQChat.css';

const AmazonQChat = () => {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '👋 Hi! I\'m your AI assistant trained on data center engineering knowledge. Ask me about procedures, equipment, safety, or maintenance!',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { 
      type: 'user', 
      text: inputText, 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('https://7vkjgwj4ek.execute-api.eu-west-2.amazonaws.com/prod/ask', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ inputText })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const responseBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      
      const botMessage = { 
        type: 'bot', 
        text: responseBody.response, 
        sources: responseBody.sources_found,
        timestamp: new Date() 
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        type: 'bot', 
        text: '❌ Sorry, I encountered an error. Please try again or check your connection.', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setInputText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="amazon-q-chat">
      <div className="chat-header">
        <h3>🤖 AI Knowledge Assistant</h3>
        <p>Ask about data center procedures, equipment, safety, and maintenance</p>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <div className="message-content">
              {msg.text.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
            {msg.sources && (
              <div className="sources-info">
                📚 Found {msg.sources} relevant engineer responses
              </div>
            )}
            <div className="message-time">
              {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message bot loading">
            <div className="message-content">🤔 Searching knowledge base...</div>
          </div>
        )}
      </div>
      
      <div className="chat-input">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about procedures, equipment, safety protocols..."
          rows="2"
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !inputText.trim()}>
          {loading ? '⏳' : '📤'} Send
        </button>
      </div>
    </div>
  );
};

export default AmazonQChat;