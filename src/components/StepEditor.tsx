
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Step, StepStyle } from '../types/Step';
import StepHeader from './StepHeader';
import StepEditForm from './StepEditForm';
import StepContent from './StepContent';

interface StepEditorProps {
  step: Step;
  onUpdate: (step: Step) => void;
  onDelete: (id: string) => void;
  onCopy: (step: Step) => void;
  onEditImage?: (stepId: string) => void;
  dragHandleProps?: any;
}

const StepEditor: React.FC<StepEditorProps> = ({ 
  step, 
  onUpdate, 
  onDelete, 
  onCopy,
  onEditImage,
  dragHandleProps 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(step.title || '');
  const [editContent, setEditContent] = useState(step.content || '');
  const [editLanguage, setEditLanguage] = useState(step.language || 'javascript');
  const [showHtmlPreview, setShowHtmlPreview] = useState(true);

  const handleSave = () => {
    onUpdate({
      ...step,
      title: editTitle,
      content: editContent,
      language: step.type === 'code' ? editLanguage : step.language
    });
    setIsEditing(false);
    toast.success('Шаг обновлен');
  };

  const handleCancel = () => {
    setEditTitle(step.title || '');
    setEditContent(step.content || '');
    setEditLanguage(step.language || 'javascript');
    setIsEditing(false);
  };

  const handleCopy = () => {
    // Просто вызываем функцию копирования без попытки скопировать в буфер обмена
    onCopy(step);
  };

  const handleStyleChange = (style: StepStyle) => {
    onUpdate({ ...step, style });
  };

  const getStepClasses = () => {
    const baseClasses = 'border rounded-lg p-3 sm:p-4 mb-4 group hover:border-slate-600 transition-colors';
    
    if (!step.style?.type || step.style.type === 'default') {
      return `${baseClasses} bg-slate-800 border-slate-700`;
    }
    
    switch (step.style.type) {
      case 'info':
        return `${baseClasses} bg-blue-900/30 border-blue-700`;
      case 'warning':
        return `${baseClasses} bg-yellow-900/30 border-yellow-700`;
      case 'success':
        return `${baseClasses} bg-green-900/30 border-green-700`;
      case 'error':
        return `${baseClasses} bg-red-900/30 border-red-700`;
      default:
        return `${baseClasses} bg-slate-800 border-slate-700`;
    }
  };

  return (
    <div className={getStepClasses()}>
      <StepHeader
        step={step}
        isEditing={isEditing}
        onEdit={() => setIsEditing(!isEditing)}
        onCopy={handleCopy}
        onDelete={() => onDelete(step.id)}
        dragHandleProps={dragHandleProps}
      />

      {isEditing ? (
        <StepEditForm
          step={step}
          editTitle={editTitle}
          editContent={editContent}
          editLanguage={editLanguage}
          showHtmlPreview={showHtmlPreview}
          onTitleChange={setEditTitle}
          onContentChange={setEditContent}
          onLanguageChange={setEditLanguage}
          onHtmlPreviewToggle={setShowHtmlPreview}
          onSave={handleSave}
          onCancel={handleCancel}
          onStyleChange={handleStyleChange}
        />
      ) : (
        <StepContent
          step={step}
          showHtmlPreview={showHtmlPreview}
          onHtmlPreviewToggle={setShowHtmlPreview}
          onEditImage={onEditImage}
        />
      )}
    </div>
  );
};

export default StepEditor;
