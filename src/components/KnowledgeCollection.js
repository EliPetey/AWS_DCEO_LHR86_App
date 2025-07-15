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
  const API_BASE_URL = 'https://8nr14rqyqa.execute-api.eu-west-2.amazonaws.com/prod';

  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);
    
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
      
      const data = await response.json();
      setQuestion(data);
      setResponse('');
      setSubmitted(false);
      
    } catch (err) {
      console.error('Error fetching question:', err);
      setError('Failed to load question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async () => {
  if (!response.trim() || !question) return;
  
  setLoading(true);
  setError(null);
  
  try {
    console.log('Submitting response with data:', {
      questionId: question.questionId,
      timestamp: question.timestamp,
      response: response,
      engineerId: 'current-user'
    });
    
    const submitResponse = await fetch(`${API_BASE_URL}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId: question.questionId,
        timestamp: question.timestamp,
        response: response,
        engineerId: 'current-user'
      })
    });
    
    console.log('Response status:', submitResponse.status);
    
    if (!submitResponse.ok) {
      const errorData = await submitResponse.json();
      console.error('Error response:', errorData);
      throw new Error(`HTTP error! status: ${submitResponse.status}`);
    }
    
    const result = await submitResponse.json();
    console.log('Success response:', result);
    setSubmitted(true);
    
  } catch (err) {
    console.error('Error submitting response:', err);
    setError('Failed to submit response. Please try again.');
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