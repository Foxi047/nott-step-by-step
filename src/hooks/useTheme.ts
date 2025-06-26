
import { useState, useEffect } from 'react';

export type Theme = 'light' | 'gray' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('nott-theme');
    return (saved as Theme) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('nott-theme', theme);
    
    const root = document.documentElement;
    root.classList.remove('light', 'gray', 'dark');
    root.classList.add(theme);
    
    // Применяем CSS переменные для каждой темы
    switch (theme) {
      case 'light':
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f8fafc');
        root.style.setProperty('--text-primary', '#1e293b');
        root.style.setProperty('--text-secondary', '#64748b');
        root.style.setProperty('--border-color', '#e2e8f0');
        break;
      case 'gray':
        root.style.setProperty('--bg-primary', '#64748b');
        root.style.setProperty('--bg-secondary', '#475569');
        root.style.setProperty('--text-primary', '#f1f5f9');
        root.style.setProperty('--text-secondary', '#cbd5e1');
        root.style.setProperty('--border-color', '#334155');
        break;
      case 'dark':
        root.style.setProperty('--bg-primary', '#0f172a');
        root.style.setProperty('--bg-secondary', '#1e293b');
        root.style.setProperty('--text-primary', '#f1f5f9');
        root.style.setProperty('--text-secondary', '#94a3b8');
        root.style.setProperty('--border-color', '#334155');
        break;
    }
  }, [theme]);

  return { theme, setTheme };
};
