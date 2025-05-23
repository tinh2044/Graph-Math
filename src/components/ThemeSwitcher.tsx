import React from 'react';
import { Switch, Tooltip } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme as toggleThemeAction } from '../redux/slices/themeSlice';
import type { RootState, AppDispatch } from '../redux/store';

const ThemeSwitcher: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const dispatch = useDispatch<AppDispatch>();

  const handleToggleTheme = () => {
    dispatch(toggleThemeAction());
  };
  
  return (
    <Tooltip 
      title={theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
      placement="left"
    >
      <Switch
        checkedChildren={<BulbFilled />}
        unCheckedChildren={<BulbOutlined />}
        checked={theme === 'dark'}
        onChange={handleToggleTheme}
      />
    </Tooltip>
  );
};

export default ThemeSwitcher; 