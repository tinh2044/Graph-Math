import React from 'react';
import { Layout, Typography, theme } from 'antd';
import { GithubOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Text } = Typography;

const AppFooter: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <Footer className="text-center py-3 px-4">
      <Text type="secondary">
        Graph Math ©{new Date().getFullYear()} Created by Nguyễn Chí Tình
      </Text>
      <div className="mt-2">
        <a
          href="https://github.com/tinh2044"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-700"
          style={{ color: token.colorTextSecondary }}
        >
          <GithubOutlined className="text-base mr-2" />
          Source Code
        </a>
      </div>
    </Footer>
  );
};

export default AppFooter; 