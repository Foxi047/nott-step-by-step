
import React, { useState, useRef } from 'react';
import { Plus, Upload, Save, Download, FileText, Settings, FolderOpen, Clipboard, Code, Paperclip, Menu, X, QrCode, FileUp, ChevronDown, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface SidebarProps {
  onAddStep: (type: 'text' | 'image' | 'code' | 'html' | 'file', fileData?: { name: string; type: string; data: string }) => void;
  onAddHtmlWithTemplate: () => void;
  onLoadImage: () => void;
  onPasteImage: () => void;
  onSave: () => void;
  onExport: (format: 'html' | 'markdown' | 'json') => void;
  onImportJSON: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateQR: () => void;
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
  onImportJSON,
  onGenerateQR,
  onOpenSettings,
  onOpenSavedProjects
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите изображение');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      onAddStep('image', {
        name: file.name,
        type: file.type,
        data: imageUrl
      });
      toast.success('Изображение добавлено');
    };
    reader.readAsDataURL(file);
  };

  const handlePasteImageClick = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      const imageItems = clipboardItems.filter(item => 
        item.types.some(type => type.startsWith('image/'))
      );
      
      if (imageItems.length === 0) {
        toast.error('В буфере обмена нет изображений');
        return;
      }

      const imageItem = imageItems[0];
      const imageType = imageItem.types.find(type => type.startsWith('image/'));
      
      if (imageType) {
        const blob = await imageItem.getType(imageType);
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          onAddStep('image', {
            name: 'clipboard-image.png',
            type: imageType,
            data: imageUrl
          });
          toast.success('Изображение добавлено из буфера обмена');
        };
        reader.readAsDataURL(blob);
      }
    } catch (error) {
      toast.error('Ошибка при вставке изображения из буфера обмена');
    }
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white min-h-[44px]">
              <Image className="w-4 h-4 mr-2" />
              Добавить изображение
              <ChevronDown className="w-4 h-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-slate-700 border-slate-600">
            <DropdownMenuItem 
              onClick={() => imageInputRef.current?.click()}
              className="text-white hover:bg-slate-600 cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-2" />
              Загрузить с устройства
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handlePasteImageClick}
              className="text-white hover:bg-slate-600 cursor-pointer"
            >
              <Clipboard className="w-4 h-4 mr-2" />
              Из буфера обмена
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          type="file"
          ref={imageInputRef}
          onChange={handleImageSelect}
          className="hidden"
          accept="image/*"
        />

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

        <div>
          <input
            type="file"
            ref={importInputRef}
            onChange={onImportJSON}
            accept=".json"
            className="hidden"
          />
          <Button 
            onClick={() => importInputRef.current?.click()}
            className="w-full justify-start bg-indigo-600 hover:bg-indigo-700 text-white min-h-[44px]"
          >
            <FileUp className="w-4 h-4 mr-2" />
            Импорт JSON
          </Button>
        </div>

        <Button 
          onClick={onGenerateQR} 
          className="w-full justify-start bg-pink-600 hover:bg-pink-700 text-white min-h-[44px]"
        >
          <QrCode className="w-4 h-4 mr-2" />
          Генерировать QR
        </Button>

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
