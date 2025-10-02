// src/components/Chatbot/ChatbotMessage.tsx
import React from 'react';
import type { ChatMessage } from '../../types/chatbot-types';

interface ChatbotMessageProps {
  message: ChatMessage;
  onQuickReply: (reply: string) => void;
}

const ChatbotMessage: React.FC<ChatbotMessageProps> = ({ message, onQuickReply }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessageText = (text: string) => {
    // Supporta markdown semplice per grassetto
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  return (
    <div className={`chatbot-message ${message.type}`}>
      {message.type === 'bot' && (
        <div className="chatbot-message-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V7C3 8.1 3.9 9 5 9H8V11C8 12.1 8.9 13 10 13H14C15.1 13 16 12.1 16 11V9H21ZM7 11V9H5V7H19V9H17V11H7Z" 
              fill="currentColor"
            />
            <circle cx="9" cy="15" r="1" fill="currentColor"/>
            <circle cx="15" cy="15" r="1" fill="currentColor"/>
            <path 
              d="M12 17C13.1 17 14 16.1 14 15H10C10 16.1 10.9 17 12 17Z" 
              fill="currentColor"
            />
          </svg>
        </div>
      )}
      
      <div className="chatbot-message-content">
        <div 
          className="chatbot-message-text"
          dangerouslySetInnerHTML={{ __html: formatMessageText(message.text) }}
        />
        
        {message.quickReplies && message.quickReplies.length > 0 && (
          <div className="chatbot-quick-replies">
            {message.quickReplies.map((reply, index) => (
              <button
                key={index}
                className="chatbot-quick-reply-btn"
                onClick={() => onQuickReply(reply)}
                type="button"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
        
        <div className="chatbot-message-time">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatbotMessage;
