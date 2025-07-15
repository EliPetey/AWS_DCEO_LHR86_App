import React, { useState } from 'react';
import './App.css';
import KnowledgeCollection from './Components/KnowledgeCollection';
import FileOrganizer from './Components/FileOrganizer';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    { 
      id: 1, 
      text: '🤖 Welcome to AI Engineering Assistant! I can help you with DCEO procedures, site information, team contacts, and technical documentation. You can also contribute knowledge or organize files using the tabs above. How can I assist you today?', 
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Enhanced responses based on keywords
    if (lowerMessage.includes('lhr86') || lowerMessage.includes('london')) {
      return '🏢 LHR86 is our London Heathrow data center. The DCEO team handles electrical, HVAC, and life safety systems. For urgent issues, contact the duty phone or escalate through the proper channels. Need specific contact information?';
    }
    
    if (lowerMessage.includes('dceo') || lowerMessage.includes('team')) {
      return '👥 DCEO (Data Center Engineering Operations) is responsible for electrical, HVAC, and life safety systems. We perform troubleshooting, maintenance, and vendor management. Which specific DCEO function do you need help with?';
    }
    
    if (lowerMessage.includes('electrical') || lowerMessage.includes('power')) {
      return '⚡ For electrical issues: Check EPMS system, verify breaker status, and follow lockout/tagout procedures. Always use Two-Person Verification (TPVR) for critical work. Need specific electrical troubleshooting steps?';
    }
    
    if (lowerMessage.includes('hvac') || lowerMessage.includes('cooling') || lowerMessage.includes('crah')) {
      return '❄️ For HVAC/cooling issues: Monitor BMS system, check CRAH units, verify chilled water flow, and inspect dampers. Maintain redundancy at all times. What specific cooling issue are you experiencing?';
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      return '🚨 For emergencies: Contact duty phone immediately, follow emergency procedures, ensure safety first. For life safety issues, evacuate if necessary and call emergency services. What type of emergency are you dealing with?';
    }
    
    if (lowerMessage.includes('procedure') || lowerMessage.includes('sop')) {
      return '📋 Standard Operating Procedures (SOPs) are available in the documentation system. Common procedures include: maintenance protocols, safety lockout, equipment commissioning, and emergency response. Which procedure do you need?';
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone')) {
      return '📞 Key contacts: Facility Manager, Chief Engineer, duty phone numbers are in the org chart. For escalations, follow the proper chain of command. Which team or person do you need to contact?';
    }
    
    if (lowerMessage.includes('ticket') || lowerMessage.includes('tt')) {
      return '🎫 For ticketing: Use SIM-T for issue tracking, select proper CTI (Category/Type/Item), include detailed description and site information. Need help with ticket creation or CTI selection?';
    }
    
    if (lowerMessage.includes('safety') || lowerMessage.includes('lockout')) {
      return '🔒 Safety first! Follow lockout/tagout procedures, use proper PPE, implement Two-Person Verification (TPVR) for critical work. Never bypass safety protocols. What safety procedure do you need guidance on?';
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
      return '👋 Hello! I\'m here to help with DCEO operations. I can assist with procedures, site information, team contacts, troubleshooting, and documentation. What would you like to know about?';
    }
    
    // Default response
    return `💡 I received your message about "${userMessage}". I can help with DCEO procedures, site operations, team information, electrical/HVAC systems, safety protocols, and documentation. Could you be more specific about what you need assistance with?`;
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
    setMessage('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateBotResponse(message),
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
                  placeholder="Ask about DCEO procedures, site info, team contacts, troubleshooting..."
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
              <div className="input-help">
                💡 Try asking about: LHR86 site info, DCEO teams, electrical procedures, HVAC systems, safety protocols
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