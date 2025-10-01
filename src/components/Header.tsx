import React from "react";
// I controlli vengono spostati nel FAB di accessibilità

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
    <header className="app-header" role="banner" />
  );
};

export default Header;
