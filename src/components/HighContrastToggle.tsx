import React from "react";
import "../styles/HighContrastToggle.css";

interface HighContrastToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const HighContrastToggle: React.FC<HighContrastToggleProps> = ({
  enabled,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label="Attiva o disattiva contrasto elevato"
      className={`high-contrast-toggle-btn ${enabled ? "active" : ""}`}
      type="button"
    >
      {enabled ? "Disattiva contrasto elevato" : "Attiva contrasto elevato"}
    </button>
  );
};

export default HighContrastToggle;
