import React, { useState, useEffect, useRef } from 'react';
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
  
  // ✅ ENGINEER TRACKING STATES
  const [engineerAlias, setEngineerAlias] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');

  // ✅ AUTO-SCROLL REFS
  const messagesEndRef = useRef(null);
  const feedbackMessagesEndRef = useRef(null);
  const structureDisplayRef = useRef(null);

  // ✅ INPUT REFS FOR AUTO-FOCUS
  const mainInputRef = useRef(null);
  const feedbackInputRef = useRef(null);

  // ✅ FEEDBACK CHAT STATES
  const [feedbackMessages, setFeedbackMessages] = useState([]);
  const [feedbackInputText, setFeedbackInputText] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // ✅ CURRENT STRUCTURE STATE - SEPARATE FROM MESSAGES
  const [currentStructure, setCurrentStructure] = useState('');
  const [structureUpdateTrigger, setStructureUpdateTrigger] = useState(0);

  // Updated API endpoint
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

  // ✅ AUTO-SCROLL WHEN MESSAGES CHANGE
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages]);

  // ✅ AUTO-SCROLL FOR FEEDBACK MESSAGES
  useEffect(() => {
    if (feedbackMessagesEndRef.current) {
      feedbackMessagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [feedbackMessages]);

  // ✅ SCROLL TO STRUCTURE WHEN UPDATED
  useEffect(() => {
    if (structureDisplayRef.current && structureUpdateTrigger > 0) {
      console.log('🔄 Structure updated, scrolling to display...');
      setTimeout(() => {
        structureDisplayRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        // Also scroll the tree container to top
        setTimeout(() => {
          const treeContainer = document.querySelector('.tree-structure-container');
          if (treeContainer) {
            treeContainer.scrollTop = 0;
          }
        }, 500);
      }, 300);
    }
  }, [structureUpdateTrigger]);

  // ✅ AUTO-FOCUS MAIN INPUT AFTER AI RESPONDS
  useEffect(() => {
    if (interviewState === 'active' && !loading && mainInputRef.current) {
      setTimeout(() => {
        mainInputRef.current.focus();
      }, 100);
    }
  }, [messages, loading, interviewState]);

  // ✅ AUTO-FOCUS FEEDBACK INPUT AFTER AI RESPONDS
  useEffect(() => {
    if (showFeedbackInput && !feedbackLoading && feedbackInputRef.current) {
      setTimeout(() => {
        feedbackInputRef.current.focus();
      }, 100);
    }
  }, [feedbackMessages, feedbackLoading, showFeedbackInput]);

  // ✅ PARSE STRUCTURE TEXT INTO TREE FORMAT
  const parseStructureToTree = (structureText) => {
    if (!structureText) return [];
    
    const lines = structureText.split('\n').filter(line => line.trim());
    const tree = [];
    
    lines.forEach(line => {
      // Skip headers and empty lines
      if (line.includes('**') || line.includes('#') || line.trim() === '') return;
      
      // Count indentation level
      const indent = line.search(/\S/);
      const cleanLine = line.trim();
      
      // Skip lines that don't look like folder/file names
      if (cleanLine.includes(':') && !cleanLine.includes('/')) return;
      
      // Determine if it's a folder (ends with / or contains subfolders)
      const isFolder = cleanLine.endsWith('/') || cleanLine.includes('Folder') || 
                      indent === 0 || cleanLine.match(/^[A-Z]/);
      
      tree.push({
        name: cleanLine.replace('/', '').replace('-', '').trim(),
        level: Math.floor(indent / 2),
        isFolder: isFolder,
        id: Math.random().toString(36).substr(2, 9)
      });
    });
    
    return tree;
  };

  // ✅ RENDER TREE STRUCTURE COMPONENT WITH BETTER SCROLLING
  const TreeStructure = ({ structureText }) => {
    const tree = parseStructureToTree(structureText);
    
    return (
      <div className="tree-structure-container">
        <div className="tree-structure">
          {tree.length > 0 ? (
            tree.map((item, index) => (
              <div 
                key={item.id} 
                className="tree-item"
                style={{ paddingLeft: `${item.level * 20}px` }}
              >
                <span className="tree-icon">
                  {item.isFolder ? '📁' : '📄'}
                </span>
                <span className={`tree-name ${item.isFolder ? 'folder' : 'file'}`}>
                  {item.name}
                </span>
              </div>
            ))
          ) : (
            <div className="tree-item">
              <span className="tree-icon">📄</span>
              <span className="tree-name">No structure available</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ✅ GENERATE UNIQUE CONVERSATION ID
  const generateConversationId = () => {
    return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const startInterview = async (topicId) => {
    // ✅ VALIDATE ENGINEER ALIAS FIRST
    if (!engineerAlias.trim()) {
      setError('Please enter your engineer alias before starting the interview.');
      return;
    }

    console.log('🎯 BUTTON CLICKED! Topic:', topicId);
    console.log('Engineer Alias:', engineerAlias);
    
    try {
      setLoading(true);
      setError('');
      
      // ✅ GENERATE NEW CONVERSATION ID
      const newConversationId = generateConversationId();
      setConversationId(newConversationId);
      setCurrentQuestionIndex(0);
      
      console.log('Starting interview for topic:', topicId);
      console.log('Conversation ID:', newConversationId);
      
      const response = await fetch('https://7vkjgwj4ek.execute-api.eu-west-2.amazonaws.com/prod/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: '',
          interviewMode: true,
          questionIndex: 0,
          conversationId: newConversationId,
          engineerId: engineerAlias.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Full response data:', data);

      let aiResponse;
      if (data.statusCode === 200) {
        const responseBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
        aiResponse = responseBody.response;
        setCurrentQuestion(responseBody.currentQuestion || aiResponse);
      } else {
        aiResponse = 'Error starting interview. Please try again.';
      }

      setMessages([{
        id: 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      }]);

      setCurrentTopic(topicId);
      setInterviewState('active');
      setInterviewActive(true);
      setInterviewComplete(false);

      console.log('✅ Interview started successfully!');

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
      
      const userMessage = {
        id: Date.now(),
        text: inputText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      const currentInput = inputText;
      setInputText('');

      const response = await fetch('https://7vkjgwj4ek.execute-api.eu-west-2.amazonaws.com/prod/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          interviewMode: true,
          questionIndex: currentQuestionIndex,
          conversationId: conversationId,
          previousQuestion: currentQuestion,
          engineerId: engineerAlias.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Full response data:', data);

      let aiResponse;
      let isInterviewComplete = false;
      
      if (data.statusCode === 200) {
        const responseBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
        aiResponse = responseBody.response;
        isInterviewComplete = responseBody.interviewComplete === true;
        
        setCurrentQuestionIndex(responseBody.questionIndex || currentQuestionIndex + 1);
        setCurrentQuestion(responseBody.currentQuestion || aiResponse);
      } else {
        aiResponse = 'Sorry, there was an error processing your response. Please try again.';
      }

      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
        isStructure: isInterviewComplete
      };
      
      setMessages(prev => [...prev, aiMessage]);

      // ✅ SET INITIAL STRUCTURE WHEN INTERVIEW COMPLETES
      if (isInterviewComplete) {
        console.log('🎉 Interview completed! Setting initial structure...');
        setCurrentStructure(aiResponse);
        setStructureUpdateTrigger(prev => prev + 1);
        
        setTimeout(() => {
          setInterviewComplete(true);
          setInterviewActive(false);
          setInterviewState('feedback');
        }, 100);
      }

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

  // ✅ NEW FEEDBACK CHAT FUNCTIONS
  const startFeedbackChat = () => {
    setShowFeedbackInput(true);
    setFeedbackMessages([{
      id: Date.now(),
      text: "I'd love to hear your thoughts on the structure! What specific changes would you like to see? Please be as detailed as possible.",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const sendFeedbackMessage = async () => {
    if (!feedbackInputText.trim()) return;

    try {
      setFeedbackLoading(true);
      
      const userMessage = {
        id: Date.now(),
        text: feedbackInputText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setFeedbackMessages(prev => [...prev, userMessage]);
      const currentInput = feedbackInputText;
      setFeedbackInputText('');

      // Simulate AI processing feedback
      setTimeout(async () => {
        const aiResponse = {
          id: Date.now() + 1,
          text: `Thank you for that feedback! I understand you'd like: "${currentInput}"\n\nLet me regenerate the structure with your suggestions. This will take a moment...`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        };
        
        setFeedbackMessages(prev => [...prev, aiResponse]);
        
        // Generate improved structure
        await generateImprovedStructure(currentInput);
      }, 1000);

    } catch (error) {
      console.error('Error sending feedback:', error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const generateImprovedStructure = async (feedbackText) => {
    try {
      console.log('🔄 Generating improved structure with feedback:', feedbackText);
      
      const response = await fetch('https://7vkjgwj4ek.execute-api.eu-west-2.amazonaws.com/prod/ask', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          message: `Please regenerate the folder structure based on this feedback: ${feedbackText}`,
          interviewMode: true,
          topic: currentTopic,
          engineerId: engineerAlias.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const responseBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
      
      console.log('✅ New structure generated:', responseBody.response);
      
      // ✅ UPDATE CURRENT STRUCTURE AND TRIGGER SCROLL
      setCurrentStructure(responseBody.response);
      setStructureUpdateTrigger(prev => prev + 1);

      // Add confirmation to feedback chat
      const confirmationMessage = {
        id: Date.now() + 4,
        text: "✅ Perfect! I've updated the structure based on your feedback. You can see the new version above. The page will scroll to show you the updated structure!",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setFeedbackMessages(prev => [...prev, confirmationMessage]);
      
    } catch (error) {
      console.error('Error generating improved structure:', error);
      const errorMessage = {
        id: Date.now() + 3,
        text: '❌ Sorry, there was an error generating the improved structure. Please try again.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setFeedbackMessages(prev => [...prev, errorMessage]);
    }
  };

  const provideFeedback = (type) => {
    if (type === 'approve') {
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
      startFeedbackChat();
    }
  };

  const saveFeedback = async (type, feedback) => {
    try {
      await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          inputText: `FEEDBACK:${type}:${feedback}`,
          interviewMode: true,
          topic: currentTopic,
          engineerId: engineerAlias.trim()
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

  const handleFeedbackKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendFeedbackMessage();
    }
  };

  // ✅ MANUAL SCROLL TO TOP FUNCTION
  const scrollToStructureTop = () => {
    console.log('📜 Manual scroll to structure top');
    
    // First scroll to the structure display
    if (structureDisplayRef.current) {
      structureDisplayRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    // Then scroll the tree container to top
    setTimeout(() => {
      const treeContainer = document.querySelector('.tree-structure-container');
      if (treeContainer) {
        treeContainer.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 500);
  };

  const resetInterview = () => {
    setInterviewState('start');
    setMessages([]);
    setInputText('');
    setCurrentTopic('');
    setShowFeedbackInput(false);
    setFeedbackText('');
    setStructureApproved(false);
    setFeedbackMessages([]);
    setFeedbackInputText('');
    setConversationId('');
    setCurrentQuestionIndex(0);
    setCurrentQuestion('');
    setCurrentStructure('');
    setStructureUpdateTrigger(0);
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

        <div className="engineer-info-section">
          <h3>👤 Engineer Information</h3>
          <div className="alias-input-container">
            <label htmlFor="engineerAlias">Your Amazon Alias:</label>
            <input
              id="engineerAlias"
              type="text"
              value={engineerAlias}
              onChange={(e) => setEngineerAlias(e.target.value)}
              placeholder="e.g., john.smith"
              className="alias-input"
              maxLength={50}
            />
            <div className="alias-help">
              💡 This helps us track responses and build consensus across engineers
            </div>
          </div>
          
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
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
                  className={`start-topic-btn ${!engineerAlias.trim() ? 'disabled' : ''}`}
                  onClick={() => startInterview(topic.id)}
                  disabled={!engineerAlias.trim()}
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
    console.log('🔍 Feedback screen - Current structure:', currentStructure);
    
    return (
      <div className="interview-feedback">
        <div className="feedback-header">
          <h2>🏗️ Generated File Structure</h2>
          <p>Based on your responses, here's the recommended organization</p>
        </div>

        {/* ✅ STRUCTURE DISPLAY USING CURRENT STRUCTURE STATE */}
        <div className="structure-display" ref={structureDisplayRef}>
          <div className="structure-content">
            <div className="structure-header">
              <h4>📋 Recommended Folder Structure</h4>
              <div className="structure-actions">
                <button 
                  className="scroll-structure-btn"
                  onClick={scrollToStructureTop}
                >
                  ⬆️ Scroll to Top
                </button>
                <button 
                  className="refresh-structure-btn"
                  onClick={() => {
                    console.log('🔄 Manual refresh structure');
                    setStructureUpdateTrigger(prev => prev + 1);
                  }}
                >
                  🔄 Refresh
                </button>
              </div>
            </div>
            <TreeStructure structureText={currentStructure || 'Loading structure...'} />
          </div>
        </div>

        {/* ✅ DEBUG INFO */}
        <div className="debug-info" style={{background: '#f0f0f0', padding: '10px', margin: '10px 0', fontSize: '12px', borderRadius: '4px'}}>
          <strong>🔧 DEBUG:</strong><br/>
          Current Structure Length: {currentStructure?.length || 0}<br/>
          Structure Update Trigger: {structureUpdateTrigger}<br/>
          Structure Preview: {currentStructure?.substring(0, 100) || 'No structure'}...
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

        {/* ✅ FEEDBACK CHAT INTERFACE */}
        {showFeedbackInput && (
          <div className="feedback-chat-section">
            <div className="feedback-chat-header">
              <h4>💬 Feedback Discussion</h4>
              <button 
                onClick={() => {
                  setShowFeedbackInput(false);
                  setFeedbackMessages([]);
                }}
                className="close-feedback-btn"
              >
                ❌ Close
              </button>
            </div>
            
            <div className="feedback-messages">
              {feedbackMessages.map(msg => (
                <div key={msg.id} className={`feedback-message ${msg.sender}`}>
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
              
              {feedbackLoading && (
                <div className="feedback-message ai loading">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="typing-text">AI is processing your feedback...</div>
                  </div>
                </div>
              )}
              
              <div ref={feedbackMessagesEndRef} />
            </div>

            <div className="feedback-input">
              <div className="input-container">
                <textarea
                  ref={feedbackInputRef}
                  value={feedbackInputText}
                  onChange={(e) => setFeedbackInputText(e.target.value)}
                  onKeyPress={handleFeedbackKeyPress}
                  placeholder="Describe the changes you'd like to see in detail..."
                  rows="3"
                  disabled={feedbackLoading}
                />
                <button 
                  onClick={sendFeedbackMessage}
                  disabled={!feedbackInputText.trim() || feedbackLoading}
                  className="send-feedback-btn"
                >
                  {feedbackLoading ? '⏳' : '📤'} Send
                </button>
              </div>
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
          <span className="engineer-info">👤 {engineerAlias}</span>
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
        
        <div ref={messagesEndRef} />
      </div>

      <div className="interview-input">
        <div className="input-container">
          <textarea
            ref={mainInputRef}
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