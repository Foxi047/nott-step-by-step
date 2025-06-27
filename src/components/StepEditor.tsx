
import React, { useState } from 'react';
import { Copy, Trash2, Edit, Check, X, GripVertical, FileIcon, EditIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export interface Step {
  id: string;
  type: 'text' | 'image' | 'code' | 'html' | 'file';
  content: string;
  title?: string;
  language?: string;
  imageUrl?: string;
  annotations?: any[];
  fileData?: string; // base64 данные файла
  fileName?: string;
  fileType?: string;
}

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

  const handleCopyCode = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(step.content);
      toast.success('Код скопирован');
      
      // Визуальная обратная связь
      const button = event.currentTarget as HTMLButtonElement;
      const originalContent = button.innerHTML;
      button.innerHTML = '✅';
      setTimeout(() => {
        button.innerHTML = originalContent;
      }, 1500);
    } catch (err) {
      toast.error('Ошибка копирования кода');
    }
  };

  const getStepIcon = () => {
    switch (step.type) {
      case 'text': return '📝';
      case 'code': return '💻';
      case 'image': return '🖼️';
      case 'html': return '🌐';
      case 'file': return '📎';
      default: return '📄';
    }
  };

  const handleFileDownload = () => {
    if (step.fileData && step.fileName) {
      const link = document.createElement('a');
      link.href = step.fileData;
      link.download = step.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 sm:p-4 mb-4 group hover:border-slate-600 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing touch-manipulation">
            <GripVertical className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-lg">{getStepIcon()}</span>
          <span className="text-xs sm:text-sm text-slate-400 capitalize">{step.type}</span>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {step.type === 'image' && onEditImage && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEditImage(step.id)}
              className="text-purple-400 hover:text-purple-300 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
            >
              <EditIcon className="w-4 h-4" />
            </Button>
          )}
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
            <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto">
              <Check className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Сохранить</span>
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="border-slate-600 text-slate-300 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto">
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
          
          {step.type === 'image' && step.imageUrl ? (
            <div className="relative">
              <div className="inline-block max-w-full">
                <img 
                  src={step.imageUrl} 
                  alt={step.title || 'Изображение'} 
                  className="max-w-full h-auto rounded border border-slate-600 block"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              {step.content && (
                <p className="text-xs sm:text-sm text-slate-300 mt-2 break-words">{step.content}</p>
              )}
            </div>
          ) : step.type === 'code' ? (
            <div className="bg-slate-900 rounded border border-slate-700 p-3 overflow-x-auto relative">
              {step.language && (
                <div className="text-xs text-slate-400 mb-2">{step.language}</div>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyCode}
                className="absolute top-2 right-2 text-slate-400 hover:text-white p-1 h-8 w-8"
                title="Копировать код"
              >
                📋
              </Button>
              <pre className="text-xs sm:text-sm text-green-400 overflow-x-auto whitespace-pre-wrap break-words pr-10">
                <code>{step.content}</code>
              </pre>
            </div>
          ) : step.type === 'html' ? (
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
                <div className="bg-slate-900 rounded border border-slate-700 p-3 overflow-x-auto relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyCode}
                    className="absolute top-2 right-2 text-slate-400 hover:text-white p-1 h-8 w-8"
                    title="Копировать HTML"
                  >
                    📋
                  </Button>
                  <pre className="text-xs sm:text-sm text-green-400 whitespace-pre-wrap break-words pr-10">
                    <code>{step.content}</code>
                  </pre>
                </div>
              )}
            </div>
          ) : step.type === 'file' ? (
            <div className="bg-slate-900 rounded border border-slate-700 p-3">
              <div className="flex items-center gap-3 flex-wrap">
                <FileIcon className="w-6 h-6 text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{step.fileName}</p>
                  <p className="text-xs text-slate-400">{step.fileType}</p>
                </div>
                <Button
                  size="sm"
                  onClick={handleFileDownload}
                  className="bg-blue-600 hover:bg-blue-700 flex-shrink-0 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
                >
                  Скачать
                </Button>
              </div>
              {step.content && (
                <p className="text-xs sm:text-sm text-slate-300 mt-2 break-words">{step.content}</p>
              )}
            </div>
          ) : (
            <div className="text-slate-200 whitespace-pre-wrap break-words text-sm sm:text-base">
              {step.content}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepEditor;
