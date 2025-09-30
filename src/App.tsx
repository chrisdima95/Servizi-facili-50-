import React, { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DizionarioSlang from "./components/DizionarioSlang";
import "./App.css";

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

type AccessMode = {
  largeText: boolean;
  highContrast: boolean;
};

const App: React.FC = () => {
  const [accessMode, setAccessMode] = useState<AccessMode>({
    largeText: false,
    highContrast: false,
  });

  const [focusMode, setFocusMode] = useState(false);
  const isMobile = useIsMobile();
  const appContainerRef = useRef<HTMLDivElement>(null);

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

      if (accessMode.highContrast)
        container.classList.add("high-contrast-mode");
      else container.classList.remove("high-contrast-mode");

      if (accessMode.largeText)
        container.classList.add("large-text-mode");
      else container.classList.remove("large-text-mode");

      if (focusMode) container.classList.add("focus-mode");
      else container.classList.remove("focus-mode");
    }
  }, [accessMode, focusMode]);

  return (
    <div ref={appContainerRef} className="app-container">
      <Navbar />
      <Header
        accessMode={accessMode}
        toggleAccessMode={toggleAccessMode}
        focusMode={focusMode}
        toggleFocusMode={toggleFocusMode}
      />

      <Routes>
        <Route 
          path="/" 
          element={<Home accessMode={accessMode} isMobile={isMobile} />} 
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
      </Routes>
    </div>
  );
};

export default App;
