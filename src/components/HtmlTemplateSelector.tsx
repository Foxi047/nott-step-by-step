
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  html: string;
  preview: string;
}

interface HtmlTemplateSelectorProps {
  onSelectTemplate: (html: string, title: string) => void;
  onCancel: () => void;
}

const HtmlTemplateSelector: React.FC<HtmlTemplateSelectorProps> = ({
  onSelectTemplate,
  onCancel
}) => {
  const templates: Template[] = [
    {
      id: 'basic-block',
      name: 'Базовый блок',
      html: '<div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin: 10px 0;"><p style="margin: 0; color: #333;">Введите ваш контент здесь</p></div>',
      preview: 'Простой блок с серым фоном для выделения информации'
    },
    {
      id: 'info-block',
      name: 'Информационный блок',
      html: '<div style="padding: 20px; background-color: #e3f2fd; border-left: 4px solid #2196f3; margin: 10px 0;"><p style="margin: 0; color: #1565c0; font-weight: 500;">ℹ️ Информация</p><p style="margin: 10px 0 0 0; color: #333;">Важная информация для пользователя</p></div>',
      preview: 'Синий блок для важной информации с иконкой'
    },
    {
      id: 'warning-block',
      name: 'Блок предупреждения',
      html: '<div style="padding: 20px; background-color: #fff3e0; border-left: 4px solid #ff9800; margin: 10px 0;"><p style="margin: 0; color: #e65100; font-weight: 500;">⚠️ Внимание</p><p style="margin: 10px 0 0 0; color: #333;">Обратите внимание на это предупреждение</p></div>',
      preview: 'Оранжевый блок для предупреждений'
    },
    {
      id: 'success-block',
      name: 'Блок успеха',
      html: '<div style="padding: 20px; background-color: #e8f5e8; border-left: 4px solid #4caf50; margin: 10px 0;"><p style="margin: 0; color: #2e7d32; font-weight: 500;">✅ Успешно</p><p style="margin: 10px 0 0 0; color: #333;">Операция выполнена успешно</p></div>',
      preview: 'Зелёный блок для сообщений об успехе'
    },
    {
      id: 'error-block',
      name: 'Блок ошибки',
      html: '<div style="padding: 20px; background-color: #ffebee; border-left: 4px solid #f44336; margin: 10px 0;"><p style="margin: 0; color: #c62828; font-weight: 500;">❌ Ошибка</p><p style="margin: 10px 0 0 0; color: #333;">Произошла ошибка, проверьте правильность действий</p></div>',
      preview: 'Красный блок для сообщений об ошибках'
    },
    {
      id: 'frame-block',
      name: 'Блок с рамкой',
      html: '<div style="padding: 20px; border: 2px solid #ddd; border-radius: 8px; background-color: #fff; margin: 10px 0;"><h4 style="margin: 0 0 10px 0; color: #333;">Заголовок</h4><p style="margin: 0; color: #333; line-height: 1.6;">Содержимое блока с рамкой. Здесь можно разместить любую информацию.</p></div>',
      preview: 'Блок с декоративной рамкой и заголовком'
    },
    {
      id: 'quote-block',
      name: 'Блок цитаты',
      html: '<blockquote style="margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #ccc; font-style: italic; color: #333;"><p style="margin: 0; font-size: 1.1em;">"Введите вашу цитату здесь"</p><footer style="margin-top: 10px; text-align: right; font-style: normal; color: #666;">— Автор цитаты</footer></blockquote>',
      preview: 'Стилизованная цитата с указанием автора'
    },
    {
      id: 'table',
      name: 'Таблица',
      html: '<table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #fff;"><thead><tr style="background-color: #f5f5f5;"><th style="border: 1px solid #ddd; padding: 12px; text-align: left; color: #333;">Столбец 1</th><th style="border: 1px solid #ddd; padding: 12px; text-align: left; color: #333;">Столбец 2</th></tr></thead><tbody><tr><td style="border: 1px solid #ddd; padding: 12px; color: #333;">Данные 1</td><td style="border: 1px solid #ddd; padding: 12px; color: #333;">Данные 2</td></tr><tr style="background-color: #f9f9f9;"><td style="border: 1px solid #ddd; padding: 12px; color: #333;">Данные 3</td><td style="border: 1px solid #ddd; padding: 12px; color: #333;">Данные 4</td></tr></tbody></table>',
      preview: 'Простая таблица с заголовками и данными'
    },
    {
      id: 'button',
      name: 'Кнопка',
      html: '<div style="text-align: center; margin: 20px 0;"><button style="padding: 12px 24px; background-color: #007bff; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; transition: background-color 0.3s;" onmouseover="this.style.backgroundColor=\'#0056b3\'" onmouseout="this.style.backgroundColor=\'#007bff\'">Нажмите здесь</button></div>',
      preview: 'Интерактивная кнопка с эффектом наведения'
    },
    {
      id: 'steps-list',
      name: 'Пронумерованный список',
      html: '<div style="margin: 20px 0;">' +
            '<div style="display: flex; align-items: flex-start; margin-bottom: 15px;">' +
            '<div style="background-color: #007bff; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0; font-size: 14px;">1</div>' +
            '<div style="color: #333;"><strong>Первый шаг</strong><br>Описание первого шага</div>' +
            '</div>' +
            '<div style="display: flex; align-items: flex-start; margin-bottom: 15px;">' +
            '<div style="background-color: #007bff; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0; font-size: 14px;">2</div>' +
            '<div style="color: #333;"><strong>Второй шаг</strong><br>Описание второго шага</div>' +
            '</div>' +
            '<div style="display: flex; align-items: flex-start;">' +
            '<div style="background-color: #007bff; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0; font-size: 14px;">3</div>' +
            '<div style="color: #333;"><strong>Третий шаг</strong><br>Описание третьего шага</div>' +
            '</div>' +
            '</div>',
      preview: 'Стилизованный пронумерованный список шагов'
    }
  ];

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Выберите HTML шаблон</h2>
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-slate-700'
                  : 'border-slate-600 bg-slate-700 hover:border-slate-500'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <h3 className="text-white font-semibold mb-2">{template.name}</h3>
              <p className="text-slate-300 text-sm mb-3">{template.preview}</p>
              <div 
                className="bg-white p-3 rounded border text-sm"
                dangerouslySetInnerHTML={{ __html: template.html }}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Отмена
          </Button>
          <Button
            onClick={() => {
              if (selectedTemplate) {
                const template = templates.find(t => t.id === selectedTemplate);
                if (template) {
                  onSelectTemplate(template.html, template.name);
                }
              }
            }}
            disabled={!selectedTemplate}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить шаблон
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HtmlTemplateSelector;
