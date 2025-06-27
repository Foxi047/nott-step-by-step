
import React, { useState, useRef } from 'react';
import { Plus, Upload, Save, Download, FileText, Settings, FolderOpen, Clipboard, Code, Paperclip, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SidebarProps {
  onAddStep: (type: 'text' | 'image' | 'code' | 'html' | 'file', fileData?: { name: string; type: string; data: string }) => void;
  onAddHtmlWithTemplate: () => void;
  onLoadImage: () => void;
  onPasteImage: () => void;
  onSave: () => void;
  onExport: (format: 'html' | 'markdown' | 'json') => void;
  onOpenSettings: () => void;
  onOpenSavedProjects: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onAddStep,
  onAddHtmlWithTemplate,
  onLoadImage,
  onPasteImage,
  onSave,
  onExport,
  onOpenSettings,
  onOpenSavedProjects
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onAddStep('file', {
        name: file.name,
        type: file.type,
        data: result
      });
      toast.success('Файл добавлен');
    };
    reader.readAsDataURL(file);
  };

  const SidebarContent = () => (
    <div className="h-full bg-slate-900 border-r border-slate-700 p-4 sm:p-6 flex flex-col gap-4 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-white mb-2">Nott Instructions</h1>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Добавить элемент</h3>
        
        <Button 
          onClick={() => onAddStep('text')} 
          className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white min-h-[44px]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить текст
        </Button>

        <Button 
          onClick={() => onAddStep('code')} 
          className="w-full justify-start bg-green-600 hover:bg-green-700 text-white min-h-[44px]"
        >
          <FileText className="w-4 h-4 mr-2" />
          Добавить код
        </Button>

        <Button 
          onClick={onAddHtmlWithTemplate} 
          className="w-full justify-start bg-orange-600 hover:bg-orange-700 text-white min-h-[44px]"
        >
          <Code className="w-4 h-4 mr-2" />
          HTML-блок с шаблоном
        </Button>

        <Button 
          onClick={() => onAddStep('image')} 
          className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white min-h-[44px]"
        >
          <Upload className="w-4 h-4 mr-2" />
          Загрузить изображение
        </Button>

        <Button 
          onClick={onPasteImage} 
          className="w-full justify-start bg-cyan-600 hover:bg-cyan-700 text-white min-h-[44px]"
        >
          <Clipboard className="w-4 h-4 mr-2" />
          Из буфера обмена
        </Button>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.zip,.rar,.xlsx,.ppt,.pptx"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full justify-start bg-yellow-600 hover:bg-yellow-700 text-white min-h-[44px]"
          >
            <Paperclip className="w-4 h-4 mr-2" />
            Прикрепить файл
          </Button>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-4 space-y-3 mt-auto">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Действия</h3>
        
        <Button 
          onClick={onSave} 
          className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white min-h-[44px]"
        >
          <Save className="w-4 h-4 mr-2" />
          Сохранить
        </Button>

        <Button 
          onClick={onOpenSavedProjects} 
          className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white min-h-[44px]"
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          Сохранённые проекты
        </Button>

        <div className="space-y-2">
          <Button 
            onClick={() => onExport('html')} 
            className="w-full justify-start bg-orange-600 hover:bg-orange-700 text-white min-h-[44px]"
          >
            <Download className="w-4 h-4 mr-2" />
            Экспорт в HTML
          </Button>
          
          <Button 
            onClick={() => onExport('markdown')} 
            className="w-full justify-start bg-yellow-600 hover:bg-yellow-700 text-white min-h-[44px]"
          >
            <Download className="w-4 h-4 mr-2" />
            Экспорт в Markdown
          </Button>
          
          <Button 
            onClick={() => onExport('json')} 
            className="w-full justify-start bg-cyan-600 hover:bg-cyan-700 text-white min-h-[44px]"
          >
            <Download className="w-4 h-4 mr-2" />
            Экспорт в JSON
          </Button>
        </div>

        <Button 
          onClick={onOpenSettings} 
          className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white min-h-[44px]"
        >
          <Settings className="w-4 h-4 mr-2" />
          Настройки
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-slate-800 hover:bg-slate-700 text-white md:hidden min-w-[44px] min-h-[44px]"
        size="sm"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-72">
        <SidebarContent />
      </div>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[90vw]">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
