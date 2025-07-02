import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Palette, ChevronDown, ChevronRight } from 'lucide-react';
import { Step, StepGroup } from '../types/Step';
import { toast } from 'sonner';
import { useTheme, Theme } from '../hooks/useTheme';

interface PreviewModeProps {
  title: string;
  description: string;
  steps: Step[];
  groups?: StepGroup[];
  onClose: () => void;
  onExport?: (options: {
    format: 'html' | 'markdown' | 'json';
    password?: string;
    theme: 'light' | 'gray' | 'dark';
  }) => void;
}

const PreviewMode: React.FC<PreviewModeProps> = ({
  title,
  description,
  steps,
  groups = [],
  onClose,
  onExport
}) => {
  const { theme, setTheme } = useTheme();
  const [previewTheme, setPreviewTheme] = useState<Theme>(theme);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Код скопирован в буфер обмена');
    } catch (error) {
      toast.error('Ошибка копирования кода');
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Текст скопирован в буфер обмена');
    } catch (error) {
      toast.error('Ошибка копирования текста');
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setPreviewTheme(newTheme);
    setTheme(newTheme);
  };

  const toggleGroupCollapse = (groupId: string) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const getThemeStyles = (theme: Theme) => {
    switch (theme) {
      case 'light':
        return {
          bg: '#ffffff',
          text: '#1e293b',
          secondary: '#64748b',
          cardBg: '#f8fafc',
          border: '#e2e8f0'
        };
      case 'gray':
        return {
          bg: '#64748b',
          text: '#f1f5f9',
          secondary: '#cbd5e1',
          cardBg: '#475569',
          border: '#334155'
        };
      case 'dark':
        return {
          bg: '#0f172a',
          text: '#f1f5f9',
          secondary: '#94a3b8',
          cardBg: '#1e293b',
          border: '#334155'
        };
    }
  };

  const renderTextWithCopyButtons = (content: string, textColor: string) => {
    const paragraphs = content.split(/\n\s*\n/);
    
    return paragraphs.map((paragraph, index) => {
      if (!paragraph.trim()) return null;
      
      const isCopyable = paragraph.startsWith('[COPY]');
      const displayText = isCopyable ? paragraph.substring(6) : paragraph;
      
      return (
        <div key={index} className="relative group mb-4 last:mb-0">
          <div className={`${isCopyable ? 'bg-blue-900/20 border border-blue-700 rounded p-3' : ''} relative`}>
            <div className="whitespace-pre-wrap break-words" style={{ color: textColor }}>
              {isCopyable && <span className="text-blue-400 mr-2">⧉</span>}
              {displayText}
            </div>
            {isCopyable && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopyToClipboard(displayText)}
                className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white p-1 h-6 w-6 text-xs"
                title="Копировать абзац"
              >
                ⧉
              </Button>
            )}
          </div>
        </div>
      );
    }).filter(Boolean);
  };

  const themeStyles = getThemeStyles(previewTheme);
  const ungroupedSteps = steps.filter(step => !step.groupId);

  return (
    <div className="fixed inset-0 z-50 overflow-auto" style={{ background: themeStyles.bg }}>
      <div className="bg-slate-800 p-4 flex justify-between items-center sticky top-0 z-10">
        <h2 className="text-xl font-bold text-white">Предпросмотр: {title}</h2>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-white" />
            <Select value={previewTheme} onValueChange={handleThemeChange}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="light">Светлая</SelectItem>
                <SelectItem value="gray">Серая</SelectItem>
                <SelectItem value="dark">Тёмная</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8 min-h-screen" style={{ background: themeStyles.bg }}>
        <h1 className="text-3xl font-bold mb-4" style={{ color: themeStyles.text }}>{title}</h1>
        {description && (
          <p className="text-lg mb-8" style={{ color: themeStyles.secondary }}>{description}</p>
        )}
        
        {/* Группированные шаги */}
        {groups.map((group) => (
          <div key={group.id} className="mb-8 border-2 rounded-lg overflow-hidden" style={{ 
            borderColor: themeStyles.border,
            background: themeStyles.cardBg 
          }}>
            <div 
              className="p-4 cursor-pointer flex items-center font-semibold hover:opacity-80"
              style={{ background: themeStyles.border, color: themeStyles.text }}
              onClick={() => toggleGroupCollapse(group.id)}
            >
              {collapsedGroups.has(group.id) ? (
                <ChevronRight className="w-5 h-5 mr-2" />
              ) : (
                <ChevronDown className="w-5 h-5 mr-2" />
              )}
              {group.title}
            </div>
            
            {!collapsedGroups.has(group.id) && (
              <div className="p-4" style={{ background: themeStyles.cardBg }}>
                {group.steps.map((step, stepIndex) => (
                  <div key={step.id} className="mb-6 p-6 border rounded-lg" style={{ 
                    borderColor: themeStyles.border, 
                    background: themeStyles.bg 
                  }}>
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                        {stepIndex + 1}
                      </div>
                      <h3 className="text-xl font-semibold" style={{ color: themeStyles.text }}>
                        {step.title || 'Шаг'}
                      </h3>
                    </div>
                    
                    <div className="ml-11">
                      {step.type === 'code' ? (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            {step.language && (
                              <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm inline-block">
                                {step.language}
                              </div>
                            )}
                            <Button 
                              size="sm"
                              onClick={() => handleCopyCode(step.content)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Копировать код
                            </Button>
                          </div>
                          <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto relative">
                            <code>{step.content}</code>
                          </pre>
                        </div>
                      ) : step.type === 'image' && step.imageUrl ? (
                        <div>
                          <img 
                            src={step.imageUrl} 
                            alt={step.title || 'Изображение'} 
                            className="max-w-full h-auto rounded shadow-lg mb-4"
                          />
                          {step.content && (
                            <p className="whitespace-pre-wrap" style={{ color: themeStyles.text }}>{step.content}</p>
                          )}
                        </div>
                      ) : step.type === 'text' ? (
                        renderTextWithCopyButtons(step.content, themeStyles.text)
                      ) : (
                        <p className="whitespace-pre-wrap" style={{ color: themeStyles.text }}>{step.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* Неформированные шаги */}
        {ungroupedSteps.map((step, index) => {
          const stepNumber = groups.reduce((acc, group) => acc + group.steps.length, 0) + index + 1;
          return (
            <div key={step.id} className="mb-8 p-6 border rounded-lg" style={{ 
              borderColor: themeStyles.border, 
              background: themeStyles.cardBg 
            }}>
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                  {stepNumber}
                </div>
                <h3 className="text-xl font-semibold" style={{ color: themeStyles.text }}>
                  {step.title || 'Шаг'}
                </h3>
              </div>
              
              <div className="ml-11">
                {step.type === 'code' ? (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      {step.language && (
                        <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm inline-block">
                          {step.language}
                        </div>
                      )}
                      <Button 
                        size="sm"
                        onClick={() => handleCopyCode(step.content)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Копировать код
                      </Button>
                    </div>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto relative">
                      <code>{step.content}</code>
                    </pre>
                  </div>
                ) : step.type === 'image' && step.imageUrl ? (
                  <div>
                    <img 
                      src={step.imageUrl} 
                      alt={step.title || 'Изображение'} 
                      className="max-w-full h-auto rounded shadow-lg mb-4"
                    />
                    {step.content && (
                      <p className="whitespace-pre-wrap" style={{ color: themeStyles.text }}>{step.content}</p>
                    )}
                  </div>
                ) : step.type === 'text' ? (
                  renderTextWithCopyButtons(step.content, themeStyles.text)
                ) : (
                  <p className="whitespace-pre-wrap" style={{ color: themeStyles.text }}>{step.content}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PreviewMode;
