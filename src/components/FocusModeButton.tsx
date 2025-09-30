import React, { useEffect } from "react";
import "../styles/FocusModeButton.css";

interface FocusModeButtonProps {
  enabled: boolean;
  onToggle: () => void;
}

const FocusModeButton: React.FC<FocusModeButtonProps> = ({
  enabled,
  onToggle,
}) => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (enabled) {
        document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
      }
    };

    if (enabled) {
      window.addEventListener("mousemove", handleMouseMove);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [enabled]);

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
      {enabled && <div className="focus-overlay" />}
    </>
  );
};

export default FocusModeButton;
