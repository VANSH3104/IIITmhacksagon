export const themes = {
  light: {
    background: '#ffffff',
    text: '#000000',
    primary: '#f59e0b',
    secondary: '#3b82f6',
    accent: '#4ade80',
  },
  dark: {
    background: '#1f2937',
    text: '#ffffff',
    primary: '#fbbf24',
    secondary: '#60a5fa',
    accent: '#34d399',
  },
};

export const getStoredTheme = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') || 'light';
  }
  return 'light';
};

export const setStoredTheme = (theme) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', theme);
  }
};