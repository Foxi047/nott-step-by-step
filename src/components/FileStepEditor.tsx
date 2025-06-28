import React from 'react';
import { FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Step } from '../types/Step';

interface FileStepEditorProps {
  step: Step;
}

const FileStepEditor: React.FC<FileStepEditorProps> = ({ step }) => {
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

  const getFileIcon = () => {
    if (!step.fileType) return '📎';
    
    if (step.fileType.includes('pdf')) return '📄';
    if (step.fileType.includes('image')) return '🖼️';
    if (step.fileType.includes('zip') || step.fileType.includes('rar')) return '📦';
    if (step.fileType.includes('doc')) return '📝';
    if (step.fileType.includes('sheet') || step.fileType.includes('excel')) return '📊';
    if (step.fileType.includes('presentation')) return '📋';
    
    return '📎';
  };

  return (
    <div className="bg-slate-900 rounded border border-slate-700 p-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="text-2xl">{getFileIcon()}</div>
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
  );
};

export default FileStepEditor;
