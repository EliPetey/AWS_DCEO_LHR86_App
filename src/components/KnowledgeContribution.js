import React, { useState } from 'react';
import FeedbackForm from './FeedbackForm';

const KnowledgeContribution = () => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [contributions, setContributions] = useState([]);

  const handleFeedbackSubmit = (feedbackData) => {
    setContributions(prev => [feedbackData, ...prev]);
    setShowFeedbackForm(false);
  };

  const contributionTypes = [
    {
      icon: '📋',
      title: 'Procedures & SOPs',
      description: 'Share knowledge about standard operating procedures, maintenance protocols, and safety guidelines.',
      examples: ['Rack installation procedures', 'Emergency shutdown protocols', 'Safety lockout procedures']
    },
    {
      icon: '🏢',
      title: 'Site Information',
      description: 'Contribute site-specific information, layouts, and operational details.',
      examples: ['Site contact information', 'Facility layouts', 'Local procedures']
    },
    {
      icon: '👥',
      title: 'Team Responsibilities',
      description: 'Define team roles, responsibilities, and escalation procedures.',
      examples: ['Who handles electrical issues', 'Emergency contacts', 'Approval workflows']
    },
    {
      icon: '🔧',
      title: 'Equipment & Hardware',
      description: 'Share technical specifications, troubleshooting guides, and maintenance information.',
      examples: ['Server specifications', 'Troubleshooting steps', 'Replacement procedures']
    }
  ];

  return (
    <div className="knowledge-contribution">
      <div className="contribution-header">
        <h2>🧠 Build Our AI Knowledge Base</h2>
        <p>Help create a smarter AI assistant by contributing your engineering expertise!</p>
      </div>

      <div className="contribution-stats">
        <div className="stat-card">
          <div className="stat-number">247</div>
          <div className="stat-label">Total Contributions</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">89</div>
          <div className="stat-label">Active Contributors</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">156</div>
          <div className="stat-label">Approved Entries</div>
        </div>
      </div>

      <div className="contribution-types">
        <h3>What can you contribute?</h3>
        <div className="types-grid">
          {contributionTypes.map((type, index) => (
            <div key={index} className="type-card">
              <div className="type-icon">{type.icon}</div>
              <h4>{type.title}</h4>
              <p>{type.description}</p>
              <div className="examples">
                <strong>Examples:</strong>
                <ul>
                  {type.examples.map((example, i) => (
                    <li key={i}>{example}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="contribution-action">
        <button 
          className="contribute-btn"
          onClick={() => setShowFeedbackForm(true)}
        >
          🚀 Start Contributing
        </button>
      </div>

      <div className="recent-contributions">
        <h3>Recent Contributions</h3>
        {contributions.length > 0 ? (
          <div className="contributions-list">
            {contributions.slice(0, 5).map((contrib, index) => (
              <div key={index} className="contribution-item">
                <div className="contrib-header">
                  <span className="contrib-category">{contrib.category}</span>
                  <span className="contrib-status">Pending Review</span>
                </div>
                <div className="contrib-question">{contrib.question}</div>
                <div className="contrib-meta">
                  By {contrib.engineerName} • {new Date(contrib.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-contributions">
            <p>No contributions yet. Be the first to help build our knowledge base!</p>
          </div>
        )}
      </div>

      {showFeedbackForm && (
        <FeedbackForm 
          onClose={() => setShowFeedbackForm(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
};

export default KnowledgeContribution;