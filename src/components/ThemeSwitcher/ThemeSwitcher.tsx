import React from 'react';
import { Switch, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '../../context/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Tooltip 
      title={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
      placement="left"
    >
      <Switch
        checkedChildren={<BulbFilled />}
        unCheckedChildren={<BulbOutlined />}
        checked={theme === 'dark'}
        onChange={toggleTheme}
      />
    </Tooltip>
  );
};

export default ThemeSwitcher; 