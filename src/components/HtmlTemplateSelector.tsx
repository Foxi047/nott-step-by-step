
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HtmlTemplateSelectorProps {
  onSelectTemplate: (template: string, title: string) => void;
  onCancel: () => void;
}

const HtmlTemplateSelector: React.FC<HtmlTemplateSelectorProps> = ({
  onSelectTemplate,
  onCancel
}) => {
  const templates = [
    {
      title: 'Таблица',
      icon: '📋',
      html: `<table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
  <thead>
    <tr style="background-color: #f3f4f6;">
      <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Заголовок 1</th>
      <th style="border: 1px solid #d1d5db; padding: 12px; text-align: left;">Заголовок 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #d1d5db; padding: 12px;">Ячейка 1</td>
      <td style="border: 1px solid #d1d5db; padding: 12px;">Ячейка 2</td>
    </tr>
  </tbody>
</table>`
    },
    {
      title: 'Маркированный список',
      icon: '•',
      html: `<ul style="margin: 16px 0; padding-left: 24px;">
  <li style="margin: 8px 0;">Первый пункт</li>
  <li style="margin: 8px 0;">Второй пункт</li>
  <li style="margin: 8px 0;">Третий пункт</li>
</ul>`
    },
    {
      title: 'Нумерованный список',
      icon: '1.',
      html: `<ol style="margin: 16px 0; padding-left: 24px;">
  <li style="margin: 8px 0;">Первый шаг</li>
  <li style="margin: 8px 0;">Второй шаг</li>
  <li style="margin: 8px 0;">Третий шаг</li>
</ol>`
    },
    {
      title: 'Заголовки',
      icon: 'H',
      html: `<h2 style="color: #1f2937; margin: 24px 0 16px 0; font-size: 24px; font-weight: bold;">Заголовок 2</h2>
<h3 style="color: #374151; margin: 20px 0 12px 0; font-size: 20px; font-weight: bold;">Заголовок 3</h3>
<p style="margin: 12px 0; line-height: 1.6;">Обычный текст параграфа.</p>`
    },
    {
      title: 'Блок с рамкой',
      icon: '▢',
      html: `<div style="border: 2px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0; background-color: #f9fafb;">
  <h4 style="margin: 0 0 12px 0; color: #374151; font-weight: bold;">Важная информация</h4>
  <p style="margin: 0; line-height: 1.6;">Содержимое блока с рамкой.</p>
</div>`
    },
    {
      title: 'Встроенное видео',
      icon: '▶️',
      html: `<div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%; margin: 16px 0;">
  <iframe 
    src="https://www.youtube.com/embed/VIDEO_ID" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px;"
    allowfullscreen>
  </iframe>
</div>`
    },
    {
      title: 'Ссылка',
      icon: '🔗',
      html: `<a href="https://example.com" 
   style="color: #3b82f6; text-decoration: underline; font-weight: 500;"
   target="_blank" 
   rel="noopener noreferrer">
  Перейти по ссылке
</a>`
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Выберите HTML шаблон
            <Button variant="ghost" onClick={onCancel}>✕</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-slate-50"
                onClick={() => onSelectTemplate(template.html, template.title)}
              >
                <span className="text-2xl">{template.icon}</span>
                <span className="text-sm font-medium">{template.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HtmlTemplateSelector;
