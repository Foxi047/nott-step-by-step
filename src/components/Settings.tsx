import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Palette, Info, HelpCircle, Plus, Trash2, Layout } from 'lucide-react';
import { useTheme, Theme } from '../hooks/useTheme';
import { toast } from 'sonner';

interface SettingsProps {
  onClose: () => void;
}

interface StepTemplate {
  id: string;
  name: string;
  description: string;
  steps: Array<{
    type: 'text' | 'code' | 'image';
    title: string;
    content: string;
    language?: string;
  }>;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'appearance' | 'templates' | 'help' | 'about'>('appearance');
  const [templates, setTemplates] = useState<StepTemplate[]>([
    {
      id: 'image-text',
      name: 'Изображение + текст',
      description: 'Шаблон с изображением и пояснительным текстом',
      steps: [
        { type: 'image', title: 'Изображение', content: 'Описание изображения' },
        { type: 'text', title: 'Пояснение', content: 'Объяснение к изображению' }
      ]
    },
    {
      id: 'code-explanation',
      name: 'Код + объяснение',
      description: 'Шаблон с примером кода и объяснением',
      steps: [
        { type: 'code', title: 'Пример кода', content: '// Пример кода\nconsole.log("Hello, World!");', language: 'javascript' },
        { type: 'text', title: 'Объяснение', content: 'Объяснение работы кода' }
      ]
    }
  ]);
  const [newTemplate, setNewTemplate] = useState<Partial<StepTemplate>>({});

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.description) {
      toast.error('Заполните название и описание шаблона');
      return;
    }

    const template: StepTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      description: newTemplate.description,
      steps: [
        { type: 'text', title: 'Новый шаг', content: 'Содержимое шага' }
      ]
    };

    setTemplates([...templates, template]);
    setNewTemplate({});
    toast.success('Шаблон добавлен');
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast.success('Шаблон удален');
  };

  const renderAppearanceTab = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">
          Тема приложения
        </label>
        <Select value={theme} onValueChange={handleThemeChange}>
          <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="light">Светлая</SelectItem>
            <SelectItem value="gray">Серая</SelectItem>
            <SelectItem value="dark">Тёмная</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderTemplatesTab = () => (
    <div className="space-y-4">
      <h3 className="font-medium text-white">Шаблоны шагов</h3>
      
      <div className="space-y-3">
        {templates.map((template) => (
          <div key={template.id} className="bg-slate-700 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-white">{template.name}</h4>
                <p className="text-sm text-slate-400">{template.description}</p>
                <p className="text-xs text-slate-500 mt-1">{template.steps.length} шагов</p>
              </div>
              {!['image-text', 'code-explanation'].includes(template.id) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-600 pt-4">
        <h4 className="font-medium text-white mb-3">Добавить новый шаблон</h4>
        <div className="space-y-3">
          <Input
            placeholder="Название шаблона"
            value={newTemplate.name || ''}
            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
          />
          <Textarea
            placeholder="Описание шаблона"
            value={newTemplate.description || ''}
            onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
            rows={2}
          />
          <Button
            onClick={handleAddTemplate}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить шаблон
          </Button>
        </div>
      </div>
    </div>
  );

  const renderHelpTab = () => (
    <div className="space-y-4 text-sm text-slate-300">
      <h3 className="font-medium text-white">Как пользоваться приложением</h3>
      
      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-white mb-1">Создание инструкции:</h4>
          <p>1. Введите название и описание инструкции</p>
          <p>2. Добавляйте шаги с помощью кнопок на панели слева</p>
          <p>3. Перетаскивайте шаги для изменения порядка</p>
        </div>
        
        <div>
          <h4 className="font-medium text-white mb-1">Типы шагов:</h4>
          <p>• Текст - для обычных объяснений</p>
          <p>• Код - для примеров кода с подсветкой синтаксиса</p>
          <p>• Изображение - для скриншотов и иллюстраций</p>
        </div>
        
        <div>
          <h4 className="font-medium text-white mb-1">Экспорт:</h4>
          <p>• HTML - для веб-страниц</p>
          <p>• Markdown - для документации</p>
          <p>• JSON - для программного использования</p>
        </div>
        
        <div>
          <h4 className="font-medium text-white mb-1">Сохранение:</h4>
          <p>Используйте кнопку "Сохранить" для сохранения проекта локально</p>
          <p>Доступ к сохранённым проектам через кнопку "Сохранённые проекты"</p>
        </div>
      </div>
    </div>
  );

  const renderAboutTab = () => (
    <div className="space-y-4 text-sm text-slate-300">
      <h3 className="font-medium text-white">О приложении</h3>
      
      <div className="space-y-2">
        <p><span className="font-medium text-white">Название:</span> Nott Instructions</p>
        <p><span className="font-medium text-white">Версия:</span> 1.0.0</p>
        <p><span className="font-medium text-white">Разработчик:</span> Nott</p>
        <p><span className="font-medium text-white">Язык программирования:</span> TypeScript</p>
        <p><span className="font-medium text-white">Фреймворк:</span> React 18</p>
      </div>
      
      <div>
        <p className="font-medium text-white mb-2">Технологии:</p>
        <div className="pl-4 space-y-1">
          <p>• React + TypeScript</p>
          <p>• Tailwind CSS</p>
          <p>• Shadcn/ui</p>
          <p>• Lucide React</p>
          <p>• React Beautiful DnD</p>
          <p>• Vite</p>
        </div>
      </div>
      
      <div>
        <p className="font-medium text-white mb-2">Функции:</p>
        <div className="pl-4 space-y-1">
          <p>• Создание пошаговых инструкций</p>
          <p>• Поддержка текста, кода и изображений</p>
          <p>• Drag & Drop сортировка</p>
          <p>• Экспорт в HTML/Markdown/JSON</p>
          <p>• Локальное сохранение проектов</p>
          <p>• Темы оформления</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Настройки</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex border-b border-slate-700 mb-6">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'appearance'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4 inline mr-2" />
            Оформление
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layout className="w-4 h-4 inline mr-2" />
            Шаблоны
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'help'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 inline mr-2" />
            Помощь
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Info className="w-4 h-4 inline mr-2" />
            О приложении
          </button>
        </div>

        <div>
          {activeTab === 'appearance' && renderAppearanceTab()}
          {activeTab === 'templates' && renderTemplatesTab()}
          {activeTab === 'help' && renderHelpTab()}
          {activeTab === 'about' && renderAboutTab()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
