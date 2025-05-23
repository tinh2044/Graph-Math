import React from 'react';
import { theme } from 'antd';


interface AppMainProps {
  children: React.ReactNode;
}

const AppMain: React.FC<AppMainProps> = ({ children }) => {
  const { token } = theme.useToken();

  return (
    <div
      className="h-[calc(100vh-64px)] w-full px-4"
      style={{
        background: token.colorBgContainer,
      }}
    >
      {children}
    </div>
  );
};

export default AppMain; 