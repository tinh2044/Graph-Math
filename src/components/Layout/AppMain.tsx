import React from 'react';
import { Layout, theme } from 'antd';

const { Content } = Layout;

interface AppMainProps {
  children: React.ReactNode;
}

const AppMain: React.FC<AppMainProps> = ({ children }) => {
  const { token } = theme.useToken();

  return (
    <Content
      className="m-4 p-4 rounded-lg min-h-[calc(100vh-64px-69px)]"
      style={{
        background: token.colorBgContainer,
      }}
    >
      {children}
    </Content>
  );
};

export default AppMain; 