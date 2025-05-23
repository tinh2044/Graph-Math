import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import { createThemeConfig } from '@/redux/slices/themeSlice';

interface ProvidersProps {
  children: React.ReactNode;
}

// This component will now be responsible for providing the Ant Design theme
const AntdThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeMode = useSelector((state: RootState) => state.theme.theme);
  const themeConfig = createThemeConfig(themeMode);
  
  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <AntdThemeProvider>
        <Router>
          {children}
        </Router>
      </AntdThemeProvider>
    </Provider>
  );
};

export default Providers; 