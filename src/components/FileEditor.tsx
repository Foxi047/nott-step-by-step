
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, Save, X } from 'lucide-react';
import { Step } from '../types/Step';

interface FileEditorProps {
  step: Step;
  onSave: (updatedStep: Step) => void;
  onCancel: () => void;
}

const FileEditor: React.FC<FileEditorProps> = ({
  step,
  onSave,
  onCancel
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const updatedStep: Step = {
        ...step,
        title: file.name,
        fileName: file.name,
        fileType: file.type,
        fileData: result,
        content: `<a href="${result}" download="${file.name}">📎 ${file.name}</a>`
      };
      
      onSave(updatedStep);
      toast.success('Файл обновлен');
    };
    reader.readAsDataURL(file);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Редактирование файла</h2>
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 rounded border border-slate-700 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-2xl">{getFileIcon()}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{step.fileName}</p>
                <p className="text-xs text-slate-400">{step.fileType}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.zip,.rar,.xlsx,.ppt,.pptx"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Загрузить новый файл
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileEditor;
