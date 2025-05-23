import { Grid } from 'antd';



const useResponsive = (): boolean => {
  
  const isMobile = !Grid.useBreakpoint().md;
  
  return isMobile
};

export default useResponsive; 