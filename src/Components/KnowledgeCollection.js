import React, { useState } from 'react';
import './KnowledgeCollection.css';

const KnowledgeCollection = () => {
  const [selectedCategory, setSelectedCategory] = useState('procedures');
  const [response, setResponse] = useState('');

  const categories = ['procedures', 'equipment', 'safety', 'maintenance'];

  const mockQuestion = `What are the key safety procedures for ${selectedCategory} in the data center?`;

  const handleSubmit = () => {
    if (response.trim()) {
      alert('Thank you for your contribution!');
      setResponse('');
    }
  };

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

      <div className="question-container">
        <div className="question-card">
          <div className="question-category">
            {selectedCategory}
          </div>
          <div className="question-text">
            {mockQuestion}
          </div>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Share your expert knowledge here..."
            rows={6}
            className="response-input"
          />
          <div className="action-buttons">
            <button onClick={handleSubmit} disabled={!response.trim()} className="submit-btn">
              Submit Response
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeCollection;