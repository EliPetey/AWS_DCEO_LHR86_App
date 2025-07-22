import React, { useState } from 'react';
import './App.css';
import KnowledgeCollection from './components/KnowledgeCollection';
import InterviewSystem from './components/InterviewSystem';
import AmazonChat from './components/AmazonChat';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  // Placeholder for File Organizer - will be replaced later
  const FileOrganizer = () => (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center', 
      background: 'white', 
      borderRadius: '20px', 
      margin: '1rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
    }}>
      <h2>📁 AI File Organizer</h2>
      <p style={{ color: '#6c757d', fontSize: '1.1rem', marginBottom: '1rem' }}>
        This feature is coming soon!
      </p>
      <p style={{ color: '#6c757d' }}>
        AI will help organize your files based on expert knowledge from the DCEO team.
      </p>
      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: '#f8f9fa', 
        borderRadius: '10px',
        border: '1px solid #e9ecef'
      }}>
        <strong>Planned Features:</strong>
        <ul style={{ textAlign: 'left', marginTop: '1rem', color: '#495057' }}>
          <li>Automatic file categorization</li>
          <li>Document type recognition</li>
          <li>Smart folder organization</li>
          <li>Search and retrieval</li>
        </ul>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'knowledge':
        return <KnowledgeCollection />;
      case 'organizer':
        return <FileOrganizer />;
      case 'interview':
        return <InterviewSystem />;
      default:
        return <AmazonChat />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🤖 AI Engineering Assistant</h1>
          <p>AWS DCEO Knowledge Hub - Powered by Amazon Q</p>
          <div className="header-badges">
            <span className="badge">DCEO Operations</span>
            <span className="badge">Amazon Q</span>
            <span className="badge">Knowledge Base</span>
          </div>
          
          <div className="main-navigation">
            <button 
              className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              💬 Ask AI Assistant
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
            <button 
              className={`nav-btn ${activeTab === 'interview' ? 'active' : ''}`}
              onClick={() => setActiveTab('interview')}
            >
              🎤 Structure Interview
            </button>
          </div>
        </div>
      </header>
      
      <main className="app-main">
        {renderContent()}
      </main>

      <footer className="app-footer">
        <p>AWS Data Center Engineering Operations | Powered by Amazon Q Business</p>
      </footer>
    </div>
  );
}

export default App;

// import React, { useState } from 'react';
// import './App.css';
// import KnowledgeCollection from './components/KnowledgeCollection';
// import InterviewSystem from './components/InterviewSystem';

// function App() {
//   const [message, setMessage] = useState('');
//   const [chat, setChat] = useState([
//     { 
//       id: 1, 
//       text: '🤖 Welcome to AI Engineering Assistant! I can help you with DCEO procedures, site information, team contacts, and technical documentation. I\'m now powered by your site-trained knowledge base! How can I assist you today?', 
//       sender: 'bot',
//       timestamp: new Date().toLocaleTimeString(),
//       sources: 0
//     }
//   ]);
//   const [isTyping, setIsTyping] = useState(false);
//   const [activeTab, setActiveTab] = useState('chat');

//   // New Amazon Q integration function
// const getAmazonQResponse = async (userMessage) => {
//   try {
//     console.log('🔍 Sending message:', userMessage);
    
