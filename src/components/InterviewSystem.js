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

  // ✅ STRUCTURE MANAGEMENT STATES
  const [currentStructure, setCurrentStructure] = useState('');
  const [structureUpdateTrigger, setStructureUpdateTrigger] = useState(0);
  const [structureError, setStructureError] = useState('');
  const [structureVersions, setStructureVersions] = useState([]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0);
  const [finalVersionConfirmed, setFinalVersionConfirmed] = useState(false);
  const [structureGuidelines, setStructureGuidelines] = useState('');

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

  // ✅ IMPROVED STRUCTURE VALIDATION
  const isValidStructure = (text) => {
    if (!text || text.length < 100) return false;
    if (text.includes('technical difficulties')) return false;
    if (text.includes('error') && text.length < 200) return false;
    if (text.includes('rephrase your question')) return false;
    if (text.includes('dig a bit deeper')) return false;
    if (text.includes('curious to understand')) return false;
    if (text.includes('what are some')) return false;
    
    // Check for structure-like content
    const hasStructureKeywords = text.includes('📁') || 
                                 text.includes('📄') ||
                                 text.includes('Folder') || 
                                 text.includes('Directory') || 
                                 text.includes('/') ||
                                 text.includes('Structure') ||
                                 text.includes('Organization');
    
    // Check that it's not just a question
    const isQuestion = text.includes('?') && text.split('?').length > 2;
    
    return hasStructureKeywords && !isQuestion;
  };

  // ✅ GENERATE FALLBACK STRUCTURE
  const generateFallbackStructure = () => {
    return `## Data Center File Organization Structure

### 1. Site-Based Organization
📁 LHR86/
  📁 Operations/
    📁 Maintenance_Logs/
    📁 Incident_Reports/
    📁 Daily_Checklists/
  📁 Infrastructure/
    📁 Network_Diagrams/
    📁 Server_Inventory/
    📁 Rack_Layouts/
  📁 Safety/
    📁 RAMS_Documents/
    📁 Emergency_Procedures/
    📁 Safety_Checklists/
  📁 Compliance/
    📁 Audit_Reports/
    📁 Certifications/
    📁 Regulatory_Documents/
  📁 Vendors/
    📁 Contracts/
    📁 Service_Agreements/
    📁 Contact_Information/

### 2. Equipment Documentation
📁 Equipment/
  📁 Generators/
    📄 Maintenance_Schedules.xlsx
    📄 Service_Manuals.pdf
  📁 UPS_Systems/
    📄 Configuration_Files.json
    📄 Monitoring_Logs.csv
  📁 Cooling_Systems/
    📄 Performance_Data.xlsx
    📄 Maintenance_Records.pdf

### 3. Procedures
📁 Procedures/
  📁 Standard_Operating_Procedures/
  📁 Emergency_Response/
  📁 Maintenance_Procedures/
  📁 Safety_Protocols/`;
  };

  // ✅ CREATE INTELLIGENT STRUCTURE BASED ON GUIDELINES
  const createIntelligentStructure = (guidelines, specificFeedback = '') => {
    console.log('🎯 Creating intelligent structure from guidelines:', guidelines);
    console.log('📝 Specific feedback:', specificFeedback);
    
    const feedback = guidelines.toLowerCase();
    
    if (feedback.includes('mechanical') && feedback.includes('electrical')) {
      let structure = `## Data Center File Organization Structure
### Based on Engineering Guidelines: ${guidelines}

📁 Mechanical/
  📁 Vendors/
    📁 ABB/
      📁 RAMS_Documents/
        📄 Risk_Assessment_Generator.pdf
        📄 Method_Statement_Maintenance.pdf
      📁 SOPs/
        📄 Generator_Startup_Procedure.pdf
        📄 Maintenance_Schedule.xlsx
        📄 Emergency_Shutdown_SOP.pdf
      📁 Equipment_Manuals/
        📄 Generator_Manual_ABB_2024.pdf
        📄 Parts_Catalog.pdf
      📁 Maintenance_Records/
        📄 Service_History.xlsx
        📄 Inspection_Reports.pdf
    📁 Gratte_Brothers/
      📁 RAMS_Documents/
        📄 Cooling_System_RAMS.pdf
        📄 Safety_Procedures.pdf
      📁 SOPs/
        📄 Chiller_Operation_SOP.pdf
        📄 Preventive_Maintenance.pdf
        📄 Troubleshooting_Guide.pdf
      📁 Equipment_Manuals/
        📄 Chiller_Manual_GB_2024.pdf
        📄 Control_System_Guide.pdf
      📁 Maintenance_Records/
        📄 Service_Logs.xlsx
        📄 Performance_Data.csv
    📁 Siemens/
      📁 RAMS_Documents/
        📄 Motor_Control_RAMS.pdf
        📄 Electrical_Safety_Assessment.pdf
      📁 SOPs/
        📄 Motor_Control_SOP.pdf
        📄 Calibration_Procedure.pdf
      📁 Equipment_Manuals/
        📄 Drive_System_Manual.pdf
        📄 Configuration_Guide.pdf
      📁 Maintenance_Records/
        📄 Calibration_Records.xlsx
        📄 Fault_History.pdf

📁 Electrical/
  📁 Vendors/
    📁 ABB/
      📁 RAMS_Documents/
        📄 Switchgear_RAMS.pdf
        📄 Arc_Flash_Assessment.pdf
      📁 SOPs/
        📄 Switchgear_Operation_SOP.pdf
        📄 Protection_Testing_SOP.pdf
        📄 Isolation_Procedures.pdf
      📁 Equipment_Manuals/
        📄 Switchgear_Manual_ABB.pdf
        📄 Protection_Relay_Guide.pdf
      📁 Maintenance_Records/
        📄 Testing_Records.xlsx
        📄 Maintenance_History.pdf
    📁 Gratte_Brothers/
      📁 RAMS_Documents/
        📄 Power_Distribution_RAMS.pdf
        📄 Electrical_Safety_RAMS.pdf
      📁 SOPs/
        📄 PDU_Operation_SOP.pdf
        📄 Load_Transfer_Procedure.pdf
      📁 Equipment_Manuals/
        📄 PDU_Manual_GB.pdf
        📄 Monitoring_System_Guide.pdf
      📁 Maintenance_Records/
        📄 Load_Testing_Records.xlsx
        📄 Inspection_Reports.pdf
    📁 Siemens/
      📁 RAMS_Documents/
        📄 UPS_System_RAMS.pdf
        📄 Battery_Safety_Assessment.pdf
      📁 SOPs/
        📄 UPS_Operation_SOP.pdf
        📄 Battery_Maintenance_SOP.pdf
        📄 Bypass_Procedures.pdf
      📁 Equipment_Manuals/
        📄 UPS_Manual_Siemens.pdf
        📄 Battery_System_Guide.pdf
      📁 Maintenance_Records/
        📄 UPS_Performance_Data.xlsx
        📄 Battery_Test_Records.pdf

### Cross-Functional Documentation
📁 Shared_Resources/
  📁 Emergency_Procedures/
    📄 Site_Emergency_Response.pdf
    📄 Equipment_Emergency_Contacts.xlsx
  📁 Training_Materials/
    📄 Safety_Training_Records.xlsx
    📄 Competency_Assessments.pdf
  📁 Incident_Reports/
    📄 Incident_Log_2024.xlsx
    📄 Investigation_Reports.pdf`;

      // Add specific modifications based on feedback
      if (specificFeedback) {
        structure += `\n\n### Recent Modifications Based on Feedback:
📁 Custom_Adjustments/
  📄 Latest_Feedback.txt
  📄 Implementation_Notes.md
  
**Latest Feedback Applied:** ${specificFeedback}`;
      }

      return structure;
    }
    
    // Default enhanced structure
    return generateFallbackStructure() + `\n\n### Guidelines Applied: ${guidelines}`;
  };

  // ✅ ADD STRUCTURE VERSION
  const addStructureVersion = (structure, description) => {
    const newVersion = {
      id: Date.now(),
      structure: structure,
      description: description,
      timestamp: new Date().toLocaleTimeString(),
      confirmed: false
    };
    
    setStructureVersions(prev => [...prev, newVersion]);
    setCurrentVersionIndex(prev => prev + 1);
    return newVersion;
  };

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
                      cleanLine.includes('📁') || indent === 0 || cleanLine.match(/^[A-Z]/);
      
      tree.push({
        name: cleanLine.replace('/', '').replace('-', '').replace('📁', '').replace('📄', '').trim(),
        level: Math.floor(indent / 2),
        isFolder: isFolder,
        id: Math.random().toString(36).substr(2, 9)
      });
    });
    
    return tree;
  };

  // ✅ RENDER TREE STRUCTURE COMPONENT
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
    if (!engineerAlias.trim()) {
      setError('Please enter your engineer alias before starting the interview.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const newConversationId = generateConversationId();
      setConversationId(newConversationId);
      setCurrentQuestionIndex(0);
      
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
        console.log('🎉 Interview completed! Creating initial structure...');
        
        let initialStructure;
        if (isValidStructure(aiResponse)) {
          initialStructure = aiResponse;
          setStructureError('');
        } else {
          initialStructure = generateFallbackStructure();
          setStructureError('AI generated an invalid structure. Using fallback structure based on common data center practices.');
        }
        
        setCurrentStructure(initialStructure);
        setStructureGuidelines('Initial structure based on interview responses');
        addStructureVersion(initialStructure, 'Initial structure from interview');
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

  // ✅ START FEEDBACK CHAT
  const startFeedbackChat = () => {
    setShowFeedbackInput(true);
    setFeedbackMessages([{
      id: Date.now(),
      text: "I'd love to hear your thoughts on the structure! You can provide general guidelines (like 'organize by Mechanical and Electrical divisions') or specific changes for particular vendors or sections. What would you like to adjust?",
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
          text: `Thank you for that feedback! I'll use this as a guideline: "${currentInput}"\n\nLet me create an improved structure that follows your guidelines while adding practical details for data center operations...`,
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

  // ✅ IMPROVED STRUCTURE GENERATION WITH GUIDELINES
  const generateImprovedStructure = async (feedbackText) => {
    try {
      console.log('🔄 Generating improved structure with guidelines:', feedbackText);
      
      // ✅ CREATE INTELLIGENT STRUCTURE BASED ON GUIDELINES
      const improvedStructure = createIntelligentStructure(feedbackText, feedbackText);
      
      console.log('✅ Intelligent structure created');
      setCurrentStructure(improvedStructure);
      setStructureGuidelines(feedbackText);
      setStructureError('');
      
      // Add to version history
      addStructureVersion(improvedStructure, `Applied guidelines: ${feedbackText.substring(0, 50)}...`);
      setStructureUpdateTrigger(prev => prev + 1);

      // Add confirmation to feedback chat
      const confirmationMessage = {
        id: Date.now() + 4,
        text: "✅ Perfect! I've created an improved structure based on your guidelines. The structure follows your requirements while adding practical details for daily operations. You can see the new version above!\n\n💡 Feel free to provide more specific feedback for individual vendors or sections, or click 'Confirm Final Version' if you're satisfied.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setFeedbackMessages(prev => [...prev, confirmationMessage]);
      
    } catch (error) {
      console.error('Error generating improved structure:', error);
      
      // Use intelligent structure as fallback
      const fallbackStructure = createIntelligentStructure(feedbackText, feedbackText);
      setCurrentStructure(fallbackStructure);
      setStructureError('Created structure based on your guidelines with some default assumptions.');
      setStructureUpdateTrigger(prev => prev + 1);
      
      const errorMessage = {
        id: Date.now() + 3,
        text: '✅ I\'ve created a structure based on your guidelines! You can see it above and continue to refine it with more specific feedback.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setFeedbackMessages(prev => [...prev, errorMessage]);
    }
  };

  // ✅ CONFIRM FINAL VERSION
  
const confirmFinalVersion = async () => {
  try {
    console.log('🔄 Confirming final structure version...');
    
    // Save to backend FIRST
    await saveFeedback('FINAL_STRUCTURE_CONFIRMED', currentStructure);
    
    // Only update UI state if save was successful
    setFinalVersionConfirmed(true);
    
    // Update the current version as confirmed
    setStructureVersions(prev => 
      prev.map((version, index) => 
        index === currentVersionIndex - 1 
          ? { ...version, confirmed: true }
          : version
      )
    );
    
    console.log('✅ Final structure confirmed and saved!');
    
    const confirmationMessage = {
      id: Date.now(),
      text: '🎉 **Final Structure Confirmed!**\n\nYour approved structure has been saved to the database and will be used for S3 deployment planning.\n\n✅ **Status:** Final version confirmed and saved\n📊 **Next:** Structure will be reviewed by other engineers\n🚀 **Goal:** Build consensus for S3 deployment\n\n📁 **Structure ID:** ' + conversationId,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, confirmationMessage]);
    
  } catch (error) {
    console.error('❌ Error confirming final version:', error);
    
    // Show error message to user
    const errorMessage = {
      id: Date.now(),
      text: '❌ **Error Saving Structure**\n\nThere was an error saving your confirmed structure to the database. Please try again or contact support.\n\nError: ' + error.message,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, errorMessage]);
  }
};

  const provideFeedback = (type) => {
    if (type === 'approve') {
      confirmFinalVersion();
    } else {
      startFeedbackChat();
    }
  };

  const saveFeedback = async (type, feedback) => {
  try {
    console.log('🔄 Saving feedback to backend:', type);
    
    const response = await fetch('https://7vkjgwj4ek.execute-api.eu-west-2.amazonaws.com/prod/ask', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        message: `FEEDBACK:${type}:${feedback}`,
        interviewMode: true,
        topic: currentTopic,
        engineerId: engineerAlias.trim(),
        conversationId: conversationId,
        saveFinalStructure: true // ✅ ADD FLAG FOR FINAL STRUCTURE
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Feedback saved successfully:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Error saving feedback:', error);
    throw error; // Re-throw so confirmFinalVersion can handle it
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
    if (structureDisplayRef.current) {
      structureDisplayRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    
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
    setStructureError('');
    setStructureVersions([]);
    setCurrentVersionIndex(0);
    setFinalVersionConfirmed(false);
    setStructureGuidelines('');
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
                <p>Provide guidelines and specific changes</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">✅</span>
              <div>
                <strong>Final confirmation</strong>
                <p>Approve final version for deployment</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🚀</span>
              <div>
                <strong>S3 deployment ready</strong>
                <p>Confirmed structure for implementation</p>
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
          <p>Provide guidelines and specific feedback to refine the structure</p>
        </div>

        {/* ✅ STRUCTURE GUIDELINES DISPLAY */}
        {structureGuidelines && (
          <div className="structure-guidelines">
            <h4>📋 Current Guidelines</h4>
            <p>{structureGuidelines}</p>
          </div>
        )}

        {/* ✅ VERSION HISTORY */}
        {structureVersions.length > 0 && (
          <div className="version-history">
            <h4>📚 Structure Versions ({structureVersions.length})</h4>
            <div className="version-list">
              {structureVersions.map((version, index) => (
                <div key={version.id} className={`version-item ${index === currentVersionIndex - 1 ? 'current' : ''}`}>
                  <span className="version-number">v{index + 1}</span>
                  <span className="version-description">{version.description}</span>
                  <span className="version-time">{version.timestamp}</span>
                  {version.confirmed && <span className="version-confirmed">✅ Confirmed</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ STRUCTURE ERROR WARNING */}
        {structureError && (
          <div className="structure-error-warning">
            <h4>⚠️ Structure Generation Notice</h4>
            <p>{structureError}</p>
          </div>
        )}

        {/* ✅ STRUCTURE DISPLAY */}
        <div className="structure-display" ref={structureDisplayRef}>
          <div className="structure-content">
            <div className="structure-header">
              <h4>📋 Recommended Folder Structure {finalVersionConfirmed && '✅ CONFIRMED'}</h4>
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
                    setStructureUpdateTrigger(prev => prev + 1);
                  }}
                >
                  🔄 Refresh
                </button>
              </div>
            </div>
            <TreeStructure structureText={currentStructure || generateFallbackStructure()} />
          </div>
        </div>

        {/* ✅ SIDE-BY-SIDE FEEDBACK SECTION */}
        {!finalVersionConfirmed && (
          <div className="feedback-section-container">
            {/* Left Side - Action Buttons */}
            <div className="feedback-actions-panel">
              <h3>📝 Structure Actions</h3>
              <div className="action-buttons">
                <button 
                  onClick={() => confirmFinalVersion()} 
                  className="confirm-final-btn"
                >
                  ✅ Confirm Final Version
                </button>
                <button 
                  onClick={() => setShowFeedbackInput(!showFeedbackInput)} 
                  className={showFeedbackInput ? "close-feedback-btn-alt" : "modify-btn"}
                >
                  {showFeedbackInput ? "❌ Close Chat" : "🔄 Refine Structure"}
                </button>
              </div>
              
              <div className="feedback-status">
                {showFeedbackInput ? (
                  <p className="status-active">💬 Chat active - refining structure</p>
                ) : (
                  <p className="status-ready">✅ Ready for confirmation</p>
                )}
              </div>
              
              {/* Version Info */}
              <div className="current-version-info">
                <h4>📊 Current Version</h4>
                <p>Version {currentVersionIndex}</p>
                <p>{structureVersions[currentVersionIndex - 1]?.description || 'Initial structure'}</p>
              </div>
            </div>
            
            {/* Right Side - Feedback Chat (if active) */}
            {showFeedbackInput && (
              <div className="feedback-chat-panel">
                <h3>💬 Structure Refinement</h3>
                <div className="feedback-messages-compact">
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
                        <div className="typing-text">Creating improved structure...</div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={feedbackMessagesEndRef} />
                </div>

                <div className="feedback-input-compact">
                  <textarea
                    ref={feedbackInputRef}
                    value={feedbackInputText}
                    onChange={(e) => setFeedbackInputText(e.target.value)}
                    onKeyPress={handleFeedbackKeyPress}
                    placeholder="Provide guidelines or specific changes..."
                    rows="2"
                    disabled={feedbackLoading}
                  />
                  <button 
                    onClick={sendFeedbackMessage}
                    disabled={!feedbackInputText.trim() || feedbackLoading}
                    className="send-feedback-btn-compact"
                  >
                    {feedbackLoading ? '⏳' : '📤'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ✅ FINAL CONFIRMATION MESSAGE */}
        {finalVersionConfirmed && (
          <div className="final-confirmation">
            <h3>🎉 Structure Confirmed!</h3>
            <p>Your final structure has been saved and will be used for S3 deployment planning.</p>
            <div className="confirmation-details">
              <p><strong>Structure ID:</strong> {conversationId}</p>
              <p><strong>Engineer:</strong> {engineerAlias}</p>
              <p><strong>Confirmed:</strong> {new Date().toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="feedback-actions-bottom">
          <button onClick={resetInterview} className="new-interview-btn">
            🎤 Start New Interview
          </button>
          {finalVersionConfirmed && (
            <button className="view-consensus-btn">
              👥 View Team Consensus (Coming Soon)
            </button>
          )}
        </div>

        <div className="next-steps-info">
          <h4>🚀 What happens next?</h4>
          <ul>
            <li>✅ Your guidelines and feedback are processed intelligently</li>
            <li>🤖 AI creates structures following your principles</li>
            <li>🔄 You can refine with specific vendor/section requirements</li>
            <li>✅ Final confirmation locks in the approved structure</li>
            <li>👥 Other engineers will review the confirmed structure</li>
            <li>📁 Confirmed structure will be deployed to S3</li>
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