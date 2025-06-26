
import React from 'react';
import { Plus, Upload, Save, Download, FileText, Settings, FolderOpen, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  onAddStep: (type: 'text' | 'image' | 'code') => void;
  onLoadImage: () => void;
  onPasteImage: () => void;
  onSave: () => void;
  onExport: (format: 'html' | 'markdown' | 'json') => void;
  onOpenSettings: () => void;
  onOpenSavedProjects: () => void;
  onAddStepTemplate: (template: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onAddStep,
  onLoadImage,
  onPasteImage,
  onSave,
  onExport,
  onOpenSettings,
  onOpenSavedProjects,
  onAddStepTemplate
}) => {
  return (
    <div className="w-72 bg-slate-900 border-r border-slate-700 p-6 flex flex-col gap-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-2">Nott Instructions</h1>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Добавить элемент</h3>
        
        <Button 
          onClick={() => onAddStep('text')} 
          className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить текст
        </Button>

        <Button 
          onClick={() => onAddStep('code')} 
          className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
        >
          <FileText className="w-4 h-4 mr-2" />
          Добавить код
        </Button>

        <Button 
          onClick={onLoadImage} 
          className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          Загрузить изображение
        </Button>

        <Button 
          onClick={onPasteImage} 
          className="w-full justify-start bg-orange-600 hover:bg-orange-700 text-white"
        >
          <Clipboard className="w-4 h-4 mr-2" />
          Из буфера обмена
        </Button>
      </div>

      <div className="border-t border-slate-700 pt-4 space-y-3">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Шаблоны шагов</h3>
        
        <Button 
          onClick={() => onAddStepTemplate('image-text')} 
          className="w-full justify-start bg-cyan-600 hover:bg-cyan-700 text-white text-xs"
        >
          <Plus className="w-4 h-4 mr-2" />
          Изображение + текст
        </Button>

        <Button 
          onClick={() => onAddStepTemplate('code-explanation')} 
          className="w-full justify-start bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
        >
          <Plus className="w-4 h-4 mr-2" />
          Код + объяснение
        </Button>
      </div>

      <div className="border-t border-slate-700 pt-4 space-y-3 mt-auto">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Действия</h3>
        
        <Button 
          onClick={onSave} 
          className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Сохранить
        </Button>

        <Button 
          onClick={onOpenSavedProjects} 
          className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white"
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          Сохранённые проекты
        </Button>

        <div className="space-y-2">
          <Button 
            onClick={() => onExport('html')} 
            className="w-full justify-start bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Экспорт в HTML
          </Button>
          
          <Button 
            onClick={() => onExport('markdown')} 
            className="w-full justify-start bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Экспорт в Markdown
          </Button>
          
          <Button 
            onClick={() => onExport('json')} 
            className="w-full justify-start bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Экспорт в JSON
          </Button>
        </div>

        <Button 
          onClick={onOpenSettings} 
          className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white"
        >
          <Settings className="w-4 h-4 mr-2" />
          Настройки
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
