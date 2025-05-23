import { createSlice } from '@reduxjs/toolkit';
import { theme as antdTheme, type ThemeConfig } from 'antd';

export type ThemeMode = 'light' | 'dark';

// ThemeState will only store the mode
interface ThemeState {
  theme: ThemeMode;
  // themeConfig: ThemeConfig; // Removed from state
}

const getInitialThemeMode = (): ThemeMode => {
  const savedTheme = localStorage.getItem('theme');
  return (savedTheme as ThemeMode) || 'light';
};

// This function will be used by components to generate the config on the fly
export const createThemeConfig = (themeMode: ThemeMode): ThemeConfig => ({
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 6,
  },
  algorithm: themeMode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
});

const initialState: ThemeState = {
  theme: getInitialThemeMode(),
  // themeConfig: createThemeConfig(getInitialThemeMode()), // Removed from initial state
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      // themeConfig.algorithm is no longer updated here as themeConfig is not in state
      localStorage.setItem('theme', state.theme);
      if (state.theme === 'dark') {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer; 