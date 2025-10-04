// src/components/ResponsiveWrapper.tsx
import React from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface ResponsiveWrapperProps {
  children: React.ReactNode;
  mobile?: React.ReactNode;
  tablet?: React.ReactNode;
  desktop?: React.ReactNode;
}

const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({ 
  children, 
  mobile, 
  tablet, 
  desktop 
}) => {
  const { isMobile, isTablet, isDesktop } = useDeviceDetection();

  if (isMobile && mobile) return <>{mobile}</>;
  if (isTablet && tablet) return <>{tablet}</>;
  if (isDesktop && desktop) return <>{desktop}</>;
  
  return <>{children}</>;
};

export default ResponsiveWrapper;
