
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
import { Step } from '../types/Step';
import StepStyleSelector from './StepStyleSelector';

interface StepEditFormProps {
  step: Step;
  editTitle: string;
  editContent: string;
  editLanguage: string;
  showHtmlPreview: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onLanguageChange: (language: string) => void;
  onHtmlPreviewToggle: (show: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  onStyleChange: (style: any) => void;
}

const StepEditForm: React.FC<StepEditFormProps> = ({
  step,
  editTitle,
  editContent,
  editLanguage,
  showHtmlPreview,
  onTitleChange,
  onContentChange,
  onLanguageChange,
  onHtmlPreviewToggle,
  onSave,
  onCancel,
  onStyleChange
}) => {
  return (
    <div className="space-y-3">
      <Input
        placeholder="Заголовок шага"
        value={editTitle}
        onChange={(e) => onTitleChange(e.target.value)}
        className="bg-slate-700 border-slate-600 text-white"
      />
      
      <StepStyleSelector
        currentStyle={step.style}
        onStyleChange={onStyleChange}
      />
      
      {step.type === 'code' && (
        <Input
          placeholder="Язык программирования"
          value={editLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white"
        />
      )}

      {step.type === 'html' && (
        <div className="flex gap-2 mb-2">
          <Button
            size="sm"
            onClick={() => onHtmlPreviewToggle(false)}
            variant={!showHtmlPreview ? 'default' : 'outline'}
            className="text-xs"
          >
            Код
          </Button>
          <Button
            size="sm"
            onClick={() => onHtmlPreviewToggle(true)}
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
        onChange={(e) => onContentChange(e.target.value)}
        rows={step.type === 'code' || step.type === 'html' ? 6 : 3}
        className="bg-slate-700 border-slate-600 text-white font-mono"
      />
      
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" onClick={onSave} className="bg-green-600 hover:bg-green-700">
          <Check className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Сохранить</span>
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} className="border-slate-600 text-slate-300">
          <X className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">Отмена</span>
        </Button>
      </div>
    </div>
  );
};

export default StepEditForm;
