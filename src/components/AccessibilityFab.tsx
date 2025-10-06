// Floating Action Button per accessibilità: raccoglie tutti i controlli di accessibilità in un menu espandibile
import React, { useState } from "react";
import HighContrastToggle from "./HighContrastToggle";
import LargeTextToggle from "./LargeTextToggle";
import FocusModeButton from "./FocusModeButton";
import "../styles/AccessibilityFab.css";

interface AccessibilityFabProps {
  accessMode: {
    largeText: boolean;
    highContrast: boolean;
  };
  toggleAccessMode: (key: "largeText" | "highContrast") => void; // Cambia il modo di visualizzazione del testo o del contrasto
  focusMode: boolean; // Controllo di focus per la modalità di lettura
  toggleFocusMode: () => void; // Cambia il modo di visualizzazione del testo o del contrasto
}

const AccessibilityFab: React.FC<AccessibilityFabProps> = React.memo(({ // Componente memoizzato per migliorare le prestazioni
  accessMode,
  toggleAccessMode,
  focusMode,
  toggleFocusMode,
}) => {
  const [open, setOpen] = useState(false); // Stato per controllare se il menu è aperto o chiuso
  

  return (
    <div className={`accessibility-fab ${open ? "open" : ""}`}> 
      {open && (
        <div className="accessibility-menu" role="menu" aria-label="Menu accessibilità">
          <HighContrastToggle 
            enabled={accessMode.highContrast} 
            onToggle={() => toggleAccessMode("highContrast")} // Cambia il modo di visualizzazione del contrasto
          />
          <LargeTextToggle
            enabled={accessMode.largeText}
            onToggle={() => toggleAccessMode("largeText")} // Cambia il modo di visualizzazione del testo
          />
          <FocusModeButton 
            enabled={focusMode} 
            onToggle={toggleFocusMode} 
            highContrast={accessMode.highContrast} // Controllo di focus per la modalità di lettura
          />
        </div>
      )}

      <button 
        className="fab-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Apri menu accessibilità"
        type="button"
        onClick={() => setOpen((v) => !v)} // Cambia lo stato del menu
      >
        <span className="fab-icon" aria-hidden>👤</span>
        
        {/* Tooltip */}
        <div className="accessibility-fab-tooltip"> 
          Pulsante accessibilità
        </div>
      </button>
    </div>
  );
});

export default AccessibilityFab;


