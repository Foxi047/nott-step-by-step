
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainArea from '../components/MainArea';
import { Step } from '../components/StepEditor';
import { useInstructionStorage } from '../hooks/useInstructionStorage';
import { exportToHTML, exportToMarkdown, exportToJSON, downloadFile } from '../utils/exportUtils';
import { toast } from 'sonner';

const Index = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [isVerticalLayout, setIsVerticalLayout] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [instructionTitle, setInstructionTitle] = useState('Новая инструкция');
  const [instructionDescription, setInstructionDescription] = useState('');
  
  const { saveInstruction } = useInstructionStorage();

  const handleAddStep = (type: 'text' | 'image' | 'code') => {
    const newStep: Step = {
      id: Date.now().toString(),
      type,
      content: type === 'code' ? '// Введите ваш код здесь' : 'Новый шаг',
      title: type === 'code' ? 'Код' : type === 'image' ? 'Изображение' : 'Текст',
      language: type === 'code' ? 'javascript' : undefined
    };
    
    setSteps(prev => [...prev, newStep]);
    toast.success(`Добавлен новый шаг: ${type === 'text' ? 'Текст' : type === 'code' ? 'Код' : 'Изображение'}`);
  };

  const handleLoadImage = () => {
    // Будет обработано в MainArea через ImageEditor
    toast.info('Выберите изображение для загрузки');
  };

  const handleSave = () => {
    if (steps.length === 0) {
      toast.error('Добавьте хотя бы один шаг');
      return;
    }
    
    const success = saveInstruction(instructionTitle, instructionDescription, steps);
    if (success) {
      toast.success('Инструкция сохранена');
    } else {
      toast.error('Ошибка сохранения');
    }
  };

  const handleExport = (format: 'html' | 'markdown' | 'json') => {
    if (steps.length === 0) {
      toast.error('Нет шагов для экспорта');
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const baseFilename = `${instructionTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}`;
    
    try {
      switch (format) {
        case 'html':
          const htmlContent = exportToHTML(instructionTitle, instructionDescription, steps);
          downloadFile(htmlContent, `${baseFilename}.html`, 'text/html');
          break;
        
        case 'markdown':
          const markdownContent = exportToMarkdown(instructionTitle, instructionDescription, steps);
          downloadFile(markdownContent, `${baseFilename}.md`, 'text/markdown');
          break;
        
        case 'json':
          const jsonContent = exportToJSON(instructionTitle, instructionDescription, steps);
          downloadFile(jsonContent, `${baseFilename}.json`, 'application/json');
          break;
      }
      
      toast.success(`Экспорт в ${format.toUpperCase()} завершен`);
    } catch (error) {
      console.error('Ошибка экспорта:', error);
      toast.error('Ошибка при экспорте');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      <Sidebar
        onAddStep={handleAddStep}
        onLoadImage={handleLoadImage}
        onSave={handleSave}
        onExport={handleExport}
        isVerticalLayout={isVerticalLayout}
        onLayoutChange={setIsVerticalLayout}
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
      />
      
      <MainArea
        steps={steps}
        onStepsChange={setSteps}
        isVerticalLayout={isVerticalLayout}
        instructionTitle={instructionTitle}
        onTitleChange={setInstructionTitle}
        instructionDescription={instructionDescription}
        onDescriptionChange={setInstructionDescription}
      />
    </div>
  );
};

export default Index;
