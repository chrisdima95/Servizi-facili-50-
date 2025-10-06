// Componente principale dell'applicazione: gestisce routing, provider, lazy loading e stato globale
import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Routes, Route, useParams, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import AccessibilityFab from "./components/AccessibilityFab";
import Navbar from "./components/Navbar";
import ChatbotFab from "./components/Chatbot/ChatbotFab";
import ChatbotWindow from "./components/Chatbot/ChatbotWindow";
import ErrorBoundary from "./components/ErrorBoundary";
import { useChatbot } from "./components/Chatbot/useChatbot";
import { UserProvider, useUser } from "./contexts/UserContext";
import { SearchProvider } from "./contexts/SearchContext";
// Funzione di retry per il lazy loading
const retryImport = (importFn: () => Promise<any>, retries = 3): Promise<any> => {
  return importFn().catch((error) => {
    if (retries > 0) {
      console.warn(`Tentativo di ricaricamento fallito, riprovo... (${retries} tentativi rimasti)`);
      return new Promise((resolve) => {
        setTimeout(() => resolve(retryImport(importFn, retries - 1)), 1000);
      });
    }
    throw error;
  });
};

// Lazy loading dei componenti con retry
const Home = lazy(() => retryImport(() => import("./pages/Home")));
const Servizi = lazy(() => retryImport(() => import("./pages/Servizi")));
const ServiceOperations = lazy(() => retryImport(() => import("./pages/ServiceOperations")));
const DizionarioSlang = lazy(() => retryImport(() => import("./pages/DizionarioSlang")));
const OperationGuide = lazy(() => retryImport(() => import("./components/OperationGuide")));
const Profilo = lazy(() => retryImport(() => import("./pages/Profilo")));
const Guide = lazy(() => retryImport(() => import("./pages/Guide")));
import servicesData from "./data/servicesData";
import type { Service } from "./data/servicesData";
import type { AccessMode } from "./types/accessibility";
import "./App.css";
import "./styles/Critical.css";
// Componente di loading per Suspense
const LoadingSpinner = () => (
  <div className="loading-spinner">
    Caricamento...
  </div>
);

// ===== UTILITY FUNCTIONS =====

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

// ===== PROVIDER COMPONENTS =====

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
  const location = useLocation();
  
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

  // Scroll verso l'alto quando cambia la route - OTTIMIZZATO
  useEffect(() => {
    // Scroll semplice e efficiente
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div ref={appContainerRef} className="app-container">
      <Navbar isMobile={isMobile} />
      <Header />

      <Routes>
        <Route path="/" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Home accessMode={accessMode} isMobile={isMobile} />
          </Suspense>
        } />
        <Route
          path="/servizi"
          element={isAuthenticated ? (
            <Suspense fallback={<LoadingSpinner />}>
              <Servizi accessMode={accessMode} isMobile={isMobile} />
            </Suspense>
          ) : (
            <Navigate to="/profilo" replace />
          )}
        />
        <Route
          path="/glossario"
          element={
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner />}>
                <DizionarioSlang
                  largeText={accessMode.largeText}
                  highContrast={accessMode.highContrast}
                />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/service/:serviceId"
          element={isAuthenticated ? (
            <Suspense fallback={<LoadingSpinner />}>
              <ServiceOperationsWrapper accessMode={accessMode} />
            </Suspense>
          ) : (
            <Navigate to="/profilo" replace />
          )}
        />
        <Route path="/operation/:serviceId/:operationId" element={
          <Suspense fallback={<LoadingSpinner />}>
            <OperationGuide accessMode={accessMode} />
          </Suspense>
        } />
        <Route path="/guide" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Guide accessMode={accessMode} />
          </Suspense>
        } />
        <Route path="/profilo" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Profilo />
          </Suspense>
        } />
      </Routes>
      <AccessibilityFab
        accessMode={accessMode}
        toggleAccessMode={toggleAccessMode}
        focusMode={focusMode}
        toggleFocusMode={toggleFocusMode}
      />
      
      {/* CHATBOT COMPLETO - Principale */}
      {!isOpen && (
        <ChatbotFab
          isOpen={isOpen}
          onClick={toggleChatbot}
        />
      )}
      
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
    <UserProvider>
      <SearchProvider>
        <AppContent />
      </SearchProvider>
    </UserProvider>
  );
};

export default App;
