import React, { useState, useEffect } from 'react';
import './KnowledgeCollection.css';

const KnowledgeCollection = () => {
  const [question, setQuestion] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('procedures');

  const categories = ['procedures', 'equipment', 'safety', 'maintenance'];
  
  // Your API URL
  const API_BASE_URL = 'https://dwwlkt4c5c.execute-api.eu-west-2.amazonaws.com/prod';

  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);
    setSubmitted(false);
  
  try {
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: selectedCategory
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rawData = await response.json();
    console.log('Raw API response:', rawData);
    
    // Check if we got a Lambda response format
    let data;
    if (rawData.statusCode && rawData.body) {
      // Parse the body string to get actual data
      if (typeof rawData.body === 'string') {
        data = JSON.parse(rawData.body);
      } else {
        data = rawData.body;
      }
    } else {
      // Direct response format
      data = rawData;
    }
    
    console.log('Parsed question data:', data);
    console.log('Question ID:', data.questionId);
    console.log('Timestamp:', data.timestamp);
    console.log('Question text:', data.question);
    
    // Validate the parsed data
    if (!data.questionId || !data.timestamp || !data.question) {
      console.error('Missing required fields in question data:', {
        hasQuestionId: !!data.questionId,
        hasTimestamp: !!data.timestamp,
        hasQuestion: !!data.question,
        actualData: data
      });
      throw new Error('Invalid question data received from server');
    }
    
    setQuestion(data);
    setResponse('');
    
  } catch (err) {
    console.error('Error fetching question:', err);
    setError('Failed to load question. Please try again.');
    setQuestion(null);
  } finally {
    setLoading(false);
  }
};

  const submitResponse = async () => {
  // Validate response input
  if (!response.trim()) {
    setError('Please enter a response before submitting.');
    return;
  }
  
  // Validate question exists
  if (!question) {
    setError('No question loaded. Please refresh and try again.');
    return;
  }
  
  // Validate required question fields
  if (!question.questionId || !question.timestamp) {
    console.error('Missing question data:', question);
    setError('Question data is incomplete. Please refresh and try again.');
    return;
  }
  
  setLoading(true);
  setError(null);
  
  try {
    const requestData = {
      questionId: question.questionId,
      timestamp: question.timestamp,
      response: response.trim(),
      engineerId: 'current-user'
    };
    
    console.log('Submitting response with data:', requestData);
    
    const submitResponse = await fetch(`${API_BASE_URL}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });
    
    console.log('Response status:', submitResponse.status);
    
    if (!submitResponse.ok) {
      const errorData = await submitResponse.json();
      console.error('Error response:', errorData);
      throw new Error(`HTTP error! status: ${submitResponse.status} - ${errorData.error || 'Unknown error'}`);
    }
    
    const rawResult = await submitResponse.json();
    console.log('Raw submit response:', rawResult);
    
    // Parse response similar to fetchQuestion
    let result;
    if (rawResult.statusCode && rawResult.body) {
      if (typeof rawResult.body === 'string') {
        result = JSON.parse(rawResult.body);
      } else {
        result = rawResult.body;
      }
    } else {
      result = rawResult;
    }
    
    console.log('Parsed submit response:', result);
    setSubmitted(true);
    setResponse(''); // Clear the response field
    
  } catch (err) {
    console.error('Error submitting response:', err);
    setError(`Failed to submit response: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchQuestion();
  }, [selectedCategory]);

  return (
    <div className="knowledge-collection">
      <div className="knowledge-header">
        <h2>🧠 Knowledge Collection</h2>
        <p>Help improve our AI by sharing your DCEO expertise!</p>
        
        <div className="category-selector">
          <label>Select Category:</label>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
                disabled={loading}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : submitted ? (
        <div className="success-message">
          <h3>✅ Thank you for your contribution!</h3>
          <p>Your expertise helps improve our AI system for DCEO operations.</p>
          <button onClick={fetchQuestion} className="next-question-btn">
            Answer Another Question
          </button>
        </div>
      ) : question ? (
        <div className="question-container">
          <div className="question-card">
            <div className="question-category">
              📋 {question.category} &gt; {question.subcategory}
            </div>
            <div className="question-text">
              {question.question}
            </div>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Share your expert knowledge and experience here... Include specific procedures, safety considerations, best practices, and any relevant details that would help other engineers."
              rows={8}
              className="response-input"
            />
            <div className="action-buttons">
              <button onClick={fetchQuestion} className="skip-btn">
                Skip Question
              </button>
              <button 
                onClick={submitResponse} 
                disabled={!response.trim() || loading}
                className="submit-btn"
              >
                {loading ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-question">
          <p>No question available. Please try again.</p>
          <button onClick={fetchQuestion} className="retry-btn">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default KnowledgeCollection;