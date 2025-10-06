// Toggle per testo grande: pulsante per ingrandire/ridurre dimensione font dell'interfaccia
import React from "react";
import "../styles/LargeTextToggle.css";

interface LargeTextToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

// Componente per attivare/disattivare la modalità testo grande
const LargeTextToggle: React.FC<LargeTextToggleProps> = ({
  enabled,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle} // Funzione per attivare/disattivare la modalità testo grande
      aria-pressed={enabled} // Controllo se la modalità testo grande è attiva  
      aria-label="Aumenta o diminuisci la dimensione del testo" 
      className={`large-text-toggle-btn ${enabled ? "active" : ""}`}
      type="button"
    >
      {enabled ? "Riduci testo" : "Ingrandisci testo"}
    </button>
  );
};

export default LargeTextToggle;
