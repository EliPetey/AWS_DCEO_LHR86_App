import React, { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    { 
      id: 1, 
      text: '🤖 Welcome to AI Engineering Assistant! I can help you with DCEO procedures, site information, team contacts, and technical documentation. How can I assist you today?', 
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('lhr86') || lowerMessage.includes('london')) {
      return '🏢 LHR86 is our London Heathrow data center. The DCEO team handles electrical, HVAC, and life safety systems. For urgent issues, contact the duty phone or escalate through the proper channels.';
    }
    
    if (lowerMessage.includes('dceo') || lowerMessage.includes('team')) {
      return '👥 DCEO (Data Center Engineering Operations) is responsible for electrical, HVAC, and life safety systems. We perform troubleshooting, maintenance, and vendor management.';
    }
    
    if (lowerMessage.includes('electrical') || lowerMessage.includes('power')) {
      return '⚡ For electrical issues: Check EPMS system, verify breaker status, and follow lockout/tagout procedures. Always use Two-Person Verification (TPVR) for critical work.';
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
      return '👋 Hello! I\'m here to help with DCEO operations. I can assist with procedures, site information, team contacts, troubleshooting, and documentation.';
    }
    
    return `💡 I received your message about "${userMessage}". I can help with DCEO procedures, site operations, team information, electrical/HVAC systems, safety protocols, and documentation.`;
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setChat(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateBotResponse(currentMessage),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setChat(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setChat([{
      id: 1,
      text: '🤖 Chat cleared! How can I help you with DCEO operations?',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  // Placeholder components - inline for now
  const KnowledgeCollection = () => (
    <div style={{ padding: '2rem', textAlign: 'center', background: 'white', borderRadius: '10px', margin: '1rem' }}>
      <h2>🧠 Knowledge Collection</h2>
      <p>This feature is coming soon!</p>
      <p>Engineers will be able to share their expertise here to improve the AI.</p>
    </div>
  );

  const FileOrganizer = () => (
    <div style={{ padding: '2rem', textAlign: 'center', background: 'white', borderRadius: '10px', margin: '1rem' }}>
      <h2>📁 File Organizer</h2>
      <p>This feature is coming soon!</p>
      <p>AI will help organize your files based on expert knowledge.</p>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'knowledge':
        return <KnowledgeCollection />;
      case 'organizer':
        return <FileOrganizer />;
      default:
        return (
          <div className="chat-container">
            <div className="chat-header">
              <div className="chat-info">
                <span className="status-indicator online"></span>
                <span>AI Assistant Online</span>
              </div>
              <button onClick={clearChat} className="clear-btn">
                🗑️ Clear Chat
              </button>
            </div>

            <div className="chat-messages">
              {chat.map(msg => (
                <div key={msg.id} className={`message ${msg.sender}`}>
                  <div className="message-content">
                    <div className="message-text">{msg.text}</div>
                    <div className="message-time">{msg.timestamp}</div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="message bot typing">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-input">
              <div className="input-container">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about DCEO procedures, site info, team contacts..."
                  rows="1"
                  className="message-input"
                />
                <button 
                  onClick={sendMessage} 
                  disabled={!message.trim()}
                  className="send-button"
                >
                  📤 Send
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🤖 AI Engineering Assistant</h1>
          <p>AWS DCEO LHR86 Support System</p>
          <div className="header-badges">
            <span className="badge">DCEO Operations</span>
            <span className="badge">LHR86 Site</span>
            <span className="badge">24/7 Support</span>
          </div>
          
          <div className="main-navigation">
            <button 
              className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              💬 Chat Assistant
            </button>
            <button 
              className={`nav-btn ${activeTab === 'knowledge' ? 'active' : ''}`}
              onClick={() => setActiveTab('knowledge')}
            >
              🧠 Share Knowledge
            </button>
            <button 
              className={`nav-btn ${activeTab === 'organizer' ? 'active' : ''}`}
              onClick={() => setActiveTab('organizer')}
            >
              📁 Organize Files
            </button>
          </div>
        </div>
      </header>
      
      <main className="app-main">
        {renderContent()}
      </main>

      <footer className="app-footer">
        <p>AWS Data Center Engineering Operations | LHR86 London Heathrow</p>
      </footer>
    </div>
  );
}

export default App;