import React from "react";
import "../styles/LargeTextToggle.css";

interface LargeTextToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const LargeTextToggle: React.FC<LargeTextToggleProps> = ({
  enabled,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label="Aumenta o diminuisci la dimensione del testo"
      className={`large-text-toggle-btn ${enabled ? "active" : ""}`}
      type="button"
    >
      {enabled ? "Riduci testo" : "Ingrandisci testo"}
    </button>
  );
};

export default LargeTextToggle;
