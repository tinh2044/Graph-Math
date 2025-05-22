import React from 'react';
import { Layout, Menu, Typography, theme, Button, Space, Tooltip } from 'antd';
import { 
  LineChartOutlined, 
  HistoryOutlined, 
  SaveOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';

const { Header } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
  const location = useLocation();
  const { token } = theme.useToken();

  const selectedKey = React.useMemo(() => {
    const path = location.pathname;
    if (path === '/') return '1';
    if (path === '/saved') return '2';
    if (path === '/history') return '3';
    return '1';
  }, [location.pathname]);

  return (
    <Header
      className="sticky top-0 z-100 flex flex-nowrap items-center justify-between px-4 h-16"
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
        <Space align="center" className="mr-6 !m-0" >
          <LineChartOutlined 
            style={{ 
              fontSize: 24, 
              color: token.colorPrimary 
            }} 
          />
          <Title 
            level={4} 
            className="!m-0" 
            style={{ color: token.colorPrimary }}
          >
            Graph Math
          </Title>
        </Space>
        
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          className="border-none"
          items={[
            {
              key: "1",
              icon: <LineChartOutlined />,
              label: <Link to="/">Đồ thị</Link>,
            },
            {
              key: "2",
              icon: <SaveOutlined />,
              label: <Link to="/saved">Đã lưu</Link>,
            },
            {
              key: "3",
              icon: <HistoryOutlined />,
              label: <Link to="/history">Lịch sử</Link>,
            },
          ]}
        />
      
      <Space>
        <Tooltip title="Giới thiệu ứng dụng">
          <Button type="text" icon={<InfoCircleOutlined />}>
            Hướng dẫn
          </Button>
        </Tooltip>
        <ThemeSwitcher />
      </Space>
    </Header>
  );
};

export default AppHeader; 