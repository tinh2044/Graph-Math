import React from 'react';
import { Layout } from 'antd';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import { theme } from "antd";


interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { token } = theme.useToken();

  return (
    <Layout className="flex flex-col min-h-screen gap-2 min-w-screen">
      <AppHeader />
      <div
        className="h-[calc(100vh-64px)] w-full p-0  sm:px-4 flex items-center justify-center"
        style={{
          background: token.colorBgContainer,
        }}
      >
        {children}
      </div>
      <AppFooter />
    </Layout>
  );
};

export default AppLayout; 