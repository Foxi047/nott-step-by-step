import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MainArea from '../components/MainArea';
import Settings from '../components/Settings';
import SavedProjects from '../components/SavedProjects';
import PreviewMode from '../components/PreviewMode';
import ImageEditor from '../components/ImageEditor';
import HtmlTemplateSelector from '../components/HtmlTemplateSelector';
import QRCodeGenerator from '../components/QRCodeGenerator';
import FileEditor from '../components/FileEditor';
import SaveOptionsDialog from '../components/SaveOptionsDialog';
import { Step } from '../types/Step';
import { useInstructionStorage } from '../hooks/useInstructionStorage';
import { useTheme, Theme } from '../hooks/useTheme';
import { useSteps } from '../hooks/useSteps';
import { useStepGroups } from '../hooks/useStepGroups';
import { useAutosave } from '../hooks/useAutosave';
import { exportToHTML, exportToMarkdown, exportToJSON, downloadFile } from '../utils/exportUtils';
import { toast } from 'sonner';

const Index = () => {
  const [instructionTitle, setInstructionTitle] = useState('Новая инструкция');
  const [instructionDescription, setInstructionDescription] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showSavedProjects, setShowSavedProjects] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [showHtmlTemplateSelector, setShowHtmlTemplateSelector] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const [editingImageStepId, setEditingImageStepId] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{title: string, description: string, steps: Step[]} | null>(null);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [selectedGroupForTemplate, setSelectedGroupForTemplate] = useState<string | null>(null);
  const [selectedGroupForImage, setSelectedGroupForImage] = useState<string | null>(null);
  const [selectedGroupForFile, setSelectedGroupForFile] = useState<string | null>(null);
  const [showFileEditor, setShowFileEditor] = useState(false);
  
  const { saveInstruction } = useInstructionStorage();
  const { theme } = useTheme();
  const { steps, addStep, updateStep, deleteStep, copyStep, reorderSteps, setSteps } = useSteps();
  const { 
    groups, 
    ungroupedSteps, 
    createGroup, 
    updateGroup, 
    deleteGroup, 
    addStepToGroup,
    updateStepInGroup,
    getAllSteps,
    setUngroupedSteps,
    getStepById
  } = useStepGroups();
  const { loadAutosave, clearAutosave } = useAutosave(instructionTitle, instructionDescription, getAllSteps());

  // Регистрируем Service Worker для PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  // Загрузка автосохранения при запуске
  useEffect(() => {
    const autosaved = loadAutosave();
    if (autosaved && autosaved.steps.length > 0) {
      const shouldRestore = window.confirm('Найдено автосохранение. Восстановить?');
      if (shouldRestore) {
        setInstructionTitle(autosaved.title);
        setInstructionDescription(autosaved.description);
        setSteps(autosaved.steps);
        // Разделяем шаги на группированные и неформированные
        const groupedSteps = autosaved.steps.filter(step => step.groupId);
        const unGroupedSteps = autosaved.steps.filter(step => !step.groupId);
        setUngroupedSteps(unGroupedSteps);
        toast.success('Автосохранение восстановлено');
      }
    }
  }, []);

  const handleAddStep = (type: 'text' | 'image' | 'code' | 'html' | 'file', fileData?: { name: string; type: string; data: string }) => {
    let newStep: Step;

    if (type === 'image' && fileData) {
      newStep = {
        id: Date.now().toString(),
        type: 'image',
        content: '',
        imageUrl: fileData.data,
        title: 'Новое изображение'
      };
      setSteps(prev => [...prev, newStep]);
      setUngroupedSteps(prev => [...prev, newStep]);
      toast.success('Изображение добавлено');
      return;
    }

    if (type === 'image') {
      setEditingImageStepId(null);
      setShowImageEditor(true);
      return;
    }

    if (type === 'html') {
      newStep = {
        id: Date.now().toString(),
        type: 'html',
        content: '<p>Введите HTML код здесь</p>',
        title: 'HTML блок'
      };
      setSteps(prev => [...prev, newStep]);
      setUngroupedSteps(prev => [...prev, newStep]);
      toast.success('HTML-блок добавлен');
      return;
    }

    const createdStep = addStep(type, fileData);
    setUngroupedSteps(prev => [...prev, createdStep]);
    
    const typeNames: Record<string, string> = {
      text: 'Текст',
      code: 'Код',
      file: 'Файл'
    };
    toast.success(`Добавлен новый шаг: ${typeNames[type] || type}`);
  };

  const handleAddStepToGroup = (groupId: string, type: 'text' | 'image' | 'code' | 'html' | 'file') => {
    if (type === 'html') {
      // Открываем селектор HTML шаблонов с передачей groupId
      setSelectedGroupForTemplate(groupId);
      setShowHtmlTemplateSelector(true);
      return;
    }

    if (type === 'image') {
      // Открываем редактор изображений с передачей groupId
      setSelectedGroupForImage(groupId);
      setShowImageEditor(true);
      return;
    }

    if (type === 'file') {
      // Открываем редактор файлов с передачей groupId
      setSelectedGroupForFile(groupId);
      setShowFileEditor(true);
      return;
    }

    let newStep: Step;

    switch (type) {
      case 'text':
        newStep = {
          id: Date.now().toString(),
          type: 'text',
          content: 'Введите текст здесь',
          title: 'Новый текст',
          groupId
        };
        break;
      case 'code':
        newStep = {
          id: Date.now().toString(),
          type: 'code',
          content: '// Введите код здесь',
          title: 'Новый код',
          language: 'javascript',
          groupId
        };
        break;
      default:
        return;
    }

    // Добавляем шаг в группу
    const group = groups.find(g => g.id === groupId);
    if (group) {
      updateGroup(groupId, { steps: [...group.steps, newStep] });
      setSteps(prev => [...prev, newStep]);
      toast.success(`Шаг добавлен в группу`);
    }
  };

  const handleUpdateStep = (updatedStep: Step) => {
    updateStep(updatedStep);
    updateStepInGroup(updatedStep);
  };

  const handleEditImage = (stepId: string) => {
    setEditingImageStepId(stepId);
    setShowImageEditor(true);
  };

  const handleImageSave = (imageUrl: string, stepId?: string) => {
    if (stepId) {
      const step = getStepById(stepId);
      if (step) {
        const updatedStep = { ...step, imageUrl };
        handleUpdateStep(updatedStep);
        toast.success('Изображение обновлено');
      }
    } else {
      const newStep: Step = {
        id: Date.now().toString(),
        type: 'image',
        content: '',
        imageUrl,
        title: 'Новое изображение',
        groupId: selectedGroupForImage || undefined
      };
      
      if (selectedGroupForImage) {
        // Добавляем в группу
        const group = groups.find(g => g.id === selectedGroupForImage);
        if (group) {
          updateGroup(selectedGroupForImage, { steps: [...group.steps, newStep] });
          setSteps(prev => [...prev, newStep]);
          toast.success('Изображение добавлено в группу');
        }
      } else {
        // Добавляем в неформированные шаги
        setSteps(prev => [...prev, newStep]);
        setUngroupedSteps(prev => [...prev, newStep]);
        toast.success('Изображение добавлено');
      }
    }
    setShowImageEditor(false);
    setEditingImageStepId(null);
    setSelectedGroupForImage(null);
  };

  const handleFileSave = (fileData: { name: string; type: string; data: string }) => {
    const newStep: Step = {
      id: Date.now().toString(),
      type: 'file',
      content: `<a href="${fileData.data}" download="${fileData.name}">📎 ${fileData.name}</a>`,
      title: fileData.name,
      fileName: fileData.name,
      fileType: fileData.type,
      fileData: fileData.data,
      groupId: selectedGroupForFile || undefined
    };
    
    if (selectedGroupForFile) {
      // Добавляем в группу
      const group = groups.find(g => g.id === selectedGroupForFile);
      if (group) {
        updateGroup(selectedGroupForFile, { steps: [...group.steps, newStep] });
        setSteps(prev => [...prev, newStep]);
        toast.success('Файл добавлен в группу');
      }
    } else {
      // Добавляем в неформированные шаги
      setSteps(prev => [...prev, newStep]);
      setUngroupedSteps(prev => [...prev, newStep]);
      toast.success('Файл добавлен');
    }
    
    setShowFileEditor(false);
    setSelectedGroupForFile(null);
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
        setUngroupedSteps(prev => [...prev, newStep]);
        toast.success('Изображение добавлено из буфера обмена');
      }
    } catch (error) {
      toast.error('Ошибка при вставке изображения из буфера обмена');
    }
  };

  const handleSave = () => {
    const allSteps = getAllSteps();
    if (allSteps.length === 0) {
      toast.error('Добавьте хотя бы один шаг');
      return;
    }
    
    const success = saveInstruction(instructionTitle, instructionDescription, allSteps);
    if (success) {
      clearAutosave();
      toast.success('Инструкция сохранена');
    } else {
      toast.error('Ошибка сохранения');
    }
  };

  const handleSaveWithTheme = (selectedTheme: Theme) => {
    const allSteps = getAllSteps();
    if (allSteps.length === 0) {
      toast.error('Добавьте хотя бы один шаг');
      return;
    }
    
    const success = saveInstruction(instructionTitle, instructionDescription, allSteps);
    if (success) {
      clearAutosave();
      toast.success(`Инструкция сохранена с темой: ${selectedTheme === 'light' ? 'Светлая' : selectedTheme === 'gray' ? 'Серая' : 'Тёмная'}`);
    } else {
      toast.error('Ошибка сохранения');
    }
  };

  const handleExportWithOptions = (options: {
    format: 'html' | 'markdown' | 'json';
    password?: string;
    theme: 'light' | 'gray' | 'dark';
  }) => {
    const allSteps = getAllSteps();
    if (allSteps.length === 0) {
      toast.error('Нет шагов для экспорта');
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const baseFilename = `${instructionTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}`;
    
    try {
      let content: string;
      let mimeType: string;
      let extension: string;
      
      switch (options.format) {
        case 'html':
          content = exportToHTML(instructionTitle, instructionDescription, allSteps, groups, options.password);
          mimeType = 'text/html';
          extension = 'html';
          break;
        
        case 'markdown':
          content = exportToMarkdown(instructionTitle, instructionDescription, allSteps);
          mimeType = 'text/markdown';
          extension = 'md';
          break;
        
        case 'json':
          const jsonData = {
            title: instructionTitle,
            description: instructionDescription,
            steps: allSteps,
            groups: groups,
            exportedAt: new Date().toISOString()
          };
          content = JSON.stringify(jsonData, null, 2);
          mimeType = 'application/json';
          extension = 'json';
          break;
          
        default:
          throw new Error('Неподдерживаемый формат');
      }
      
      downloadFile(content, `${baseFilename}.${extension}`, mimeType);
      
      const blob = new Blob([content], { type: mimeType });
      const dataUrl = URL.createObjectURL(blob);
      setQrUrl(dataUrl);
      
      toast.success(`Экспорт в ${options.format.toUpperCase()} завершен${options.password ? ' с защитой паролем' : ''}`);
    } catch (error) {
      console.error('Ошибка экспорта:', error);
      toast.error('Ошибка при экспорте');
    }
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        
        if (jsonData.title && jsonData.steps) {
          setInstructionTitle(jsonData.title);
          setInstructionDescription(jsonData.description || '');
          setSteps(jsonData.steps);
          
          // Разделяем шаги на группированные и неформированные
          const unGroupedSteps = jsonData.steps.filter((step: Step) => !step.groupId);
          setUngroupedSteps(unGroupedSteps);
          
          clearAutosave();
          toast.success('Инструкция импортирована');
        } else {
          toast.error('Неверный формат файла');
        }
      } catch (error) {
        toast.error('Ошибка при импорте файла');
      }
    };
    reader.readAsText(file);
  };

  const handleLoadProject = (title: string, description: string, projectSteps: Step[]) => {
    setInstructionTitle(title);
    setInstructionDescription(description);
    setSteps(projectSteps);
    // Разделяем шаги на группированные и неформированные
    const unGroupedSteps = projectSteps.filter(step => !step.groupId);
    setUngroupedSteps(unGroupedSteps);
    clearAutosave();
    toast.success('Проект загружен');
  };

  const handlePreviewProject = (title: string, description: string, projectSteps: Step[]) => {
    setPreviewData({ title, description, steps: projectSteps });
    setShowPreview(true);
    setShowSavedProjects(false);
  };

  const handlePreviewCurrent = () => {
    const allSteps = getAllSteps();
    if (allSteps.length === 0) {
      toast.error('Нет шагов для предпросмотра');
      return;
    }
    setPreviewData({ title: instructionTitle, description: instructionDescription, steps: allSteps });
    setShowPreview(true);
  };

  const handleSelectHtmlTemplate = (htmlContent: string, title: string) => {
    const newStep: Step = {
      id: Date.now().toString(),
      type: 'html',
      content: htmlContent,
      title: title,
      groupId: selectedGroupForTemplate || undefined
    };
    
    if (selectedGroupForTemplate) {
      // Добавляем в группу
      const group = groups.find(g => g.id === selectedGroupForTemplate);
      if (group) {
        updateGroup(selectedGroupForTemplate, { steps: [...group.steps, newStep] });
        setSteps(prev => [...prev, newStep]);
        toast.success(`HTML-блок добавлен в группу: ${title}`);
      }
    } else {
      // Добавляем в неформированные шаги
      setSteps(prev => [...prev, newStep]);
      setUngroupedSteps(prev => [...prev, newStep]);
      toast.success(`Добавлен HTML-блок: ${title}`);
    }
    
    setShowHtmlTemplateSelector(false);
    setSelectedGroupForTemplate(null);
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
          groups={groups}
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
            setSelectedGroupForImage(null);
          }}
          stepId={editingImageStepId}
          initialImageUrl={editingImageStepId ? getStepById(editingImageStepId)?.imageUrl : undefined}
        />
      )}

      {showHtmlTemplateSelector && (
        <HtmlTemplateSelector
          onSelectTemplate={handleSelectHtmlTemplate}
          onCancel={() => {
            setShowHtmlTemplateSelector(false);
            setSelectedGroupForTemplate(null);
          }}
        />
      )}

      {showFileEditor && (
        <FileEditor
          step={{
            id: '',
            type: 'file',
            content: '',
            title: 'Новый файл'
          }}
          onSave={(step) => {
            if (step.fileData && step.fileName && step.fileType) {
              handleFileSave({
                name: step.fileName,
                type: step.fileType,
                data: step.fileData
              });
            }
          }}
          onCancel={() => {
            setShowFileEditor(false);
            setSelectedGroupForFile(null);
          }}
        />
      )}

      {showQRGenerator && (
        <QRCodeGenerator
          onClose={() => setShowQRGenerator(false)}
          defaultUrl={qrUrl}
        />
      )}

      {showSaveOptions && (
        <SaveOptionsDialog
          isOpen={showSaveOptions}
          onClose={() => setShowSaveOptions(false)}
          onSave={handleExportWithOptions}
        />
      )}
      
      <Sidebar
        onAddStep={handleAddStep}
        onAddHtmlWithTemplate={() => {
          setSelectedGroupForTemplate(null);
          setShowHtmlTemplateSelector(true);
        }}
        onLoadImage={() => {
          setSelectedGroupForImage(null);
          setShowImageEditor(true);
        }}
        onPasteImage={handlePasteImage}
        onSave={handleSave}
        onExport={() => setShowSaveOptions(true)}
        onImportJSON={handleImportJSON}
        onGenerateQR={() => setShowQRGenerator(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenSavedProjects={() => setShowSavedProjects(true)}
      />
      
      <MainArea
        steps={getAllSteps()}
        groups={groups}
        ungroupedSteps={ungroupedSteps}
        onStepsChange={(newSteps) => {
          setSteps(newSteps);
          setUngroupedSteps(newSteps.filter(step => !step.groupId));
        }}
        onCreateGroup={createGroup}
        onUpdateGroup={updateGroup}
        onDeleteGroup={deleteGroup}
        instructionTitle={instructionTitle}
        onTitleChange={setInstructionTitle}
        instructionDescription={instructionDescription}
        onDescriptionChange={setInstructionDescription}
        onPreview={handlePreviewCurrent}
        onEditImage={handleEditImage}
        onUpdateStep={handleUpdateStep}
        onDeleteStep={deleteStep}
        onCopyStep={copyStep}
        onAddStepToGroup={handleAddStepToGroup}
        onAddHtmlWithTemplate={(groupId) => {
          setSelectedGroupForTemplate(groupId || null);
          setShowHtmlTemplateSelector(true);
        }}
        onLoadImage={(groupId) => {
          setSelectedGroupForImage(groupId || null);
          setShowImageEditor(true);
        }}
        onAddFileToGroup={(groupId) => {
          setSelectedGroupForFile(groupId);
          setShowFileEditor(true);
        }}
      />
    </div>
  );
};

export default Index;
