import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

interface ResponsiveState {
  isMobile: boolean;
}

const useResponsive = (): ResponsiveState => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkScreenSize(); // Initial check
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return { isMobile };
};

export default useResponsive; 