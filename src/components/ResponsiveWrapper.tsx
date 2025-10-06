// Renderizza contenuti diversi in base al tipo di dispositivo (mobile/tablet/desktop)
import React from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  mobile?: React.ReactNode;
  tablet?: React.ReactNode;
  desktop?: React.ReactNode;
}

// Renderizza contenuti diversi in base al tipo di dispositivo (mobile/tablet/desktop)
const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({  
  children, // Contenuto predefinito
  mobile, 
  tablet, 
  desktop 
}) => {
  const { isMobile, isTablet, isDesktop } = useDeviceDetection(); // Recupera il tipo di dispositivo

  if (isMobile && mobile) return <>{mobile}</>; // Se il dispositivo è mobile, renderizza il contenuto mobile
  if (isTablet && tablet) return <>{tablet}</>; 
  if (isDesktop && desktop) return <>{desktop}</>; 
  
  return <>{children}</>; // Se il dispositivo non è mobile, tablet o desktop, renderizza il contenuto predefinito
};

export default ResponsiveWrapper;
