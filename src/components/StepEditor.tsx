
import React, { useState } from 'react';
import { Copy, Trash2, Edit, Check, X, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export interface Step {
  id: string;
  type: 'text' | 'image' | 'code';
  content: string;
  title?: string;
  language?: string;
  imageUrl?: string;
  annotations?: any[];
}

interface StepEditorProps {
  step: Step;
  onUpdate: (step: Step) => void;
  onDelete: (id: string) => void;
  onCopy: (step: Step) => void;
  dragHandleProps?: any;
}

const StepEditor: React.FC<StepEditorProps> = ({ 
  step, 
  onUpdate, 
  onDelete, 
  onCopy,
  dragHandleProps 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(step.title || '');
  const [editContent, setEditContent] = useState(step.content || '');
  const [editLanguage, setEditLanguage] = useState(step.language || 'javascript');

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

  const getStepIcon = () => {
    switch (step.type) {
      case 'text': return '📝';
      case 'code': return '💻';
      case 'image': return '🖼️';
      default: return '📄';
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4 group hover:border-slate-600 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-lg">{getStepIcon()}</span>
          <span className="text-sm text-slate-400 capitalize">{step.type}</span>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(!isEditing)}
            className="text-blue-400 hover:text-blue-300"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="text-green-400 hover:text-green-300"
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
            className="text-red-400 hover:text-red-300"
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
          
          <Textarea
            placeholder={step.type === 'code' ? 'Код' : 'Содержимое шага'}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={step.type === 'code' ? 6 : 3}
            className="bg-slate-700 border-slate-600 text-white font-mono"
          />
          
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Check className="w-4 h-4 mr-1" />
              Сохранить
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="border-slate-600 text-slate-300">
              <X className="w-4 h-4 mr-1" />
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {step.title && (
            <h3 className="font-medium text-white">{step.title}</h3>
          )}
          
          {step.type === 'image' && step.imageUrl ? (
            <div className="relative">
              <img 
                src={step.imageUrl} 
                alt={step.title || 'Изображение'} 
                className="max-w-full h-auto rounded border border-slate-600"
              />
              {step.content && (
                <p className="text-sm text-slate-300 mt-2">{step.content}</p>
              )}
            </div>
          ) : step.type === 'code' ? (
            <div className="bg-slate-900 rounded border border-slate-700 p-3">
              {step.language && (
                <div className="text-xs text-slate-400 mb-2">{step.language}</div>
              )}
              <pre className="text-sm text-green-400 overflow-x-auto">
                <code>{step.content}</code>
              </pre>
            </div>
          ) : (
            <div className="text-slate-200 whitespace-pre-wrap">
              {step.content}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StepEditor;
