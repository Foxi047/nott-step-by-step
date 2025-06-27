
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainArea from '../components/MainArea';
import Settings from '../components/Settings';
import SavedProjects from '../components/SavedProjects';
import PreviewMode from '../components/PreviewMode';
import ImageEditor from '../components/ImageEditor';
import { Step } from '../components/StepEditor';
import { useInstructionStorage } from '../hooks/useInstructionStorage';
import { useTheme, Theme } from '../hooks/useTheme';
import { exportToHTML, exportToMarkdown, exportToJSON, downloadFile } from '../utils/exportUtils';
import { toast } from 'sonner';

const Index = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [instructionTitle, setInstructionTitle] = useState('Новая инструкция');
  const [instructionDescription, setInstructionDescription] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showSavedProjects, setShowSavedProjects] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editingImageStepId, setEditingImageStepId] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{title: string, description: string, steps: Step[]} | null>(null);
  
  const { saveInstruction } = useInstructionStorage();
  const { theme } = useTheme();

  const handleAddStep = (type: 'text' | 'image' | 'code' | 'html' | 'file', fileData?: { name: string; type: string; data: string }) => {
    if (type === 'image') {
      setEditingImageStepId(null);
      setShowImageEditor(true);
      return;
    }

    let newStep: Step;

    if (type === 'file' && fileData) {
      newStep = {
        id: Date.now().toString(),
        type: 'file',
        content: `Прикрепленный файл: ${fileData.name}`,
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
        title: 'HTML блок'
      };
    } else if (type === 'code') {
      newStep = {
        id: Date.now().toString(),
        type: 'code',
        content: '// Введите ваш код здесь',
        title: 'Код',
        language: 'javascript'
      };
    } else {
      // type === 'text'
      newStep = {
        id: Date.now().toString(),
        type: 'text',
        content: 'Новый шаг',
        title: 'Текст'
      };
    }
    
    setSteps(prev => [...prev, newStep]);
    const typeNames: Record<string, string> = {
      text: 'Текст',
      code: 'Код',
      html: 'HTML-блок',
      file: 'Файл'
    };
    toast.success(`Добавлен новый шаг: ${typeNames[type] || type}`);
  };

  const handleEditImage = (stepId: string) => {
    setEditingImageStepId(stepId);
    setShowImageEditor(true);
  };

  const handleImageSave = (imageUrl: string, stepId?: string) => {
    if (stepId) {
      // Редактирование существующего изображения
      const updatedSteps = steps.map(step => 
        step.id === stepId ? { ...step, imageUrl } : step
      );
      setSteps(updatedSteps);
      toast.success('Изображение обновлено');
    } else {
      // Добавление нового изображения
      const newStep: Step = {
        id: Date.now().toString(),
        type: 'image',
        content: '',
        imageUrl,
        title: 'Новое изображение'
      };
      setSteps(prev => [...prev, newStep]);
      toast.success('Изображение добавлено');
    }
    setShowImageEditor(false);
    setEditingImageStepId(null);
  };

  const handlePasteImage = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      const imageItems = clipboardItems.filter(item => 
        item.types.some(type => type.startsWith('image/'))
      );
      
      if (imageItems.length === 0) {
        toast.error('В буфере обмена нет изображений');
        return;
      }

      const imageItem = imageItems[0];
      const imageType = imageItem.types.find(type => type.startsWith('image/'));
      
      if (imageType) {
        const blob = await imageItem.getType(imageType);
        const imageUrl = URL.createObjectURL(blob);
        
        const newStep: Step = {
          id: Date.now().toString(),
          type: 'image',
          content: '',
          imageUrl,
          title: 'Изображение из буфера обмена'
        };
        
        setSteps(prev => [...prev, newStep]);
        toast.success('Изображение добавлено из буфера обмена');
      }
    } catch (error) {
      toast.error('Ошибка при вставке изображения из буфера обмена');
    }
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

  const handleSaveWithTheme = (selectedTheme: Theme) => {
    if (steps.length === 0) {
      toast.error('Добавьте хотя бы один шаг');
      return;
    }
    
    const success = saveInstruction(instructionTitle, instructionDescription, steps);
    if (success) {
      toast.success(`Инструкция сохранена с темой: ${selectedTheme === 'light' ? 'Светлая' : selectedTheme === 'gray' ? 'Серая' : 'Тёмная'}`);
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

  const handleLoadProject = (title: string, description: string, projectSteps: Step[]) => {
    setInstructionTitle(title);
    setInstructionDescription(description);
    setSteps(projectSteps);
    toast.success('Проект загружен');
  };

  const handlePreviewProject = (title: string, description: string, projectSteps: Step[]) => {
    setPreviewData({ title, description, steps: projectSteps });
    setShowPreview(true);
    setShowSavedProjects(false);
  };

  const handlePreviewCurrent = () => {
    if (steps.length === 0) {
      toast.error('Нет шагов для предпросмотра');
      return;
    }
    setPreviewData({ title: instructionTitle, description: instructionDescription, steps });
    setShowPreview(true);
  };

  return (
    <div className={`min-h-screen flex ${theme}`} style={{
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    }}>
      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
      
      {showSavedProjects && (
        <SavedProjects
          onClose={() => setShowSavedProjects(false)}
          onLoadProject={handleLoadProject}
          onPreviewProject={handlePreviewProject}
        />
      )}
      
      {showPreview && previewData && (
        <PreviewMode
          title={previewData.title}
          description={previewData.description}
          steps={previewData.steps}
          onClose={() => setShowPreview(false)}
          onSaveWithTheme={handleSaveWithTheme}
        />
      )}

      {showImageEditor && (
        <ImageEditor
          onSave={handleImageSave}
          onCancel={() => {
            setShowImageEditor(false);
            setEditingImageStepId(null);
          }}
          stepId={editingImageStepId}
        />
      )}
      
      <Sidebar
        onAddStep={handleAddStep}
        onLoadImage={() => setShowImageEditor(true)}
        onPasteImage={handlePasteImage}
        onSave={handleSave}
        onExport={handleExport}
        onOpenSettings={() => setShowSettings(true)}
        onOpenSavedProjects={() => setShowSavedProjects(true)}
      />
      
      <MainArea
        steps={steps}
        onStepsChange={setSteps}
        instructionTitle={instructionTitle}
        onTitleChange={setInstructionTitle}
        instructionDescription={instructionDescription}
        onDescriptionChange={setInstructionDescription}
        onPreview={handlePreviewCurrent}
        onEditImage={handleEditImage}
      />
    </div>
  );
};

export default Index;
