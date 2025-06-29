
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
    <div className="h-screen bg-slate-900 border-r border-slate-700 flex flex-col overflow-hidden">
      <div className="p-4 sm:p-6 flex-shrink-0">
        <h1 className="text-lg sm:text-xl font-bold text-white mb-2">Nott Instructions</h1>
      </div>

      <div className="flex-1 px-4 sm:px-6 overflow-y-auto">
        <div className="space-y-3 pb-6">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Добавить элемент</h3>
          
          <Button 
            onClick={() => onAddStep('text')} 
            className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white min-h-[44px]"
          >
            <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Добавить текст</span>
          </Button>

          <Button 
            onClick={() => onAddStep('code')} 
            className="w-full justify-start bg-green-600 hover:bg-green-700 text-white min-h-[44px]"
          >
            <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Добавить код</span>
          </Button>

          <Button 
            onClick={onAddHtmlWithTemplate} 
            className="w-full justify-start bg-orange-600 hover:bg-orange-700 text-white min-h-[44px]"
          >
            <Code className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">HTML-блок с шаблоном</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white min-h-[44px]">
                <Image className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">Добавить изображение</span>
                <ChevronDown className="w-4 h-4 ml-auto flex-shrink-0" />
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
              <Paperclip className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Прикрепить файл</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 border-t border-slate-700 flex-shrink-0">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Действия</h3>
          
          <Button 
            onClick={onSave} 
            className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white min-h-[44px]"
          >
            <Save className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Сохранить</span>
          </Button>

          <Button 
            onClick={onOpenSavedProjects} 
            className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white min-h-[44px]"
          >
            <FolderOpen className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Сохранённые проекты</span>
          </Button>

          <div className="space-y-2">
            <Button 
              onClick={() => onExport('html')} 
              className="w-full justify-start bg-orange-600 hover:bg-orange-700 text-white min-h-[44px] text-xs"
            >
              <Download className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Экспорт в HTML</span>
            </Button>
            
            <Button 
              onClick={() => onExport('markdown')} 
              className="w-full justify-start bg-yellow-600 hover:bg-yellow-700 text-white min-h-[44px] text-xs"
            >
              <Download className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Экспорт в Markdown</span>
            </Button>
            
            <Button 
              onClick={() => onExport('json')} 
              className="w-full justify-start bg-cyan-600 hover:bg-cyan-700 text-white min-h-[44px] text-xs"
            >
              <Download className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Экспорт в JSON</span>
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
              className="w-full justify-start bg-indigo-600 hover:bg-indigo-700 text-white min-h-[44px] text-xs"
            >
              <FileUp className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">Импорт JSON</span>
            </Button>
          </div>

          <Button 
            onClick={onGenerateQR} 
            className="w-full justify-start bg-pink-600 hover:bg-pink-700 text-white min-h-[44px] text-xs"
          >
            <QrCode className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Генерировать QR</span>
          </Button>

          <Button 
            onClick={onOpenSettings} 
            className="w-full justify-start bg-slate-700 hover:bg-slate-600 text-white min-h-[44px]"
          >
            <Settings className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Настройки</span>
          </Button>
        </div>
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
      <div className="hidden md:block w-72 flex-shrink-0">
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
