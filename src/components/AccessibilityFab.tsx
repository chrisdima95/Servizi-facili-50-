import React, { useState } from "react";
import HighContrastToggle from "./HighContrastToggle";
import LargeTextToggle from "./LargeTextToggle";
import FocusModeButton from "./FocusModeButton";
import { useNavigate } from "react-router-dom";
import "../styles/AccessibilityFab.css";

interface AccessibilityFabProps {
  accessMode: {
    largeText: boolean;
    highContrast: boolean;
  };
  toggleAccessMode: (key: "largeText" | "highContrast") => void;
  focusMode: boolean;
  toggleFocusMode: () => void;
}

const AccessibilityFab: React.FC<AccessibilityFabProps> = ({
  accessMode,
  toggleAccessMode,
  focusMode,
  toggleFocusMode,
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleGlossary = () => {
    setOpen(false);
    navigate("/glossario");
  };

  return (
    <div className={`accessibility-fab ${open ? "open" : ""}`}>
      {open && (
        <div className="accessibility-menu" role="menu" aria-label="Menu accessibilità">
          <HighContrastToggle
            enabled={accessMode.highContrast}
            onToggle={() => toggleAccessMode("highContrast")}
          />
          <LargeTextToggle
            enabled={accessMode.largeText}
            onToggle={() => toggleAccessMode("largeText")}
          />
          <FocusModeButton enabled={focusMode} onToggle={toggleFocusMode} />
          <button
            className="glossary-btn"
            type="button"
            onClick={handleGlossary}
          >
            Glossario informatico
          </button>
        </div>
      )}

      <button
        className="fab-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Apri menu accessibilità"
        type="button"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="fab-icon" aria-hidden>👤</span>
      </button>
    </div>
  );
};

export default AccessibilityFab;


