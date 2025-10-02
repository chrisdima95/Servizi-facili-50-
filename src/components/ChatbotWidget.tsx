import React from 'react';
import '../styles/ChatbotWidget.css';

const ChatbotWidget: React.FC = () => {
    return (
        // @ts-ignore: Diciamo a TypeScript di ignorare il tag df-messenger che React non riconosce, ma Dialogflow usa
<df-messenger
  intent="WELCOME"
  chat-title="NewAgent"
  agent-id="744f91e1-d82c-4e06-92cd-dffc3cef06f2"
  language-code="it"
/>
    );
};

export default ChatbotWidget;