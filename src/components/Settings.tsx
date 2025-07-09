import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X, Palette, Info, HelpCircle, RefreshCw } from 'lucide-react';
import { useTheme, Theme } from '../hooks/useTheme';
import { toast } from 'sonner';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'appearance' | 'update' | 'help' | 'about'>('appearance');
  const [updateCode, setUpdateCode] = useState('');
  const [showUpdateInput, setShowUpdateInput] = useState(false);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleUpdateApp = () => {
    if (updateCode === 'Nott_013') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.unregister();
          });
          window.location.reload();
          toast.success('Приложение обновлено!');
        });
      } else {
        window.location.reload();
        toast.success('Приложение обновлено!');
      }
    } else {
      toast.error('Неверный код');
    }
    setUpdateCode('');
    setShowUpdateInput(false);
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
        <p className="text-xs text-slate-400 mt-2">
          Выберите тему для интерфейса приложения. Тема также применяется в предпросмотре и экспорте.
        </p>
      </div>
    </div>
  );

  const renderUpdateTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-4">
          <RefreshCw className="w-16 h-16 mx-auto text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Обновление приложения</h3>
        <p className="text-slate-300 mb-6">
          Для принудительного обновления приложения введите код доступа
        </p>
        
        <div className="p-4 bg-slate-700 rounded-lg">
          <h4 className="font-medium text-white mb-3">Обновление приложения</h4>
          <p className="text-sm text-slate-300 mb-3">
            Для обновления приложения через интернет требуется код доступа.
          </p>
          
          {!showUpdateInput ? (
            <Button
              onClick={() => setShowUpdateInput(true)}
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Обновить приложение
            </Button>
          ) : (
            <div className="space-y-3">
              <Input
                type="password"
                placeholder="Введите код доступа"
                value={updateCode}
                onChange={(e) => setUpdateCode(e.target.value)}
                className="bg-slate-600 border-slate-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdateApp();
                  }
                }}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleUpdateApp}
                  className="flex-1"
                  disabled={!updateCode}
                >
                  Обновить
                </Button>
                <Button
                  onClick={() => {
                    setShowUpdateInput(false);
                    setUpdateCode('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 text-sm text-slate-300">
        <div className="p-4 bg-slate-700 rounded-lg">
          <h4 className="font-medium text-white mb-3">Как обновить приложение:</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-blue-400">•</span>
              Обычно приложение обновляется автоматически
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-400">•</span>
              Для принудительного обновления используйте код доступа
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-400">•</span>
              После обновления приложение перезапустится
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-400">•</span>
              Все сохранённые проекты останутся на месте
            </li>
          </ul>
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
          <p>4. Группируйте связанные шаги для лучшей организации</p>
        </div>
        
        <div>
          <h4 className="font-medium text-white mb-1">Типы шагов:</h4>
          <p>• Текст - для обычных объяснений и описаний</p>
          <p>• Код - для примеров кода с подсветкой синтаксиса</p>
          <p>• Изображение - для скриншотов и иллюстраций</p>
          <p>• HTML-блок - для готовых HTML шаблонов</p>
          <p>• Файлы - для прикрепления документов</p>
        </div>
        
        <div>
          <h4 className="font-medium text-white mb-1">Группы шагов:</h4>
          <p>• Создавайте группы для организации связанных шагов</p>
          <p>• Группы можно сворачивать и разворачивать</p>
          <p>• Перетаскивайте шаги между группами</p>
          <p>• Группы отображаются в предпросмотре и экспорте</p>
        </div>
        
        <div>
          <h4 className="font-medium text-white mb-1">Предпросмотр:</h4>
          <p>• Просматривайте инструкцию в реальном времени</p>
          <p>• Переключайте темы оформления</p>
          <p>• Сворачивайте группы в предпросмотре</p>
          <p>• Копируйте код прямо из предпросмотра</p>
        </div>
        
        <div>
          <h4 className="font-medium text-white mb-1">Экспорт:</h4>
          <p>• HTML - для веб-страниц с интерактивными функциями</p>
          <p>• Markdown - для документации</p>
          <p>• JSON - для программного использования</p>
          
          <p>• Защита паролем для HTML файлов</p>
        </div>
        
        <div>
          <h4 className="font-medium text-white mb-1">Сохранение:</h4>
          <p>• Автосохранение работает каждую секунду</p>
          <p>• Ручное сохранение через кнопку "Сохранить"</p>
          <p>• Сохранение с темой из предпросмотра</p>
          <p>• Импорт и экспорт проектов в JSON</p>
        </div>
      </div>
    </div>
  );

  const renderAboutTab = () => (
    <div className="space-y-4 text-sm text-slate-300">
      <h3 className="font-medium text-white">О приложении</h3>
      
      <div className="space-y-2">
        <p><span className="font-medium text-white">Название:</span> Nott Instructions</p>
        <p><span className="font-medium text-white">Версия:</span> 2.1.0</p>
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
          <p>• Konva (для редактирования изображений)</p>
          
        </div>
      </div>
      
      <div>
        <p className="font-medium text-white mb-2">Основные функции:</p>
        <div className="pl-4 space-y-1">
          <p>• Создание пошаговых инструкций</p>
          <p>• Поддержка текста, кода, изображений, HTML и файлов</p>
          <p>• Группировка шагов с возможностью сворачивания</p>
          <p>• Drag & Drop сортировка шагов и групп</p>
          <p>• Интерактивный предпросмотр с темами</p>
          <p>• Экспорт в HTML/Markdown/JSON</p>
          <p>• Локальное сохранение проектов</p>
          <p>• Автосохранение работы (каждую секунду)</p>
          
          <p>• Редактор изображений с аннотациями</p>
          <p>• PWA поддержка для оффлайн работы</p>
        </div>
      </div>
      
      <div>
        <p className="font-medium text-white mb-2">Новые возможности v2.1:</p>
        <div className="pl-4 space-y-1">
          <p>• Диалог выбора параметров сохранения</p>
          <p>• Защита HTML файлов паролем</p>
          <p>• Выбор темы при экспорте</p>
          <p>• PWA установщик и оффлайн работа</p>
          <p>• Ускоренное автосохранение (1 секунда)</p>
          <p>• Улучшенная боковая панель</p>
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
            onClick={() => setActiveTab('update')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'update'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Обновление
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
          {activeTab === 'update' && renderUpdateTab()}
          {activeTab === 'help' && renderHelpTab()}
          {activeTab === 'about' && renderAboutTab()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
