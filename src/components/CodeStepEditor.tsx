
import React from 'react';
import { Button } from '@/components/ui/button';
import { Step } from './StepEditor';
import { toast } from 'sonner';

interface CodeStepEditorProps {
  step: Step;
}

const CodeStepEditor: React.FC<CodeStepEditorProps> = ({ step }) => {
  const handleCopyCode = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(step.content);
      toast.success('Код скопирован');
      
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

  return (
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
  );
};

export default CodeStepEditor;
