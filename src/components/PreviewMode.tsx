
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Download, Copy, Palette, Save, ChevronDown, ChevronRight } from 'lucide-react';
import { Step, StepGroup } from '../types/Step';
import { toast } from 'sonner';
import { useTheme, Theme } from '../hooks/useTheme';

interface PreviewModeProps {
  title: string;
  description: string;
  steps: Step[];
  groups?: StepGroup[];
  onClose: () => void;
  onSaveWithTheme?: (theme: Theme) => void;
}

const PreviewMode: React.FC<PreviewModeProps> = ({
  title,
  description,
  steps,
  groups = [],
  onClose,
  onSaveWithTheme
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

  const handleThemeChange = (newTheme: Theme) => {
    setPreviewTheme(newTheme);
    setTheme(newTheme);
  };

  const handleSaveWithCurrentTheme = () => {
    if (onSaveWithTheme) {
      onSaveWithTheme(previewTheme);
      toast.success(`Инструкция сохранена с темой: ${previewTheme === 'light' ? 'Светлая' : previewTheme === 'gray' ? 'Серая' : 'Тёмная'}`);
    }
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

  const handleExportHTML = () => {
    const themeStyles = getThemeStyles(previewTheme);
    const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6; 
            margin: 0; 
            padding: 40px;
            background: ${themeStyles.bg};
            color: ${themeStyles.text};
        }
        .container { max-width: 800px; margin: 0 auto; background: ${themeStyles.cardBg}; padding: 40px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        h1 { color: ${themeStyles.text}; margin-bottom: 10px; font-size: 2rem; }
        .description { color: ${themeStyles.secondary}; margin-bottom: 30px; font-size: 1.1rem; }
        
        .group {
            margin: 30px 0;
            border: 2px solid ${themeStyles.border};
            border-radius: 12px;
            overflow: hidden;
        }
        .group-header {
            background: ${themeStyles.border};
            padding: 15px 20px;
            display: flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
            font-weight: 600;
            color: ${themeStyles.text};
        }
        .group-header:hover { background: ${themeStyles.secondary}; }
        .group-toggle { margin-right: 10px; transition: transform 0.2s; }
        .group-toggle.collapsed { transform: rotate(-90deg); }
        .group-content { 
            background: ${themeStyles.cardBg}; 
            transition: max-height 0.3s ease-out;
            overflow: hidden;
        }
        .group-content.collapsed { max-height: 0; }
        .group-content.expanded { max-height: 1000px; }
        
        .step { 
            margin: 20px; 
            padding: 20px; 
            border: 1px solid ${themeStyles.border};
            border-radius: 8px;
            background: ${themeStyles.bg};
        }
        .step-header { 
            display: flex; 
            align-items: center; 
            margin-bottom: 15px; 
            font-weight: 600; 
            color: ${themeStyles.text};
            font-size: 1.1rem;
        }
        .step-number { 
            background: #3b82f6; 
            color: white; 
            width: 24px; 
            height: 24px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 0.9rem; 
            margin-right: 10px;
        }
        .step-content { margin-left: 34px; }
        .code-container {
            background: #1e293b;
            border-radius: 6px;
            overflow: hidden;
            margin-top: 10px;
        }
        .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 15px;
            background: #334155;
        }
        .language-tag {
            background: #3b82f6;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
        }
        .copy-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            background: #22c55e;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s;
        }
        .copy-btn:hover { background: #16a34a; }
        pre { 
            background: #1e293b; 
            color: #e2e8f0; 
            padding: 20px; 
            margin: 0;
            overflow-x: auto; 
            font-family: 'Fira Code', Consolas, monospace;
            font-size: 0.9rem;
        }
        img { 
            max-width: 100%; 
            height: auto; 
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .step-text {
            white-space: pre-wrap;
            font-size: 1rem;
            line-height: 1.7;
        }
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #22c55e;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 1000;
        }
        .toast.show { transform: translateX(0); }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        ${description ? `<div class="description">${description}</div>` : ''}
        
        ${groups.length > 0 ? groups.map((group: StepGroup) => `
            <div class="group">
                <div class="group-header" onclick="toggleGroup('${group.id}')">
                    <span class="group-toggle" id="toggle-${group.id}">▼</span>
                    ${group.title}
                </div>
                <div class="group-content expanded" id="content-${group.id}">
                    ${group.steps.map((step: Step, index: number) => `
                        <div class="step">
                            <div class="step-header">
                                <div class="step-number">${index + 1}</div>
                                ${step.title || 'Шаг'}
                            </div>
                            <div class="step-content">
                                ${step.type === 'code' ? `
                                    <div class="code-container">
                                        <div class="code-header">
                                            ${step.language ? `<div class="language-tag">${step.language}</div>` : ''}
                                            <button onclick="copyCode(this)" class="copy-btn">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                    <path d="m5 15-1-1v-8c0-1 1-2 2-2h8l1 1"></path>
                                                </svg>
                                                Копировать
                                            </button>
                                        </div>
                                        <pre><code>${step.content}</code></pre>
                                    </div>
                                ` : step.type === 'image' && step.imageUrl ? `
                                    <img src="${step.imageUrl}" alt="${step.title || ''}" />
                                    ${step.content ? `<div class="step-text">${step.content}</div>` : ''}
                                ` : `
                                    <div class="step-text">${step.content}</div>
                                `}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('') : ''}
        
        ${steps.filter(step => !step.groupId).map((step: Step, index: number) => `
            <div class="step">
                <div class="step-header">
                    <div class="step-number">${groups.reduce((acc, group) => acc + group.steps.length, 0) + index + 1}</div>
                    ${step.title || 'Шаг'}
                </div>
                <div class="step-content">
                    ${step.type === 'code' ? `
                        <div class="code-container">
                            <div class="code-header">
                                ${step.language ? `<div class="language-tag">${step.language}</div>` : ''}
                                <button onclick="copyCode(this)" class="copy-btn">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="m5 15-1-1v-8c0-1 1-2 2-2h8l1 1"></path>
                                    </svg>
                                    Копировать
                                </button>
                            </div>
                            <pre><code>${step.content}</code></pre>
                        </div>
                    ` : step.type === 'image' && step.imageUrl ? `
                        <img src="${step.imageUrl}" alt="${step.title || ''}" />
                        ${step.content ? `<div class="step-text">${step.content}</div>` : ''}
                    ` : `
                        <div class="step-text">${step.content}</div>
                    `}
                </div>
            </div>
        `).join('')}
    </div>
    
    <script>
        function toggleGroup(groupId) {
            const content = document.getElementById('content-' + groupId);
            const toggle = document.getElementById('toggle-' + groupId);
            
            if (content.classList.contains('collapsed')) {
                content.classList.remove('collapsed');
                content.classList.add('expanded');
                toggle.textContent = '▼';
            } else {
                content.classList.remove('expanded');
                content.classList.add('collapsed');
                toggle.textContent = '▶';
            }
        }
        
        function copyCode(button) {
            const codeBlock = button.closest('.code-container').querySelector('code');
            const text = codeBlock.textContent;
            
            navigator.clipboard.writeText(text).then(() => {
                showToast('Код скопирован в буфер обмена!');
            }).catch(() => {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast('Код скопирован в буфер обмена!');
            });
        }
        
        function showToast(message) {
            const existingToast = document.querySelector('.toast');
            if (existingToast) existingToast.remove();
            
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => toast.classList.add('show'), 100);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    </script>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
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
          
          {onSaveWithTheme && (
            <Button
              onClick={handleSaveWithCurrentTheme}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Сохранить с темой
            </Button>
          )}
          
          <Button
            onClick={handleExportHTML}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Экспорт HTML
          </Button>
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
