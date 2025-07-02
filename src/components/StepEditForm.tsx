
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
import { Step } from '../types/Step';
import StepStyleSelector from './StepStyleSelector';
import TextFormattingToolbar from './TextFormattingToolbar';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsertFormat = (format: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = editContent.substring(start, end);
      
      let newContent = '';
      
      if (format === '[COPY]') {
        // Найти начало текущей строки
        const beforeCursor = editContent.substring(0, start);
        const lineStart = beforeCursor.lastIndexOf('\n') + 1;
        const lineEnd = editContent.indexOf('\n', start);
        const actualLineEnd = lineEnd === -1 ? editContent.length : lineEnd;
        
        // Вставить маркер в начало строки
        newContent = editContent.substring(0, lineStart) + '[COPY]' + editContent.substring(lineStart);
        
        // Установить курсор после маркера
        setTimeout(() => {
          textarea.focus();
          const newPos = lineStart + 6; // длина '[COPY]'
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
      } else if (selectedText) {
        // Replace selected text with formatted version
        if (format.includes('текст')) {
          newContent = editContent.substring(0, start) + format.replace('текст', selectedText) + editContent.substring(end);
        } else {
          newContent = editContent.substring(0, start) + format + editContent.substring(end);
        }
        
        // Set focus back to textarea
        setTimeout(() => {
          textarea.focus();
          const newPos = start + format.length;
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
      } else {
        // Insert at cursor position
        newContent = editContent.substring(0, start) + format + editContent.substring(end);
        
        // Set focus back to textarea
        setTimeout(() => {
          textarea.focus();
          const newPos = start + format.length;
          textarea.setSelectionRange(newPos, newPos);
        }, 0);
      }
      
      onContentChange(newContent);
    }
  };

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
      
      {step.type === 'text' && (
        <TextFormattingToolbar onInsertFormat={handleInsertFormat} />
      )}
      
      <Textarea
        ref={textareaRef}
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
