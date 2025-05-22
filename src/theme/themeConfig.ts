import type { ThemeConfig } from 'antd/es/config-provider/context';
import { theme } from 'antd';

const { defaultAlgorithm, darkAlgorithm } = theme;

export interface AppTheme {
  key: 'light' | 'dark';
  name: string;
  config: ThemeConfig;
}

export const lightTheme: AppTheme = {
  key: 'light',
  name: 'Sáng',
  config: {
    token: {
      colorPrimary: '#1677ff', 
      colorSuccess: '#52c41a', 
      colorWarning: '#faad14', 
      colorError: '#f5222d',   
      colorInfo: '#1677ff',    
      borderRadius: 6,        
      wireframe: false,        
    },
    algorithm: defaultAlgorithm,
    components: {
      Layout: {
        bodyBg: '#f5f5f5',
        headerBg: '#fff',
        siderBg: '#fff',
      },
      Card: {
        colorBgContainer: '#fff',
      },
    },
  },
};

export const darkTheme: AppTheme = {
  key: 'dark',
  name: 'Tối',
  config: {
    token: {
      colorPrimary: '#1668dc', 
      colorSuccess: '#49aa19', 
      colorWarning: '#d89614', 
      colorError: '#d32029',   
      colorInfo: '#1668dc',    
      borderRadius: 6,        
      wireframe: false,        
    },
    algorithm: darkAlgorithm,
    components: {
      Layout: {
        bodyBg: '#141414',
        headerBg: '#1f1f1f',
        siderBg: '#1f1f1f',
      },
      Card: {
        colorBgContainer: '#1f1f1f',
      },
    },
  },
};

export const themes: AppTheme[] = [lightTheme, darkTheme];

export const getThemeByKey = (key: string): AppTheme => {
  return themes.find(t => t.key === key) || lightTheme;
}; 