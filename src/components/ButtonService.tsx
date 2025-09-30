import React from 'react';

interface ButtonServiceProps {
  icon: string;
  label: string;
  onClick: () => void;
  extraClassName?: string;
}

const ButtonService: React.FC<ButtonServiceProps> = ({ icon, label, onClick, extraClassName }) => {
  return (
    <button
      className={`button-service ${extraClassName ?? ''}`}
      onClick={onClick}
      type="button"
    >
      <img src={icon} alt={label} />
      {label}
    </button>
  );
};

export default ButtonService;
