import { API } from 'aws-amplify';

// Submit feedback to DynamoDB via API Gateway
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await API.post('knowledgebaseAPI', '/feedback', {
      body: feedbackData
    });
    return response;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

// Get all feedback entries (for admin dashboard)
export const getFeedbackEntries = async () => {
  try {
    const response = await API.get('knowledgebaseAPI', '/feedback');
    return response;
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
};

// Update feedback status (approve/reject)
export const updateFeedbackStatus = async (id, status, adminNotes = '') => {
  try {
    const response = await API.put('knowledgebaseAPI', `/feedback/${id}`, {
      body: { status, adminNotes, updatedAt: new Date().toISOString() }
    });
    return response;
  } catch (error) {
    console.error('Error updating feedback status:', error);
    throw error;
  }
};

// Query knowledge base for AI responses
export const queryKnowledgeBase = async (query, context = {}) => {
  try {
    const response = await API.post('knowledgebaseAPI', '/query', {
      body: { query, context }
    });
    return response;
  } catch (error) {
    console.error('Error querying knowledge base:', error);
    throw error;
  }
};