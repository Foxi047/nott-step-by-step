import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Palette, ChevronDown, ChevronRight, Copy } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-auto" style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      lineHeight: '1.6',
      background: themeStyles.bg,
      color: themeStyles.text
    }}>
      {/* Контрольная панель */}
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

      {/* Контент в стиле экспортируемого HTML */}
      <div 
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '40px',
          background: themeStyles.cardBg,
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginTop: '40px',
          marginBottom: '40px'
        }}
      >
        <h1 style={{ 
          color: themeStyles.text, 
          marginBottom: '10px', 
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          {title}
        </h1>
        
        {description && (
          <div style={{ 
            color: themeStyles.secondary, 
            marginBottom: '30px', 
            fontSize: '1.1rem' 
          }}>
            {description}
          </div>
        )}
        
        {/* Группированные шаги */}
        {groups.map((group) => (
          <div key={group.id} style={{
            margin: '30px 0',
            border: `2px solid ${themeStyles.border}`,
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <div 
              style={{
                background: themeStyles.border,
                padding: '15px 20px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                fontWeight: '600',
                color: themeStyles.text
              }}
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
              <div style={{ background: themeStyles.cardBg }}>
                {group.steps.map((step, stepIndex) => (
                  <div key={step.id} style={{
                    margin: '20px',
                    padding: '20px',
                    border: `1px solid ${themeStyles.border}`,
                    borderRadius: '8px',
                    background: themeStyles.bg
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '15px',
                      fontWeight: '600',
                      color: themeStyles.text,
                      fontSize: '1.1rem'
                    }}>
                      <div style={{
                        background: '#3b82f6',
                        color: 'white',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        marginRight: '10px'
                      }}>
                        {stepIndex + 1}
                      </div>
                      {step.title || 'Шаг'}
                    </div>
                    
                    <div style={{ marginLeft: '34px' }}>
                      {step.type === 'code' ? (
                        <div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 15px',
                            background: '#334155'
                          }}>
                            {step.language && (
                              <div style={{
                                background: '#3b82f6',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.8rem'
                              }}>
                                {step.language}
                              </div>
                            )}
                            <Button 
                              size="sm"
                              onClick={() => handleCopyCode(step.content)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#22c55e',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              <Copy className="w-3 h-3" />
                              Копировать код
                            </Button>
                          </div>
                          <pre style={{
                            background: '#1e293b',
                            color: '#e2e8f0',
                            padding: '20px',
                            margin: '0',
                            overflowX: 'auto',
                            fontFamily: '"Fira Code", Consolas, monospace',
                            fontSize: '0.9rem'
                          }}>
                            <code>{step.content}</code>
                          </pre>
                        </div>
                      ) : step.type === 'image' && step.imageUrl ? (
                        <div>
                          <img 
                            src={step.imageUrl} 
                            alt={step.title || 'Изображение'} 
                            style={{
                              maxWidth: '100%',
                              height: 'auto',
                              borderRadius: '6px',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                          />
                          {step.content && (
                            <div style={{
                              whiteSpace: 'pre-wrap',
                              fontSize: '1rem',
                              lineHeight: '1.7',
                              color: themeStyles.text,
                              marginTop: '10px'
                            }}>
                              {step.content}
                            </div>
                          )}
                        </div>
                      ) : step.type === 'text' ? (
                        <div style={{ fontSize: '1rem', lineHeight: '1.7' }}>
                          {renderTextWithCopyButtons(step.content, themeStyles.text)}
                        </div>
                      ) : step.type === 'html' ? (
                        <div 
                          style={{
                            border: `1px solid ${themeStyles.border}`,
                            borderRadius: '6px',
                            padding: '15px',
                            background: themeStyles.cardBg
                          }}
                          dangerouslySetInnerHTML={{ __html: step.content }}
                        />
                      ) : step.type === 'file' && step.fileData ? (
                        <div style={{
                          border: `1px solid ${themeStyles.border}`,
                          borderRadius: '6px',
                          padding: '15px',
                          background: themeStyles.cardBg
                        }}>
                          <a 
                            href={step.fileData} 
                            download={step.fileName || 'file'}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              color: '#3b82f6',
                              textDecoration: 'none',
                              fontWeight: '500',
                              padding: '8px 12px',
                              border: '1px solid #3b82f6',
                              borderRadius: '6px'
                            }}
                          >
                            📎 {step.fileName || 'Скачать файл'}
                          </a>
                          {step.content && (
                            <div style={{
                              whiteSpace: 'pre-wrap',
                              fontSize: '1rem',
                              lineHeight: '1.7',
                              color: themeStyles.text,
                              marginTop: '10px'
                            }}>
                              {step.content}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{
                          whiteSpace: 'pre-wrap',
                          fontSize: '1rem',
                          lineHeight: '1.7',
                          color: themeStyles.text
                        }}>
                          {step.content}
                        </div>
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
            <div key={step.id} style={{
              marginBottom: '32px',
              padding: '20px',
              border: `1px solid ${themeStyles.border}`,
              borderRadius: '8px',
              background: themeStyles.cardBg
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px',
                fontWeight: '600',
                color: themeStyles.text,
                fontSize: '1.1rem'
              }}>
                <div style={{
                  background: '#3b82f6',
                  color: 'white',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  marginRight: '10px'
                }}>
                  {stepNumber}
                </div>
                {step.title || 'Шаг'}
              </div>
              
              <div style={{ marginLeft: '34px' }}>
                {step.type === 'code' ? (
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 15px',
                      background: '#334155'
                    }}>
                      {step.language && (
                        <div style={{
                          background: '#3b82f6',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem'
                        }}>
                          {step.language}
                        </div>
                      )}
                      <Button 
                        size="sm"
                        onClick={() => handleCopyCode(step.content)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#22c55e',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        <Copy className="w-3 h-3" />
                        Копировать код
                      </Button>
                    </div>
                    <pre style={{
                      background: '#1e293b',
                      color: '#e2e8f0',
                      padding: '20px',
                      margin: '0',
                      overflowX: 'auto',
                      fontFamily: '"Fira Code", Consolas, monospace',
                      fontSize: '0.9rem'
                    }}>
                      <code>{step.content}</code>
                    </pre>
                  </div>
                ) : step.type === 'image' && step.imageUrl ? (
                  <div>
                    <img 
                      src={step.imageUrl} 
                      alt={step.title || 'Изображение'} 
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '6px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    {step.content && (
                      <div style={{
                        whiteSpace: 'pre-wrap',
                        fontSize: '1rem',
                        lineHeight: '1.7',
                        color: themeStyles.text,
                        marginTop: '10px'
                      }}>
                        {step.content}
                      </div>
                    )}
                  </div>
                ) : step.type === 'text' ? (
                  <div style={{ fontSize: '1rem', lineHeight: '1.7' }}>
                    {renderTextWithCopyButtons(step.content, themeStyles.text)}
                  </div>
                ) : step.type === 'html' ? (
                  <div 
                    style={{
                      border: `1px solid ${themeStyles.border}`,
                      borderRadius: '6px',
                      padding: '15px',
                      background: themeStyles.cardBg
                    }}
                    dangerouslySetInnerHTML={{ __html: step.content }}
                  />
                ) : step.type === 'file' && step.fileData ? (
                  <div style={{
                    border: `1px solid ${themeStyles.border}`,
                    borderRadius: '6px',
                    padding: '15px',
                    background: themeStyles.cardBg
                  }}>
                    <a 
                      href={step.fileData} 
                      download={step.fileName || 'file'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#3b82f6',
                        textDecoration: 'none',
                        fontWeight: '500',
                        padding: '8px 12px',
                        border: '1px solid #3b82f6',
                        borderRadius: '6px'
                      }}
                    >
                      📎 {step.fileName || 'Скачать файл'}
                    </a>
                    {step.content && (
                      <div style={{
                        whiteSpace: 'pre-wrap',
                        fontSize: '1rem',
                        lineHeight: '1.7',
                        color: themeStyles.text,
                        marginTop: '10px'
                      }}>
                        {step.content}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{
                    whiteSpace: 'pre-wrap',
                    fontSize: '1rem',
                    lineHeight: '1.7',
                    color: themeStyles.text
                  }}>
                    {step.content}
                  </div>
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