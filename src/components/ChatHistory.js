import React from 'react';

const ChatHistory = ({ messages }) => {
  return (
    <div className="chat-history">
      {messages.map((message, index) => (
        <div key={index} className={message.isUser ? 'user-message' : 'ai-message'}>
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;