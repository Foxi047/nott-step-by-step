
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

interface FileUploaderProps {
  onSave: (fileData: { name: string; type: string; data: string }) => void;
  onCancel: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
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
      onSave({
        name: file.name,
        type: file.type,
        data: result
      });
      toast.success('Файл загружен');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Загрузить файл</h2>
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="text-center py-8 border-2 border-dashed border-slate-600 rounded-lg">
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
              Выбрать файл
            </Button>
            <p className="text-sm text-slate-400 mt-2">
              PDF, DOC, TXT, ZIP, RAR, XLSX, PPT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
