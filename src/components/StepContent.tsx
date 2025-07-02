
import React, { useState } from 'react';
import { Step } from '../types/Step';
import ImageStepEditor from './ImageStepEditor';
import FileStepEditor from './FileStepEditor';
import CodeStepEditor from './CodeStepEditor';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface StepContentProps {
  step: Step;
  showHtmlPreview: boolean;
  onHtmlPreviewToggle: (show: boolean) => void;
  onEditImage?: (stepId: string) => void;
  onEditFile?: (step: Step) => void;
  onEditHtml?: (step: Step) => void;
}

const StepContent: React.FC<StepContentProps> = ({
  step,
  showHtmlPreview,
  onHtmlPreviewToggle,
  onEditImage,
  onEditFile,
  onEditHtml
}) => {
  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Текст скопирован в буфер обмена');
    } catch (error) {
      toast.error('Ошибка копирования текста');
    }
  };

  const renderTextWithCopyButtons = (content: string) => {
    // Разделяем текст на абзацы
    const paragraphs = content.split(/\n\s*\n/);
    
    return paragraphs.map((paragraph, index) => {
      if (!paragraph.trim()) return null;
      
      // Проверяем, начинается ли абзац с маркера [COPY]
      const isCopyable = paragraph.startsWith('[COPY]');
      const displayText = isCopyable ? paragraph.substring(6) : paragraph; // Убираем маркер [COPY]
      
      return (
        <div key={index} className="relative group mb-4 last:mb-0">
          <div className={`${isCopyable ? 'bg-blue-900/20 border border-blue-700 rounded p-3' : ''} relative`}>
            <div className="text-slate-200 whitespace-pre-wrap break-words text-sm sm:text-base">
              {isCopyable && <span className="text-blue-400 mr-2">⧉</span>}
              {displayText}
            </div>
            {isCopyable && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopyToClipboard(displayText)}
                className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white p-1 h-6 w-6 text-xs"
                title="Копировать абзац"
              >
                ⧉
              </Button>
            )}
          </div>
        </div>
      );
    }).filter(Boolean);
  };

  const renderStepContent = () => {
    if (step.type === 'image' && step.imageUrl) {
      return <ImageStepEditor step={step} onEditImage={onEditImage} />;
    }
    
    if (step.type === 'code') {
      return <CodeStepEditor step={step} />;
    }
    
    if (step.type === 'file') {
      return <FileStepEditor step={step} onEditFile={onEditFile} />;
    }
    
    if (step.type === 'html') {
      return (
        <div className="space-y-2">
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
            {onEditHtml && (
              <Button
                size="sm"
                onClick={() => onEditHtml(step)}
                className="text-xs bg-purple-600 hover:bg-purple-700"
              >
                Изменить шаблон
              </Button>
            )}
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
    
    // For text steps, render with copy buttons
    if (step.type === 'text') {
      return (
        <div className="space-y-2">
          {renderTextWithCopyButtons(step.content)}
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
    <div className="space-y-2">
      {step.title && (
        <h3 className="font-medium text-white text-sm sm:text-base break-words">{step.title}</h3>
      )}
      {renderStepContent()}
    </div>
  );
};

export default StepContent;
