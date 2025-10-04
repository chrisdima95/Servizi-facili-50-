// src/components/Chatbot/ChatbotInput.tsx
import React, { useState, useRef, useEffect } from 'react';

interface ChatbotInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatbotInput: React.FC<ChatbotInputProps> = ({ 
  onSendMessage, 
  disabled = false,
  placeholder = "Scrivi la tua domanda..."
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus sull'input quando non è disabilitato
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      
      // Mantieni il focus sull'input immediatamente
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  return (
    <div className="chatbot-input-container">
      <form onSubmit={handleSubmit} className="chatbot-input-form">
        <div className="chatbot-input-wrapper">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="chatbot-input"
            rows={1}
            maxLength={500}
            aria-label="Scrivi messaggio all'assistente"
          />
          
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="chatbot-send-btn"
            aria-label="Invia messaggio"
            title="Invia messaggio (Invio)"
          >
            ➤
          </button>
        </div>
        
        <div className="chatbot-input-help">
          <span>Premi Invio per inviare, Shift+Invio per andare a capo</span>
          <span className="chatbot-char-count">{message.length}/500</span>
        </div>
      </form>
    </div>
  );
};

export default ChatbotInput;
