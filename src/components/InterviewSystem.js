import React, { useState } from 'react';
import './InterviewSystem.css';

const InterviewSystem = () => {
  const [interviewState, setInterviewState] = useState('start'); // start, active, analyzing
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');

  const interviewTopics = [
    {
      id: 'file_organization',
      title: '📁 File Organization Structure',
      description: 'Help me understand how you organize engineering documents and folders',
      icon: '📁'
    },
    {
      id: 'vendor_folders',
      title: '🏢 Vendor Document Organization',
      description: 'Tell me about how vendor documents should be structured',
      icon: '🏢'
    },
    {
      id: 'equipment_docs',
      title: '⚡ Equipment Documentation',
      description: 'How should equipment manuals and specs be organized?',
      icon: '⚡'
    },
    {
      id: 'procedures',
      title: '📋 Procedures and SOPs',
      description: 'Best way to organize standard operating procedures',
      icon: '📋'
    }
  ];

  const startInterview = async (topicId) => {
    const topic = interviewTopics.find(t => t.id === topicId);
    setCurrentTopic(topic.title);
    setInterviewState('active');
    setLoading(true);

    try {
      const response = await fetch('https://7vkjgwj4ek.execute-api.eu-west-2.amazonaws.com/prod/ask', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          inputText: `START_INTERVIEW:${topicId}`,
          interviewMode: true
        })
      });

      const data = await response.json();
      const responseBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      
      setMessages([{
        id: 1,
        text: responseBody.response,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      }]);
      
    } catch (error) {
      console.error('Error starting interview:', error);
      setMessages([{
        id: 1,
        text: '❌ Sorry, there was an error starting the interview. Please try again.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const sendResponse = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    const currentInput = inputText;
    setInputText('');

    try {
      const response = await fetch('https://7vkjgwj4ek.execute-api.eu-west-2.amazonaws.com/prod/ask', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          inputText: currentInput,
          interviewMode: true,
          topic: currentTopic
        })
      });

      const data = await response.json();
      const responseBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      
      const aiMessage = {
        id: Date.now() + 1,
        text: responseBody.response,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Check if interview is complete
      if (responseBody.interviewComplete) {
        setInterviewState('analyzing');
        setTimeout(() => {
          generateFileStructure();
        }, 2000);
      }
      
    } catch (error) {
      console.error('Error sending response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: '❌ Sorry, there was an error processing your response. Please try again.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const generateFileStructure = async () => {
    try {
      const response = await fetch('https://7vkjgwj4ek.execute-api.eu-west-2.amazonaws.com/prod/ask', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          inputText: 'GENERATE_FILE_STRUCTURE',
          interviewMode: true,
          topic: currentTopic
        })
      });

      const data = await response.json();
      const responseBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      
      const structureMessage = {
        id: Date.now() + 2,
        text: responseBody.response,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        isStructure: true
      };

      setMessages(prev => [...prev, structureMessage]);
      
    } catch (error) {
      console.error('Error generating structure:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendResponse();
    }
  };

  const resetInterview = () => {
    setInterviewState('start');
    setMessages([]);
    setInputText('');
    setCurrentTopic('');
  };

  if (interviewState === 'start') {
    return (
      <div className="interview-start">
        <div className="interview-header">
          <h2>🎤 File Organization Interview</h2>
          <p>Help AI understand how engineering documents should be organized</p>
          <div className="interview-stats">
            <span className="stat">📊 Responses collected: Building knowledge base</span>
            <span className="stat">🧠 AI Learning: Continuous improvement</span>
          </div>
        </div>

        <div className="interview-topics">
          <h3>Choose a topic to discuss:</h3>
          <div className="topics-grid">
            {interviewTopics.map(topic => (
              <div key={topic.id} className="topic-card">
                <div className="topic-icon">{topic.icon}</div>
                <h4>{topic.title}</h4>
                <p>{topic.description}</p>
                <button 
                  className="start-topic-btn"
                  onClick={() => startInterview(topic.id)}
                >
                  Start Discussion
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="interview-info">
          <h3>💡 How it works:</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-icon">🤖</span>
              <div>
                <strong>AI asks questions</strong>
                <p>Smart follow-up questions based on your responses</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">💾</span>
              <div>
                <strong>Knowledge is saved</strong>
                <p>Your insights help build the file organization system</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🏗️</span>
              <div>
                <strong>Structure generated</strong>
                <p>AI creates folder structures based on all responses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (interviewState === 'analyzing') {
    return (
      <div className="interview-analyzing">
        <div className="analyzing-header">
          <h2>🧠 Analyzing Responses...</h2>
          <p>AI is processing your knowledge to generate file structure recommendations</p>
        </div>
        
        <div className="analyzing-animation">
          <div className="pulse-circle"></div>
          <div className="analyzing-text">
            <p>✅ Processing conversation history</p>
            <p>✅ Extracting organizational patterns</p>
            <p>✅ Generating folder structure</p>
            <p>🔄 Creating recommendations...</p>
          </div>
        </div>

        <div className="conversation-summary">
          <h3>📝 Conversation Summary:</h3>
          <div className="messages-summary">
            {messages.filter(msg => msg.sender === 'user').map((msg, index) => (
              <div key={index} className="summary-item">
                <strong>Response {index + 1}:</strong> {msg.text.substring(0, 100)}...
              </div>
            ))}
          </div>
        </div>

        {messages.some(msg => msg.isStructure) && (
          <div className="structure-result">
            <h3>🏗️ Generated File Structure:</h3>
            {messages.filter(msg => msg.isStructure).map(msg => (
              <div key={msg.id} className="structure-content">
                {msg.text.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            ))}
            
            <div className="structure-actions">
              <button onClick={resetInterview} className="new-interview-btn">
                🎤 Start New Interview
              </button>
              <button className="implement-btn">
                🚀 Implement Structure (Coming Soon)
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="interview-active">
      <div className="interview-header">
        <h3>🎤 {currentTopic}</h3>
        <div className="interview-controls">
          <span className="status">🟢 Active Interview</span>
          <button onClick={resetInterview} className="exit-btn">❌ Exit</button>
        </div>
      </div>

      <div className="interview-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`interview-message ${msg.sender}`}>
            <div className="message-content">
              <div className="message-text">
                {msg.text.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
              <div className="message-time">{msg.timestamp}</div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="interview-message ai loading">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="typing-text">AI is thinking...</div>
            </div>
          </div>
        )}
      </div>

      <div className="interview-input">
        <div className="input-container">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your knowledge and experience..."
            rows="3"
            disabled={loading}
          />
          <button 
            onClick={sendResponse}
            disabled={!inputText.trim() || loading}
            className="send-response-btn"
          >
            {loading ? '⏳' : '📤'} Send
          </button>
        </div>
        <div className="input-help">
          💡 Be detailed - your insights help AI understand the best file organization approach!
        </div>
      </div>
    </div>
  );
};

export default InterviewSystem;