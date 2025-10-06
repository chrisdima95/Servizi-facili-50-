// Modalità focus
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "../styles/FocusModeButton.css";

interface FocusModeButtonProps {
  enabled: boolean;
  onToggle: () => void;
  highContrast?: boolean;
}

const FocusModeButton: React.FC<FocusModeButtonProps> = ({
  enabled,
  onToggle,
  highContrast = false,
}) => {
  useEffect(() => { // Effetto per aggiornare la posizione della striscia orizzontale
    const handleMouseMove = (e: MouseEvent) => {
      if (enabled && !highContrast) { // Se la modalità focus è attiva e non è in modalità alto contrasto
        // Aggiorna solo la posizione Y del mouse per la striscia orizzontale
        const mouseY = e.clientY;
        document.documentElement.style.setProperty("--mouse-y", `${mouseY}px`); // Imposta la posizione Y del mouse
      }
    };

    if (enabled && !highContrast) { // Se la modalità focus è attiva e non è in modalità alto contrasto
      // Aggiungi listener per mousemove su tutto il documento
      document.addEventListener("mousemove", handleMouseMove, { passive: true });
      // Imposta la posizione iniziale del mouse al centro dello schermo
      const initialY = window.innerHeight / 2;
      document.documentElement.style.setProperty("--mouse-y", `${initialY}px`);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [enabled, highContrast]);

  return (
    <>
      <button
        onClick={onToggle}
        aria-pressed={enabled}
        aria-label="Attiva o disattiva modalità focus"
        className={`accessibility-btn ${enabled ? "active" : ""}`}
        type="button"
      >
        {enabled ? "Disattiva modalità focus" : "Attiva modalità focus"} 
      </button>
      {/* L'overlay deve essere sempre presente quando la modalità focus è attiva */}
      {enabled && !highContrast && createPortal(
        <div className="focus-overlay" />,
        document.body
      )}
    </>
  );
};

export default FocusModeButton;
