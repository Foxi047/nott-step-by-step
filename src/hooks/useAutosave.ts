import { useEffect, useRef } from 'react';
import { Step } from '../types/Step';

const AUTOSAVE_KEY = 'nott-autosave';
const AUTOSAVE_INTERVAL = 3000; // 3 секунды

export const useAutosave = (
  title: string,
  description: string,
  steps: Step[]
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Очищаем предыдущий таймер
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Устанавливаем новый таймер
    timeoutRef.current = setTimeout(() => {
      const autosaveData = {
        title,
        description,
        steps,
        timestamp: Date.now()
      };
      
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(autosaveData));
      } catch (error) {
        console.error('Ошибка автосохранения:', error);
      }
    }, AUTOSAVE_INTERVAL);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [title, description, steps]);

  const loadAutosave = () => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Ошибка загрузки автосохранения:', error);
    }
    return null;
  };

  const clearAutosave = () => {
    localStorage.removeItem(AUTOSAVE_KEY);
  };

  return { loadAutosave, clearAutosave };
};
