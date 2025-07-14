import React from 'react';

const MessageBubble = ({ message }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`message-bubble ${message.sender}`}>
      <div className="message-content">
        {message.file && (
          <div className="file-attachment">
            📎 {message.file.name}
          </div>
        )}
        <div className="message-text">
          {message.text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < message.text.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="message-timestamp">
        {formatTimestamp(message.timestamp)}
      </div>
    </div>
  );
};

export default MessageBubble;