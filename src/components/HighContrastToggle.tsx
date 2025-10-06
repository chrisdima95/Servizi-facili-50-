// Toggle per contrasto elevato: pulsante per attivare/disattivare modalità alto contrasto
import React from "react";
import "../styles/HighContrastToggle.css";

interface HighContrastToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

// Componente per attivare/disattivare la modalità alto contrasto
const HighContrastToggle: React.FC<HighContrastToggleProps> = ({
  enabled,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle} // Funzione per attivare/disattivare la modalità alto contrasto
      aria-pressed={enabled} // Controllo se la modalità alto contrasto è attiva
      aria-label="Attiva o disattiva contrasto elevato" 
      className={`high-contrast-toggle-btn ${enabled ? "active" : ""}`} 
      type="button"
    >
      {enabled ? "Disattiva contrasto elevato" : "Attiva contrasto elevato"} 
    </button>
  );
};

export default HighContrastToggle; 
