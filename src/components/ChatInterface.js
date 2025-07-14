import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import FileUpload from './FileUpload';

const ChatInterface = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Engineering Assistant. I can help you with:\n\n• Document analysis and processing\n• Technical questions about AWS services\n• Site, team, and project identification\n• File organization and naming\n\nHow can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() && !uploadedFile) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      file: uploadedFile
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response (replace with actual Amazon Q integration)
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateBotResponse(inputText, uploadedFile),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
      setUploadedFile(null);
    }, 2000);
  };

  const generateBotResponse = (text, file) => {
    if (file) {
      return `I've received your file "${file.name}". Based on the document analysis, here's what I found:\n\n📄 **Document Analysis:**\n• Site: LHR86 (London Heathrow)\n• Team: DCEO (Data Center Engineering Operations)\n• Type: Technical Drawing/SOP\n• Project: LV Switchgear Installation\n\n🔧 **Recommendations:**\n• File should be renamed to: ${file.name.split('.')[0]}-LHR86-DCEO-SOP-LVSwitchgear.pdf\n• This appears to be a critical infrastructure document\n• Ensure proper version control and approval workflow\n\nWould you like me to process more files or answer specific questions about this document?`;
    }

    // Simple keyword-based responses (replace with Amazon Q)
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('site') || lowerText.includes('location')) {
      return "I can help identify site information from documents. Common sites include:\n\n• LHR86 - London Heathrow\n• PDX - Portland Oregon\n• SIN - Singapore\n• SEA - Seattle\n\nPlease upload a document for specific site identification.";
    }
    
    if (lowerText.includes('team') || lowerText.includes('responsible')) {
      return "I can identify responsible teams from documents:\n\n• DCEO - Data Center Engineering Operations\n• DCO - Data Center Operations\n• HWEng - Hardware Engineering\n• InfraDelivery - Infrastructure Delivery\n\nUpload a document for team identification.";
    }
    
    if (lowerText.includes('eva') || lowerText.includes('assistant')) {
      return "EVA (Data Center Assistant) is an AI-powered tool for Amazon data center employees. It provides:\n\n• Quick access to technical documentation\n• Equipment manuals and procedures\n• Policy and compliance information\n• Troubleshooting guidance\n\nI can help you process documents similar to EVA's capabilities!";
    }

    return `I understand you're asking about: "${text}"\n\nI can help you with:\n• Document analysis and processing\n• Site and team identification\n• Technical questions about AWS infrastructure\n• File organization and naming conventions\n\nCould you provide more specific details or upload a document for analysis?`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-interface">
      <div className="messages-container">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="loading-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <FileUpload onFileSelect={setUploadedFile} selectedFile={uploadedFile} />
        
        <div className="message-input-wrapper">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about documents, sites, teams, or technical questions..."
            className="message-input"
            rows="2"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputText.trim() && !uploadedFile}
            className="send-button"
          >
            Send 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;