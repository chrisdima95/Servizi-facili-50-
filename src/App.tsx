// src/App.tsx
import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useParams, Navigate } from "react-router-dom";
import Header from "./components/Header";
import AccessibilityFab from "./components/AccessibilityFab";
import Navbar from "./components/Navbar";
import { ChatbotFab, ChatbotWindow } from "./components/Chatbot";
import { useChatbot } from "./hooks/useChatbot";
import Home from "./pages/Home";
import Servizi from "./pages/Servizi";
import ServiceOperations from "./pages/ServiceOperations";
import DizionarioSlang from "./pages/DizionarioSlang";
import OperationGuide from "./components/OperationGuide";
import Profilo from "./pages/Profilo";
import Guide from "./pages/Guide";
import servicesData from "./data/servicesData";
import type { Service } from "./data/servicesData";
import type { AccessMode } from "./types"; 
import "./App.css";
import { useUser } from "./context/UserContext";
import { SearchProvider } from "./context/SearchContext";

function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
    } else {
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [breakpoint]);

  return isMobile;
}

// Wrapper per gestire la route /service/:serviceId
const ServiceOperationsWrapper: React.FC<{ accessMode: AccessMode }> = ({ accessMode }) => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service: Service | undefined = servicesData.find((s) => s.id === serviceId);

  if (!service) return <Navigate to="/" />;

  return <ServiceOperations service={service} accessMode={accessMode} />;
};

// Componente interno che usa i provider
const AppContent: React.FC = () => {
  const [accessMode, setAccessMode] = useState<AccessMode>({
    largeText: false,
    highContrast: false,
  });

  const [focusMode, setFocusMode] = useState(false);
  const isMobile = useIsMobile();
  const appContainerRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useUser();
  
  // Chatbot hook completo - ora dentro il SearchProvider
  const {
    messages,
    isOpen,
    isTyping,
    processUserInput,
    toggleChatbot,
    closeChatbot,
    clearChat,
    handleQuickReply
  } = useChatbot();
  

  const toggleAccessMode = (key: keyof AccessMode) => {
    setAccessMode((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleFocusMode = () => {
    setFocusMode((prev) => !prev);
  };

  useEffect(() => {
    const body = document.body;

    if (accessMode.largeText) body.classList.add("large-text-mode");
    else body.classList.remove("large-text-mode");

    if (accessMode.highContrast) body.classList.add("high-contrast-mode");
    else body.classList.remove("high-contrast-mode");

    if (focusMode) body.classList.add("focus-mode");
    else body.classList.remove("focus-mode");

    if (appContainerRef.current) {
      const container = appContainerRef.current;

      if (accessMode.highContrast) container.classList.add("high-contrast-mode");
      else container.classList.remove("high-contrast-mode");

      if (accessMode.largeText) container.classList.add("large-text-mode");
      else container.classList.remove("large-text-mode");

      if (focusMode) container.classList.add("focus-mode");
      else container.classList.remove("focus-mode");
    }
  }, [accessMode, focusMode]);

  return (
    <div ref={appContainerRef} className="app-container">
      <Navbar isMobile={isMobile} />
      <Header />

      <Routes>
        <Route path="/" element={<Home accessMode={accessMode} isMobile={isMobile} />} />
        <Route
          path="/servizi"
          element={isAuthenticated ? (
            <Servizi accessMode={accessMode} isMobile={isMobile} />
          ) : (
            <Navigate to="/profilo" replace />
          )}
        />
        <Route
          path="/glossario"
          element={
            <DizionarioSlang
              largeText={accessMode.largeText}
              highContrast={accessMode.highContrast}
            />
          }
        />
        <Route
          path="/service/:serviceId"
          element={isAuthenticated ? (
            <ServiceOperationsWrapper accessMode={accessMode} />
          ) : (
            <Navigate to="/profilo" replace />
          )}
        />
        <Route path="/operation/:serviceId/:operationId" element={<OperationGuide accessMode={accessMode} />} />
        <Route path="/guide" element={<Guide accessMode={accessMode} />} />
        <Route path="/profilo" element={<Profilo />} />
      </Routes>
      <AccessibilityFab
        accessMode={accessMode}
        toggleAccessMode={toggleAccessMode}
        focusMode={focusMode}
        toggleFocusMode={toggleFocusMode}
      />
      
      {/* CHATBOT COMPLETO - Principale */}
      <ChatbotFab
        isOpen={isOpen}
        onClick={toggleChatbot}
      />
      
      {isOpen && (
        <ChatbotWindow
          messages={messages}
          isTyping={isTyping}
          onSendMessage={processUserInput}
          onQuickReply={handleQuickReply}
          onClose={closeChatbot}
          onClear={clearChat}
        />
      )}
      
    </div>
  );
};

// Componente App principale con provider
const App: React.FC = () => {
  return (
    <SearchProvider>
      <AppContent />
    </SearchProvider>
  );
};

export default App;
