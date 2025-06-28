
import React, { useState } from 'react';
import { Copy, Trash2, Edit, Check, X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Step, StepStyle } from '../types/Step';
import ImageStepEditor from './ImageStepEditor';
import FileStepEditor from './FileStepEditor';
import CodeStepEditor from './CodeStepEditor';
import StepStyleSelector from './StepStyleSelector';

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(step.content);
      toast.success('Скопировано в буфер обмена');
      onCopy(step);
    } catch (err) {
      toast.error('Ошибка копирования');
    }
  };

  const handleStyleChange = (style: StepStyle) => {
    onUpdate({ ...step, style });
  };

  const getStepIcon = () => {
    if (step.style?.icon) {
      return step.style.icon;
    }
    
    switch (step.type) {
      case 'text': return '📝';
      case 'code': return '💻';
      case 'image': return '🖼️';
      case 'html': return '🌐';
      case 'file': return '📎';
      default: return '📄';
    }
  };

  const getStepClasses = () => {
    const baseClasses = 'border rounded-lg p-3 sm:p-4 mb-4 group hover:border-slate-600 transition-colors';
    
    switch (step.style?.type) {
      case 'info':
        return `${baseClasses} bg-blue-900 border-blue-700`;
      case 'warning':
        return `${baseClasses} bg-yellow-900 border-yellow-700`;
      case 'success':
        return `${baseClasses} bg-green-900 border-green-700`;
      case 'error':
        return `${baseClasses} bg-red-900 border-red-700`;
      default:
        return `${baseClasses} bg-slate-800 border-slate-700`;
    }
  };

  const renderStepContent = () => {
    if (step.type === 'image' && step.imageUrl) {
      return <ImageStepEditor step={step} onEditImage={onEditImage} />;
    }
    
    if (step.type === 'code') {
      return <CodeStepEditor step={step} />;
    }
    
    if (step.type === 'file') {
      return <FileStepEditor step={step} />;
    }
    
    if (step.type === 'html') {
      return (
        <div className="space-y-2">
          <div className="flex gap-2 mb-2">
            <Button
              size="sm"
              onClick={() => setShowHtmlPreview(false)}
              variant={!showHtmlPreview ? 'default' : 'outline'}
              className="text-xs"
            >
              Код
            </Button>
            <Button
              size="sm"
              onClick={() => setShowHtmlPreview(true)}
              variant={showHtmlPreview ? 'default' : 'outline'}
              className="text-xs"
            >
              Предпросмотр
            </Button>
          </div>
          {showHtmlPreview ? (
            <div 
              className="bg-white rounded border border-slate-700 p-3 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: step.content }}
            />
          ) : (
            <div className="bg-slate-900 rounded border border-slate-700 p-3 overflow-x-auto">
              <pre className="text-xs sm:text-sm text-green-400 whitespace-pre-wrap break-words">
                <code>{step.content}</code>
              </pre>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="text-slate-200 whitespace-pre-wrap break-words text-sm sm:text-base">
        {step.content}
      </div>
    );
  };

  return (
    <div className={getStepClasses()}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing touch-manipulation">
            <GripVertical className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-lg">{getStepIcon()}</span>
          <span className="text-xs sm:text-sm text-slate-400 capitalize">{step.type}</span>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-400 hover:text-blue-300 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="text-green-400 hover:text-green-300 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              onDelete(step.id);
              toast.success('Шаг удален');
            }}
            className="text-red-400 hover:text-red-300 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Input
            placeholder="Заголовок шага"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
          
          <StepStyleSelector
            currentStyle={step.style}
            onStyleChange={handleStyleChange}
          />
          
          {step.type === 'code' && (
            <Input
              placeholder="Язык программирования"
              value={editLanguage}
              onChange={(e) => setEditLanguage(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          )}

          {step.type === 'html' && (
            <div className="flex gap-2 mb-2">
              <Button
                size="sm"
                onClick={() => setShowHtmlPreview(false)}
                variant={!showHtmlPreview ? 'default' : 'outline'}
                className="text-xs"
              >
                Код
              </Button>
              <Button
                size="sm"
                onClick={() => setShowHtmlPreview(true)}
                variant={showHtmlPreview ? 'default' : 'outline'}
                className="text-xs"
              >
                Предпросмотр
              </Button>
            </div>
          )}
          
          <Textarea
            placeholder={
              step.type === 'code' ? 'Код' : 
              step.type === 'html' ? 'HTML код' : 
              'Содержимое шага'
            }
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={step.type === 'code' || step.type === 'html' ? 6 : 3}
            className="bg-slate-700 border-slate-600 text-white font-mono"
          />
          
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Сохранить</span>
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="border-slate-600 text-slate-300">
              <X className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Отмена</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {step.title && (
            <h3 className="font-medium text-white text-sm sm:text-base break-words">{step.title}</h3>
          )}
          {renderStepContent()}
        </div>
      )}
    </div>
  );
};

export default StepEditor;
