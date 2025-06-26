
import React from 'react';
import { Plus, Upload, Edit, Copy, Save, Download, RotateCw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SidebarProps {
  onAddStep: (type: 'text' | 'image' | 'code') => void;
  onLoadImage: () => void;
  onSave: () => void;
  onExport: (format: 'html' | 'markdown' | 'json') => void;
  isVerticalLayout: boolean;
  onLayoutChange: (vertical: boolean) => void;
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onAddStep,
  onLoadImage,
  onSave,
  onExport,
  isVerticalLayout,
  onLayoutChange,
  selectedTemplate,
  onTemplateChange
}) => {
  return (
    <div className="w-72 bg-slate-900 border-r border-slate-700 p-6 flex flex-col gap-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-2">Nott Instructions</h1>
        <p className="text-sm text-slate-400">Создатель инструкций</p>
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
      </div>

      <div className="border-t border-slate-700 pt-4 space-y-3">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Настройки</h3>
        
        <div className="space-y-2">
          <Label htmlFor="template-select" className="text-sm text-slate-300">
            Шаблон
          </Label>
          <Select value={selectedTemplate} onValueChange={onTemplateChange}>
            <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="default">Стандартный</SelectItem>
              <SelectItem value="minimal">Минимальный</SelectItem>
              <SelectItem value="detailed">Детальный</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="layout-switch"
            checked={isVerticalLayout}
            onCheckedChange={onLayoutChange}
          />
          <Label htmlFor="layout-switch" className="text-sm text-slate-300">
            Вертикальная прокрутка
          </Label>
        </div>
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
      </div>
    </div>
  );
};

export default Sidebar;
