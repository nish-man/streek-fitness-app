import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Theme colors
  const lightTheme = {
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#212529',
    border: '#e9ecef',
    primary: '#5E60CE',
    secondary: '#4CAF50',
    accent: '#FF6B6B',
    statusBar: 'dark',
  };

  const darkTheme = {
    background: '#121212',
    card: '#1e1e1e',
    text: '#f8f9fa',
    border: '#333333',
    primary: '#7B7FE0',
    secondary: '#66BB6A',
    accent: '#FF8A8A',
    statusBar: 'light',
  };

  // Current theme based on dark mode state
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);
