import React, { useState, useEffect } from 'react';
import { API } from 'aws-amplify';
import './KnowledgeCollection.css';

const KnowledgeCollection = () => {
  const [question, setQuestion] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'procedures', 'equipment', 'safety', 'maintenance'
  ];
  
  const [selectedCategory, setSelectedCategory] = useState('procedures');

  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await API.post('knowledgeAPI', '/questions', {
        body: { category: selectedCategory }
      });
      
      setQuestion(response);
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
      await API.post('knowledgeAPI', '/responses', {
        body: {
          questionId: question.questionId,
          timestamp: question.timestamp,
          response: response,
          engineerId: 'current-user-id' // Replace with actual user ID
        }
      });
      
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
  }, []);

  return (
    <div className="knowledge-collection">
      <div className="knowledge-header">
        <h2>🧠 Knowledge Collection</h2>
        <p>Help improve our AI by sharing your expertise!</p>
        
        <div className="category-selector">
          <label>Select Category:</label>
          <div className="category-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : submitted ? (
        <div className="success-message">
          <h3>Thank you for your contribution!</h3>
          <p>Your expertise helps improve our AI system.</p>
          <button onClick={fetchQuestion} className="next-question-btn">
            Answer Another Question
          </button>
        </div>
      ) : question ? (
        <div className="question-container">
          <div className="question-card">
            <div className="question-category">
              {question.category} &gt; {question.subcategory}
            </div>
            <div className="question-text">
              {question.question}
            </div>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Share your expert knowledge here..."
              rows={6}
              className="response-input"
            />
            <div className="action-buttons">
              <button onClick={fetchQuestion} className="skip-btn">
                Skip Question
              </button>
              <button 
                onClick={submitResponse} 
                disabled={!response.trim()}
                className="submit-btn"
              >
                Submit Response
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