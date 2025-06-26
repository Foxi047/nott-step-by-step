
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Download, Copy, Palette } from 'lucide-react';
import { Step } from './StepEditor';
import { toast } from 'sonner';
import { useTheme, Theme } from '../hooks/useTheme';

interface PreviewModeProps {
  title: string;
  description: string;
  steps: Step[];
  onClose: () => void;
}

const PreviewMode: React.FC<PreviewModeProps> = ({
  title,
  description,
  steps,
  onClose
}) => {
  const { theme, setTheme } = useTheme();
  const [previewTheme, setPreviewTheme] = useState<Theme>(theme);

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

  const handleExportHTML = () => {
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
            background: #f8fafc;
            color: #334155;
        }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        h1 { color: #1e293b; margin-bottom: 10px; font-size: 2rem; }
        .description { color: #64748b; margin-bottom: 30px; font-size: 1.1rem; }
        .step { 
            margin: 30px 0; 
            padding: 20px; 
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: #fefefe;
        }
        .step-header { 
            display: flex; 
            align-items: center; 
            margin-bottom: 15px; 
            font-weight: 600; 
            color: #1e293b;
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
        pre { 
            background: #1e293b; 
            color: #e2e8f0; 
            padding: 20px; 
            border-radius: 6px; 
            overflow-x: auto; 
            font-family: 'Fira Code', Consolas, monospace;
            font-size: 0.9rem;
        }
        .language-tag {
            background: #3b82f6;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            margin-bottom: 10px;
            display: inline-block;
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
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        ${description ? `<div class="description">${description}</div>` : ''}
        ${steps.map((step: Step, index: number) => `
            <div class="step">
                <div class="step-header">
                    <div class="step-number">${index + 1}</div>
                    ${step.title || 'Шаг'}
                </div>
                <div class="step-content">
                    ${step.type === 'code' ? `
                        ${step.language ? `<div class="language-tag">${step.language}</div>` : ''}
                        <pre><code>${step.content}</code></pre>
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
        
        {steps.map((step, index) => (
          <div key={step.id} className="mb-8 p-6 border rounded-lg" style={{ 
            borderColor: themeStyles.border, 
            background: themeStyles.cardBg 
          }}>
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                {index + 1}
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
    </div>
  );
};

export default PreviewMode;
