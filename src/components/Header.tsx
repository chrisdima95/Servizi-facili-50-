import React from "react";
import HighContrastToggle from "../components/HighContrastToggle";
import LargeTextToggle from "../components/LargeTextToggle";
import FocusModeButton from "../components/FocusModeButton";

interface HeaderProps {
  accessMode: {
    largeText: boolean;
    highContrast: boolean;
  };
  toggleAccessMode: (key: "largeText" | "highContrast") => void;
  focusMode: boolean;
  toggleFocusMode: () => void;
}

const Header: React.FC<HeaderProps> = ({
  accessMode,
  toggleAccessMode,
  focusMode,
  toggleFocusMode,
}) => {
  return (
    <header className="app-header" role="banner">
      <div className="accessibility-controls">
        <HighContrastToggle
          enabled={accessMode.highContrast}
          onToggle={() => toggleAccessMode("highContrast")}
        />
        <LargeTextToggle
          enabled={accessMode.largeText}
          onToggle={() => toggleAccessMode("largeText")}
        />
        <FocusModeButton enabled={focusMode} onToggle={toggleFocusMode} />
      </div>
    </header>
  );
};

export default Header;