//     const response = await fetch('https://7vkjgwj4ek.execute-api.eu-west-2.amazonaws.com/prod/ask', {
//       method: 'POST',
//       headers: { 
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       body: JSON.stringify({ 
//         message: userMessage,
//         interviewMode: false 
//       })
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log('🔍 Raw API Response:', data);
    
//     if (data.statusCode === 200) {
//       const responseBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
//       console.log('🔍 Parsed Response Body:', responseBody);
      
//       return {
//         text: responseBody.response,
//         sources: responseBody.sources?.length || 0,  // ← Fixed field name
//         source: responseBody.source  // ← Added source info
//       };
//     } else {
//       console.error('API Error:', data);
//       throw new Error('API returned error status');
//     }
    
//   } catch (error) {
//     console.error('Amazon Q API Error:', error);
//     return {
//       text: '❌ Sorry, I encountered an error connecting to the knowledge base. Let me try with my basic responses instead.\n\n' + generateBotResponse(userMessage),
//       sources: 0
//     };
//   }
// };

//   // Fallback responses (kept as backup)
//   const generateBotResponse = (userMessage) => {
//     const lowerMessage = userMessage.toLowerCase();
    
//     if (lowerMessage.includes('lhr86') || lowerMessage.includes('london')) {
//       return '🏢 LHR86 is our London Heathrow data center. The DCEO team handles electrical, HVAC, and life safety systems. For urgent issues, contact the duty phone or escalate through the proper channels. Need specific contact information?';
//     }
    
//     if (lowerMessage.includes('dceo') || lowerMessage.includes('team')) {
//       return '👥 DCEO (Data Center Engineering Operations) is responsible for electrical, HVAC, and life safety systems. We perform troubleshooting, maintenance, and vendor management. Which specific DCEO function do you need help with?';
//     }
    
//     if (lowerMessage.includes('electrical') || lowerMessage.includes('power')) {
//       return '⚡ For electrical issues: Check EPMS system, verify breaker status, and follow lockout/tagout procedures. Always use Two-Person Verification (TPVR) for critical work. Need specific electrical troubleshooting steps?';
//     }
    
//     if (lowerMessage.includes('hvac') || lowerMessage.includes('cooling') || lowerMessage.includes('crah')) {
//       return '❄️ For HVAC/cooling issues: Monitor BMS system, check CRAH units, verify chilled water flow, and inspect dampers. Maintain redundancy at all times. What specific cooling issue are you experiencing?';
//     }
    
//     if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
//       return '🚨 For emergencies: Contact duty phone immediately, follow emergency procedures, ensure safety first. For life safety issues, evacuate if necessary and call emergency services. What type of emergency are you dealing with?';
//     }
    
//     if (lowerMessage.includes('safety') || lowerMessage.includes('lockout') || lowerMessage.includes('tagout')) {
//       return '🔒 Safety procedures: Always follow lockout/tagout (LOTO) procedures, use proper PPE, implement Two-Person Verification Rule (TPVR) for critical work. Safety is our top priority. What safety procedure do you need help with?';
//     }
    
//     if (lowerMessage.includes('maintenance') || lowerMessage.includes('pm') || lowerMessage.includes('preventive')) {
//       return '🔧 For maintenance: Follow scheduled PM procedures, coordinate with vendors, document all work, maintain system redundancy. Check maintenance schedules in the system. What maintenance task do you need assistance with?';
//     }
    
//     if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
//       return '👋 Hello! I\'m here to help with DCEO operations. I can assist with procedures, site information, team contacts, troubleshooting, and documentation. What would you like to know about?';
//     }
    
//     if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('escalate')) {
//       return '📞 For contacts: Use duty phone for urgent issues, escalate through proper channels, contact team leads for guidance. Check the contact directory for specific numbers. What type of contact do you need?';
//     }
    
//     return `💡 I received your message about "${userMessage}". I can help with DCEO procedures, site operations, team information, electrical/HVAC systems, safety protocols, and documentation. Could you be more specific about what you need assistance with?`;
//   };

//   const sendMessage = async () => {
//     if (!message.trim()) return;

//     const userMessage = {
//       id: Date.now(),
//       text: message,
//       sender: 'user',
//       timestamp: new Date().toLocaleTimeString()
//     };

//     setChat(prev => [...prev, userMessage]);
//     const currentMessage = message;
//     setMessage('');
//     setIsTyping(true);

//     // Use Amazon Q API
//     const response = await getAmazonQResponse(currentMessage);
    
//     setTimeout(() => {
//       const botResponse = {
//         id: Date.now() + 1,
//         text: response.text,
//         sender: 'bot',
//         timestamp: new Date().toLocaleTimeString(),
//         sources: response.sources
//       };
//       setChat(prev => [...prev, botResponse]);
//       setIsTyping(false);
//     }, 1000);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const clearChat = () => {
//     setChat([{
//       id: 1,
//       text: '🤖 Chat cleared! I\'m ready to help with DCEO operations using our site-trained knowledge base. What would you like to know?',
//       sender: 'bot',
//       timestamp: new Date().toLocaleTimeString(),
//       sources: 0
//     }]);
//   };

//   // Placeholder for File Organizer - will be replaced later
//   const FileOrganizer = () => (
//     <div style={{ 
//       padding: '2rem', 
//       textAlign: 'center', 
//       background: 'white', 
//       borderRadius: '20px', 
//       margin: '1rem',
//       boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
//     }}>
//       <h2>📁 AI File Organizer</h2>
//       <p style={{ color: '#6c757d', fontSize: '1.1rem', marginBottom: '1rem' }}>
//         This feature is coming soon!
//       </p>
//       <p style={{ color: '#6c757d' }}>
//         AI will help organize your files based on expert knowledge from the DCEO team.
//       </p>
//       <div style={{ 
//         marginTop: '2rem', 
//         padding: '1rem', 
//         background: '#f8f9fa', 
//         borderRadius: '10px',
//         border: '1px solid #e9ecef'
//       }}>
//         <strong>Planned Features:</strong>
//         <ul style={{ textAlign: 'left', marginTop: '1rem', color: '#495057' }}>
//           <li>Automatic file categorization</li>
//           <li>Document type recognition</li>
//           <li>Smart folder organization</li>
//           <li>Search and retrieval</li>
//         </ul>
//       </div>
//     </div>
//   );

//   const renderContent = () => {
//     switch(activeTab) {
//       case 'knowledge':
//         return <KnowledgeCollection />;
//       case 'organizer':
//         return <FileOrganizer />;
//       case 'interview':
//         return <InterviewSystem />;
//       default:
//         return (
//           <div className="chat-container">
//             <div className="chat-header">
//               <div className="chat-info">
//                 <span className="status-indicator online"></span>
//                 <span>AI Assistant Online (Site-Trained)</span>
//               </div>
//               <button onClick={clearChat} className="clear-btn">
//                 🗑️ Clear Chat
//               </button>
//             </div>
              
//             <div className="chat-messages">
//               {chat.map(msg => (
//                 <div key={msg.id} className={`message ${msg.sender}`}>
//                   <div className="message-content">
//                     <div className="message-text">
//                       {(msg.text || msg.response || '').split('\n').map((line, i) => (
//                         <div key={i}>{line}</div>
//                       ))}
//                     </div>
//                     {(msg.sources || 0) > 0 && (
//                       <div className="sources-info">
//                         📚 Found {msg.sources} relevant engineer responses
//                       </div>
//                     )}
//                     {msg.source && (
//                       <div className="ai-source">
//                         🤖 Powered by: {msg.source}
//                       </div>
//                     )}
//                     <div className="message-time">{msg.timestamp}</div>
//                   </div>
//                 </div>
//               ))}

              
//               {isTyping && (
//                 <div className="message bot typing">
//                   <div className="message-content">
//                     <div className="typing-indicator">
//                       <span></span>
//                       <span></span>
//                       <span></span>
//                     </div>
//                     <div className="typing-text">Searching knowledge base...</div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="chat-input">
//               <div className="input-container">
//                 <textarea
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Ask about procedures, equipment, safety, maintenance, commissioning..."
//                   rows="1"
//                   className="message-input"
//                 />
//                 <button 
//                   onClick={sendMessage} 
//                   disabled={!message.trim() || isTyping}
//                   className="send-button"
//                 >
//                   {isTyping ? '⏳' : '📤'} Send
//                 </button>
//               </div>
//               <div className="input-help">
//                 💡 Try asking about: rack installation, commissioning procedures, safety protocols, equipment maintenance, troubleshooting steps
//               </div>
//             </div>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="App">
//       <header className="app-header">
//         <div className="header-content">
//           <h1>🤖 AI Engineering Assistant</h1>
//           <p>AWS DCEO Knowledge Hub - Site-Trained AI</p>
//           <div className="header-badges">
//             <span className="badge">DCEO Operations</span>
//             <span className="badge">Site-Trained AI</span>
//             <span className="badge">Knowledge Base</span>
//           </div>
          
//           <div className="main-navigation">
//             <button 
//               className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
//               onClick={() => setActiveTab('chat')}
//             >
//               💬 Ask AI Assistant
//             </button>
//             <button 
//               className={`nav-btn ${activeTab === 'knowledge' ? 'active' : ''}`}
//               onClick={() => setActiveTab('knowledge')}
//             >
//               🧠 Share Knowledge
//             </button>
//             <button 
//               className={`nav-btn ${activeTab === 'organizer' ? 'active' : ''}`}
//               onClick={() => setActiveTab('organizer')}
//             >
//               📁 Organize Files
//             </button>
//             <button 
//               className={`nav-btn ${activeTab === 'interview' ? 'active' : ''}`}
//               onClick={() => setActiveTab('interview')}
//             >
//               🎤 Structure Interview
//             </button>
//           </div>
//         </div>
//       </header>
      
//       <main className="app-main">
//         {renderContent()}
//       </main>

//       <footer className="app-footer">
//         <p>AWS Data Center Engineering Operations | Site-Trained AI Knowledge System</p>
//       </footer>
//     </div>
//   );
// }

// export default App;