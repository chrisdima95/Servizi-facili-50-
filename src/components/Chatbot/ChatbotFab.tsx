// src/components/Chatbot/ChatbotFab.tsx
import React from 'react';
import '../../styles/Chatbot.css';

interface ChatbotFabProps {
  isOpen: boolean;
  onClick: () => void;
  hasNewMessage?: boolean;
}

const ChatbotFab: React.FC<ChatbotFabProps> = ({ 
  isOpen, 
  onClick, 
  hasNewMessage = false 
}) => {
  return (
    <button
      className={`chatbot-fab ${isOpen ? 'open' : ''} ${hasNewMessage ? 'has-notification' : ''}`}
      onClick={onClick}
      aria-label={isOpen ? 'Chiudi assistente' : 'Apri assistente digitale'}
      aria-expanded={isOpen}
      type="button"
    >
      <div className="chatbot-fab-icon">
        {isOpen ? (
          // Icona X per chiudere
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M18 6L6 18M6 6L18 18" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          // Icona chatbot
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        )}
      </div>
      
      {hasNewMessage && !isOpen && (
        <div className="chatbot-notification-dot" aria-hidden="true" />
      )}
      
      {/* Tooltip */}
      <div className="chatbot-fab-tooltip">
        {isOpen ? 'Chiudi assistente' : 'Assistente digitale'}
      </div>
    </button>
  );
};

export default ChatbotFab;
