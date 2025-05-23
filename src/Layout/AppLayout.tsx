import React from 'react';
import { Layout } from 'antd';
import AppHeader from './AppHeader';
import AppMain from './AppMain';
import AppFooter from './AppFooter';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Layout className="flex flex-col min-h-screen gap-2 min-w-screen">
      <AppHeader />
      <AppMain>{children}</AppMain>
      <AppFooter />
    </Layout>
  );
};

export default AppLayout; 