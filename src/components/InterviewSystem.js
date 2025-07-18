import React, { useState, useEffect} from 'react';
import './InterviewSystem.css';

const InterviewSystem = () => {
  const [interviewState, setInterviewState] = useState('start'); // start, active, analyzing, feedback
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [structureApproved, setStructureApproved] = useState(false);
  const [error, setError] = useState('');
  const [interviewActive, setInterviewActive] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);

  // Updated API endpoint to use AmazonQKnowledgeAPI
  const API_BASE_URL = 'https://dwwlkt4c5c.execute-api.eu-west-2.amazonaws.com/prod';

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
  try {
    setLoading(true);
    setError('');
    
    console.log('Starting interview for topic:', topicId);
    
    const response = await fetch('https://7vkjgwj4ek.execute-api.eu-west-2.amazonaws.com/prod/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `I want to start an interview about ${topicId}. Please ask me the first question about file organization.`,  // ← Changed from inputText
        interviewMode: true,
        questionIndex: 0  // ← Added this
      })
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Full response data:', data);

    // Extract response from your Lambda format
    let aiResponse;
    if (data.statusCode === 200) {
      const responseBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      aiResponse = responseBody.response;
    } else {
      aiResponse = 'Error starting interview. Please try again.';
    }

    console.log('Extracted AI response:', aiResponse);

    // Clear previous messages and add the first question
    setMessages([{
      id: 1,
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    }]);

    setCurrentTopic(topicId);
    setInterviewActive(true);
    setInterviewComplete(false);

  } catch (error) {
    console.error('Error starting interview:', error);
    setError('Sorry, there was an error starting the interview. Please try again.');
  } finally {
    setLoading(false);
  }
};

 const sendResponse = async () => {
  if (!inputText.trim()) return;

  try {
    setLoading(true);
    
    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');

    console.log('Sending response:', currentInput);

    const response = await fetch('https://7vkjgwj4ek.execute-api.eu-west-2.amazonaws.com/prod/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: currentInput,  // ← Changed from inputText
        interviewMode: true,
        questionIndex: messages.filter(msg => msg.sender === 'user').length  // ← Track question number
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Full response data:', data);

    // Extract response from your Lambda format
    let aiResponse;
    if (data.statusCode === 200) {
      const responseBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      aiResponse = responseBody.response;
      
      // Check if interview is complete
      if (responseBody.interviewComplete) {
        setInterviewComplete(true);
        setInterviewActive(false);
        setInterviewState('feedback');
      }
    } else {
      aiResponse = 'Sorry, there was an error processing your response. Please try again.';
    }

    console.log('Extracted AI response:', aiResponse);

    // Add AI response
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    }]);

  } catch (error) {
    console.error('Error sending response:', error);
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      text: 'Sorry, there was an error processing your response. Please try again.',
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    }]);
  } finally {
    setLoading(false);
  }
};

  const generateFileStructure = async () => {
    try {
      // Updated to use AmazonQKnowledgeAPI
      const response = await fetch('https://7vkjgwj4ek.execute-api.eu-west-2.amazonaws.com/prod/ask', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          inputText: 'GENERATE_FILE_STRUCTURE',
          interviewMode: true,
          topic: currentTopic,
          engineerId: 'current-engineer'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
      setInterviewState('feedback');
      
    } catch (error) {
      console.error('Error generating structure:', error);
      const errorMessage = {
        id: Date.now() + 2,
        text: '❌ Sorry, there was an error generating the file structure.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const provideFeedback = (type) => {
    if (type === 'approve') {
      // Save approval
      saveFeedback('APPROVED', 'Structure approved by engineer');
      setStructureApproved(true);
      
      const approvalMessage = {
        id: Date.now(),
        text: '🎉 **Thank you for your approval!**\n\nYour feedback has been recorded. This structure will contribute to our final S3 organization system.\n\n✅ **Status:** Approved by engineer\n📊 **Next:** More engineers will review this structure\n🚀 **Goal:** Build consensus for S3 deployment',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, approvalMessage]);
    } else {
      setShowFeedbackInput(true);
    }
  };

  const submitFeedback = async () => {
    if (!feedbackText.trim()) return;
    
    // Save feedback and regenerate structure
    await saveFeedback('MODIFICATION_REQUEST', feedbackText);
    
    const feedbackMessage = {
      id: Date.now(),
      text: `📝 **Feedback received:** "${feedbackText}"\n\n🔄 Let me regenerate the structure based on your suggestions...`,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, feedbackMessage]);
    
    // Regenerate structure with feedback
    setLoading(true);
    setTimeout(() => {
      generateImprovedStructure();
    }, 2000);
    
    setFeedbackText('');
    setShowFeedbackInput(false);
  };

  const generateImprovedStructure = async () => {
    try {
      // Updated to use AmazonQKnowledgeAPI
      const response = await fetch('https://7vkjgwj4ek.execute-api.eu-west-2.amazonaws.com/prod/ask', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          inputText: 'REGENERATE_STRUCTURE_WITH_FEEDBACK',
          interviewMode: true,
          topic: currentTopic,
          engineerId: 'current-engineer'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const responseBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      
      const improvedStructureMessage = {
        id: Date.now() + 3,
        text: `🔄 **Improved Structure Based on Your Feedback:**\n\n${responseBody.response}`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        isStructure: true
      };

      setMessages(prev => [...prev, improvedStructureMessage]);
      
    } catch (error) {
      console.error('Error generating improved structure:', error);
      const errorMessage = {
        id: Date.now() + 3,
        text: '❌ Sorry, there was an error generating the improved structure.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const saveFeedback = async (type, feedback) => {
    try {
      // Updated to use AmazonQKnowledgeAPI
      await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          inputText: `FEEDBACK:${type}:${feedback}`,
          interviewMode: true,
          topic: currentTopic,
          engineerId: 'current-engineer'
        })
      });
    } catch (error) {
      console.error('Error saving feedback:', error);
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
    setShowFeedbackInput(false);
    setFeedbackText('');
    setStructureApproved(false);
  };

  if (interviewState === 'start') {
    return (
      <div className="interview-start">
        <div className="interview-header">
          <h2>🎤 File Organization Interview</h2>
          <p>Help AI understand how engineering documents should be organized</p>
          <div className="interview-stats">
            <span className="stat">📊 Building Knowledge Base</span>
            <span className="stat">🧠 AI Learning System</span>
            <span className="stat">🏗️ S3 Structure Planning</span>
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
          <h3>💡 How the Learning Process Works:</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-icon">🤖</span>
              <div>
                <strong>AI asks smart questions</strong>
                <p>Follow-up questions based on your responses</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">💾</span>
              <div>
                <strong>Knowledge is captured</strong>
                <p>All responses saved for analysis</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🏗️</span>
              <div>
                <strong>Structure generated</strong>
                <p>AI creates recommendations</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📝</span>
              <div>
                <strong>Feedback & refinement</strong>
                <p>Approve or request changes</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">👥</span>
              <div>
                <strong>Multi-engineer consensus</strong>
                <p>Build agreement across team</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🚀</span>
              <div>
                <strong>S3 deployment ready</strong>
                <p>Final structure for implementation</p>
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
          <h2>🧠 Analyzing Your Responses...</h2>
          <p>AI is processing your knowledge to generate file structure recommendations</p>
        </div>
        
        <div className="analyzing-animation">
          <div className="pulse-circle"></div>
          <div className="analyzing-text">
            <p>✅ Processing conversation history</p>
            <p>✅ Extracting organizational patterns</p>
            <p>✅ Analyzing engineer preferences</p>
            <p>🔄 Generating structure recommendations...</p>
          </div>
        </div>

        <div className="conversation-summary">
          <h3>📝 Your Responses Summary:</h3>
          <div className="messages-summary">
            {messages.filter(msg => msg.sender === 'user').map((msg, index) => (
              <div key={index} className="summary-item">
                <strong>Response {index + 1}:</strong> {msg.text.substring(0, 100)}...
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (interviewState === 'feedback') {
    return (
      <div className="interview-feedback">
        <div className="feedback-header">
          <h2>🏗️ Generated File Structure</h2>
          <p>Based on your responses, here's the recommended organization</p>
        </div>

        <div className="structure-display">
          {messages.filter(msg => msg.isStructure).map(msg => (
            <div key={msg.id} className="structure-content">
                {(msg.text || '').split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
            </div>
            ))}
        </div>

        {!structureApproved && !showFeedbackInput && (
          <div className="structure-feedback">
            <h3>📝 What do you think of this structure?</h3>
            <p>Your feedback helps improve the system for everyone</p>
            
            <div className="feedback-buttons">
              <button 
                onClick={() => provideFeedback('approve')} 
                className="approve-btn"
              >
                ✅ This looks good - I approve!
              </button>
              <button 
                onClick={() => provideFeedback('modify')} 
                className="modify-btn"
              >
                🔄 Needs changes - let me provide feedback
              </button>
            </div>
          </div>
        )}

        {showFeedbackInput && (
          <div className="feedback-input-section">
            <h4>💭 What changes would you like?</h4>
            <p>Be specific about what should be different:</p>
            <textarea
              placeholder="Example: 'Move safety procedures to top level', 'Add separate folder for commissioning docs', 'Rename Equipment to Hardware'..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows="4"
              className="feedback-textarea"
            />
            <div className="feedback-actions">
              <button 
                onClick={submitFeedback} 
                className="submit-feedback-btn"
                disabled={!feedbackText.trim() || loading}
              >
                {loading ? '⏳ Processing...' : '📤 Submit Feedback & Regenerate'}
              </button>
              <button 
                onClick={() => setShowFeedbackInput(false)} 
                className="cancel-feedback-btn"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        )}

        <div className="feedback-actions-bottom">
          <button onClick={resetInterview} className="new-interview-btn">
            🎤 Start New Interview
          </button>
          {structureApproved && (
            <button className="view-consensus-btn">
              👥 View Team Consensus (Coming Soon)
            </button>
          )}
        </div>

        <div className="next-steps-info">
          <h4>🚀 What happens next?</h4>
          <ul>
            <li>✅ Your feedback is saved and analyzed</li>
            <li>🤖 AI learns from your preferences</li>
            <li>👥 Other engineers will also provide input</li>
            <li>🏗️ Final consensus structure will be created</li>
            <li>📁 Structure will be deployed to S3 for file organization</li>
          </ul>
        </div>
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
                {(msg.text || '').split('\n').map((line, i) => (
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
              <div className="typing-text">AI is analyzing your response...</div>
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
            placeholder="Share your knowledge and experience in detail..."
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
          💡 Be detailed - your insights help build the perfect file organization system!
        </div>
      </div>
    </div>
  );
};

export default InterviewSystem;