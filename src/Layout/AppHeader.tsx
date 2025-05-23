import React from 'react';
import { Layout, Typography, theme, Space } from 'antd';
import { 
  GithubOutlined
} from '@ant-design/icons';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const { Header } = Layout;  
const { Title } = Typography;

const AppHeader: React.FC = () => {
  const { token } = theme.useToken();
  return (
    <Header
      className="sticky top-0 flex items-center justify-between h-16 !px-2 sm:!px-4 z-100 flex-nowrap"
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
        <Space align="center" className="mr-6 !m-0" >
          <img src="/logo.png" alt="logo" className="w-20 h-20" />
          <Title 
            level={2} 
            className="!m-0" 
            style={{ color: token.colorPrimary }}
          >
            Graph Math
          </Title>
        </Space>

      <Space className='flex items-center'>
        <a className='flex items-center' href="https://github.com/tinh2044" target="_blank" rel="noopener noreferrer">
          <GithubOutlined style={{ fontSize: 20, color: token.colorPrimary }} />
        </a>
        <ThemeSwitcher />
      </Space>
    </Header>
  );
};

export default AppHeader; 