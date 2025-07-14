import React, { useState } from 'react';
import { submitFeedback } from '../services/api';

const FeedbackForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    category: '',
    question: '',
    context: '',
    expectedAnswer: '',
    site: '',
    team: '',
    priority: 'medium',
    tags: '',
    engineerName: '',
    engineerEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const categories = [
    'Site Information',
    'Team Responsibilities', 
    'Document Types',
    'Procedures/SOPs',
    'Equipment/Hardware',
    'Safety Protocols',
    'Troubleshooting',
    'Project Information',
    'Other'
  ];

  const sites = [
    'LHR86', 'PDX', 'SEA', 'SIN', 'FRA', 'IAD', 'DUB', 'Other'
  ];

  const teams = [
    'DCEO', 'DCO', 'HWEng', 'InfraDelivery', 'Field Engineering', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const submissionData = {
        ...formData,
        timestamp: new Date().toISOString(),
        id: `feedback_${Date.now()}`,
        status: 'pending_review'
      };

      await submitFeedback(submissionData);
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          category: '', question: '', context: '', expectedAnswer: '',
          site: '', team: '', priority: 'medium', tags: '',
          engineerName: '', engineerEmail: ''
        });
        onSubmit && onSubmit(submissionData);
      }, 2000);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-form-overlay">
      <div className="feedback-form-container">
        <div className="feedback-form-header">
          <h2>🧠 Contribute to AI Knowledge Base</h2>
          <p>Help improve our AI assistant by sharing your expertise!</p>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="feedback-form">
          {/* Category Selection */}
          <div className="form-group">
            <label>📋 Category *</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category...</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Question/Scenario */}
          <div className="form-group">
            <label>❓ Question or Scenario *</label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              placeholder="What question should the AI be able to answer? (e.g., 'What team is responsible for LV switchgear maintenance at LHR86?')"
              rows="3"
              required
            />
          </div>

          {/* Context */}
          <div className="form-group">
            <label>📝 Context/Background</label>
            <textarea
              name="context"
              value={formData.context}
              onChange={handleInputChange}
              placeholder="Provide additional context that would help the AI understand when and how to use this information..."
              rows="3"
            />
          </div>

          {/* Expected Answer */}
          <div className="form-group">
            <label>✅ Expected Answer *</label>
            <textarea
              name="expectedAnswer"
              value={formData.expectedAnswer}
              onChange={handleInputChange}
              placeholder="What should the AI respond with? Be as detailed and accurate as possible..."
              rows="4"
              required
            />
          </div>

          {/* Site and Team */}
          <div className="form-row">
            <div className="form-group">
              <label>🏢 Related Site</label>
              <select name="site" value={formData.site} onChange={handleInputChange}>
                <option value="">Select site...</option>
                {sites.map(site => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>👥 Related Team</label>
              <select name="team" value={formData.team} onChange={handleInputChange}>
                <option value="">Select team...</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority and Tags */}
          <div className="form-row">
            <div className="form-group">
              <label>⚡ Priority</label>
              <select name="priority" value={formData.priority} onChange={handleInputChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label>🏷️ Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., electrical, safety, procedure"
              />
            </div>
          </div>

          {/* Engineer Information */}
          <div className="form-row">
            <div className="form-group">
              <label>👤 Your Name *</label>
              <input
                type="text"
                name="engineerName"
                value={formData.engineerName}
                onChange={handleInputChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label>📧 Your Email *</label>
              <input
                type="email"
                name="engineerEmail"
                value={formData.engineerEmail}
                onChange={handleInputChange}
                placeholder="your.email@amazon.com"
                required
              />
            </div>
          </div>

          {/* Submit Status */}
          {submitStatus === 'success' && (
            <div className="status-message success">
              ✅ Thank you! Your contribution has been submitted for review.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="status-message error">
              ❌ Error submitting feedback. Please try again.
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? '⏳ Submitting...' : '🚀 Submit Contribution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;