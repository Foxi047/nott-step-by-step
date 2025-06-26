
import { useState, useEffect } from 'react';
import { Step } from '../components/StepEditor';

interface Instruction {
  id: string;
  title: string;
  description: string;
  steps: Step[];
  createdAt: Date;
  updatedAt: Date;
}

export const useInstructionStorage = () => {
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [currentInstruction, setCurrentInstruction] = useState<Instruction | null>(null);

  // Загрузка из localStorage при инициализации
  useEffect(() => {
    const saved = localStorage.getItem('nott-instructions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setInstructions(parsed.map((inst: any) => ({
          ...inst,
          createdAt: new Date(inst.createdAt),
          updatedAt: new Date(inst.updatedAt)
        })));
      } catch (error) {
        console.error('Ошибка загрузки инструкций:', error);
      }
    }
  }, []);

  // Сохранение в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('nott-instructions', JSON.stringify(instructions));
  }, [instructions]);

  const saveInstruction = (title: string, description: string, steps: Step[]) => {
    const now = new Date();
    
    if (currentInstruction) {
      // Обновляем существующую инструкцию
      const updated: Instruction = {
        ...currentInstruction,
        title,
        description,
        steps,
        updatedAt: now
      };
      
      setInstructions(prev => 
        prev.map(inst => inst.id === updated.id ? updated : inst)
      );
      setCurrentInstruction(updated);
    } else {
      // Создаем новую инструкцию
      const newInstruction: Instruction = {
        id: Date.now().toString(),
        title,
        description,
        steps,
        createdAt: now,
        updatedAt: now
      };
      
      setInstructions(prev => [...prev, newInstruction]);
      setCurrentInstruction(newInstruction);
    }
    
    return true;
  };

  const loadInstruction = (id: string) => {
    const instruction = instructions.find(inst => inst.id === id);
    if (instruction) {
      setCurrentInstruction(instruction);
      return instruction;
    }
    return null;
  };

  const deleteInstruction = (id: string) => {
    setInstructions(prev => prev.filter(inst => inst.id !== id));
    if (currentInstruction?.id === id) {
      setCurrentInstruction(null);
    }
  };

  const createNewInstruction = () => {
    setCurrentInstruction(null);
  };

  return {
    instructions,
    currentInstruction,
    saveInstruction,
    loadInstruction,
    deleteInstruction,
    createNewInstruction
  };
};
