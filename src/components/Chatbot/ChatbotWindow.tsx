// src/components/Chatbot/ChatbotWindow.tsx
import React, { useRef, useEffect } from 'react';
import ChatbotMessage from './ChatbotMessage';
import ChatbotInput from './ChatbotInput';
import type { ChatMessage } from '../../types/chatbot-types';
import '../../styles/Chatbot.css';

interface ChatbotWindowProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  onQuickReply: (reply: string) => void;
  onClose: () => void;
  onClear: () => void;
}

const ChatbotWindow: React.FC<ChatbotWindowProps> = ({
  messages,
  isTyping,
  onSendMessage,
  onQuickReply,
  onClose,
  onClear
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ai nuovi messaggi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages, isTyping]);

  // Gestione tasti per accessibilità
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="chatbot-window" 
      role="dialog" 
      aria-label="Assistente digitale"
      aria-modal="true"
      tabIndex={-1}
    >
      {/* Header */}
      <div className="chatbot-header">
        <div className="chatbot-header-info">
          <div className="chatbot-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <div className="chatbot-header-text">
            <h3>Assistente Digitale</h3>
            <p>Sempre qui per aiutarti</p>
          </div>
        </div>
        
        <div className="chatbot-header-actions">
          {messages.length > 0 && (
            <button
              className="chatbot-clear-btn"
              onClick={onClear}
              aria-label="Pulisci conversazione"
              title="Pulisci conversazione"
              type="button"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div 
        className="chatbot-messages" 
        ref={messagesContainerRef}
        role="log" 
        aria-live="polite" 
        aria-label="Conversazione con assistente"
        aria-atomic="false"
        aria-relevant="additions"
      >
        {messages.length === 0 ? (
          <div className="chatbot-welcome">
            <div className="chatbot-welcome-icon">
              👋
            </div>
            <h4>Ciao! Sono il tuo assistente digitale</h4>
            <p>Sono qui per aiutarti a navigare tra i servizi pubblici online. Puoi chiedermi qualsiasi cosa!</p>
            
            <div className="chatbot-quick-start">
              <p><strong>Prova a chiedere:</strong></p>
              <div className="chatbot-suggestions">
                <button 
                  className="chatbot-suggestion-btn"
                  onClick={() => onQuickReply('Come faccio la domanda di pensione?')}
                  type="button"
                >
                  💰 Domanda pensione
                </button>
                <button 
                  className="chatbot-suggestion-btn"
                  onClick={() => onQuickReply('Come prenoto una visita medica?')}
                  type="button"
                >
                  🏥 Prenotare visita
                </button>
                <button 
                  className="chatbot-suggestion-btn"
                  onClick={() => onQuickReply('Cos\'è lo SPID?')}
                  type="button"
                >
                  🔑 Cos'è SPID
                </button>
                <button 
                  className="chatbot-suggestion-btn"
                  onClick={() => onQuickReply('Come funziona questo sito?')}
                  type="button"
                >
                  ❓ Come funziona
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatbotMessage
                key={message.id}
                message={message}
                onQuickReply={onQuickReply}
              />
            ))}
            
            {isTyping && (
              <div className="chatbot-message bot">
                <div className="chatbot-message-avatar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                  </svg>
                </div>
                <div className="chatbot-message-content">
                  <div className="chatbot-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatbotInput onSendMessage={onSendMessage} disabled={isTyping} />
    </div>
  );
};

export default ChatbotWindow;
