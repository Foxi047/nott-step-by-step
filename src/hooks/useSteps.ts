import { useState, useCallback } from 'react';
import { Step } from '../types/Step';
import { toast } from 'sonner';

export const useSteps = () => {
  const [steps, setSteps] = useState<Step[]>([]);

  const addStep = useCallback((type: 'text' | 'image' | 'code' | 'html' | 'file', fileData?: { name: string; type: string; data: string }) => {
    let newStep: Step;

    if (type === 'file' && fileData) {
      // Create proper file download link
      const downloadLink = `<a href="${fileData.data}" download="${fileData.name}">📎 ${fileData.name}</a>`;
      
      newStep = {
        id: Date.now().toString(),
        type: 'file',
        content: downloadLink,
        title: fileData.name,
        fileData: fileData.data,
        fileName: fileData.name,
        fileType: fileData.type
      };
    } else if (type === 'html') {
      newStep = {
        id: Date.now().toString(),
        type: 'html',
        content: '<p>Введите HTML код здесь</p>',
        title: ''
      };
    } else if (type === 'code') {
      newStep = {
        id: Date.now().toString(),
        type: 'code',
        content: '// Введите ваш код здесь',
        title: '',
        language: 'javascript'
      };
    } else if (type === 'image') {
      newStep = {
        id: Date.now().toString(),
        type: 'image',
        content: '',
        title: ''
      };
    } else {
      newStep = {
        id: Date.now().toString(),
        type: 'text',
        content: '',
        title: ''
      };
    }
    
    setSteps(prev => [...prev, newStep]);
    return newStep;
  }, []);

  const updateStep = useCallback((updatedStep: Step) => {
    setSteps(prev => prev.map(step => 
      step.id === updatedStep.id ? updatedStep : step
    ));
  }, []);

  const deleteStep = useCallback((stepId: string) => {
    setSteps(prev => prev.filter(step => step.id !== stepId));
  }, []);

  const copyStep = useCallback((step: Step) => {
    // Создаем копию шага
    const newStep: Step = {
      ...step,
      id: Date.now().toString(),
      title: step.title ? `${step.title} (копия)` : undefined
    };
    setSteps(prev => [...prev, newStep]);
    return newStep;
  }, []);

  const reorderSteps = useCallback((newSteps: Step[]) => {
    setSteps(newSteps);
  }, []);

  return {
    steps,
    setSteps,
    addStep,
    updateStep,
    deleteStep,
    copyStep,
    reorderSteps
  };
};
