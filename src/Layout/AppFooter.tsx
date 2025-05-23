import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer } = Layout;
const { Text } = Typography;

const AppFooter: React.FC = () => {

  return (
    <Footer className="text-center px-4 !max-h-[40px] flex flex-col items-center justify-center !py-3">
      <Text type="secondary">
        Graph Math ©{new Date().getFullYear()} Phát triển bởi <a href="https://github.com/tinh2044" target="_blank" rel="noopener noreferrer">Nguyễn Chí Tình</a>
      </Text>
    </Footer>
  );
};

export default AppFooter; 