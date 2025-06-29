
import React from 'react';
import { Step } from '../types/Step';
import ImageStepEditor from './ImageStepEditor';
import FileStepEditor from './FileStepEditor';
import CodeStepEditor from './CodeStepEditor';
import { Button } from '@/components/ui/button';

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
