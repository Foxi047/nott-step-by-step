import { Step } from '../types/Step';

export const exportToHTML = (title: string, description: string, steps: Step[]): string => {
  const stepHTML = steps.map((step, index) => {
    const stepNumber = index + 1;
    
    switch (step.type) {
      case 'image':
        return `
          <div class="step step-image">
            <h3>Шаг ${stepNumber}${step.title ? `: ${step.title}` : ''}</h3>
            <div class="image-container">
              <img src="${step.imageUrl}" alt="${step.title || 'Изображение'}" />
            </div>
            ${step.content ? `<p>${step.content}</p>` : ''}
          </div>
        `;
      
      case 'code':
        return `
          <div class="step step-code">
            <h3>Шаг ${stepNumber}${step.title ? `: ${step.title}` : ''}</h3>
            <div class="code-container">
              <div class="code-header">
                <span class="language-tag">${step.language || 'javascript'}</span>
                <button onclick="copyCode(this)" class="copy-btn" title="Копировать код">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="m5 15-1-1v-8c0-1 1-2 2-2h8l1 1"></path>
                  </svg>
                  Копировать
                </button>
              </div>
              <pre><code class="language-${step.language || 'javascript'}">${step.content}</code></pre>
            </div>
          </div>
        `;

      case 'html':
        return `
          <div class="step step-html">
            <h3>Шаг ${stepNumber}${step.title ? `: ${step.title}` : ''}</h3>
            <div class="html-content">
              ${step.content}
            </div>
          </div>
        `;

      case 'file':
        return `
          <div class="step step-file">
            <h3>Шаг ${stepNumber}${step.title ? `: ${step.title}` : ''}</h3>
            <div class="file-container">
              <div class="file-info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
                <div class="file-details">
                  <span class="file-name">${step.fileName || 'Файл'}</span>
                  <span class="file-type">${step.fileType || ''}</span>
                </div>
              </div>
              <a href="${step.fileData}" download="${step.fileName}" class="download-btn">
                Скачать файл
              </a>
            </div>
            ${step.content ? `<p>${step.content}</p>` : ''}
          </div>
        `;
      
      default:
        return `
          <div class="step step-text">
            <h3>Шаг ${stepNumber}${step.title ? `: ${step.title}` : ''}</h3>
            <div class="text-content">${step.content}</div>
          </div>
        `;
    }
  }).join('');

  return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            box-sizing: border-box;
        }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
        }
        h1 { 
            color: #2563eb; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 10px; 
            word-wrap: break-word;
        }
        .description { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid #2563eb;
        }
        @media (max-width: 768px) {
            .description {
                padding: 15px;
            }
        }
        .step { 
            margin: 30px 0; 
            padding: 20px; 
            border-radius: 8px; 
            border: 1px solid #e2e8f0;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        @media (max-width: 768px) {
            .step {
                margin: 20px 0;
                padding: 15px;
            }
        }
        .step h3 { 
            color: #1e40af; 
            margin-top: 0; 
            word-wrap: break-word;
        }
        .step-code { 
            background: #1e293b; 
            color: #e2e8f0; 
        }
        .code-container {
            background: #0f172a;
            border-radius: 6px;
            overflow: hidden;
        }
        .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 15px;
            background: #1e293b;
            border-bottom: 1px solid #334155;
            flex-wrap: wrap;
            gap: 8px;
        }
        .language-tag {
            background: #3b82f6;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
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
            font-weight: 500;
            transition: background-color 0.2s;
            min-height: 44px;
        }
        .copy-btn:hover {
            background: #16a34a;
        }
        .copy-btn:active {
            background: #15803d;
        }
        .copy-btn svg {
            width: 14px;
            height: 14px;
        }
        .step-code pre { 
            margin: 0;
            padding: 15px; 
            overflow-x: auto; 
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .step-code code { 
            color: #22c55e; 
            font-family: 'Monaco', 'Consolas', monospace; 
        }
        .image-container {
            text-align: center;
            margin: 15px 0;
        }
        .step-image img { 
            max-width: 100%; 
            height: auto; 
            border-radius: 6px; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            display: inline-block;
        }
        .step-text { 
            background: #fefefe; 
        }
        .text-content {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .step-html {
            background: #fefefe;
        }
        .html-content {
            margin: 15px 0;
            overflow-x: auto;
        }
        .step-file {
            background: #f8fafc;
        }
        .file-container {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            flex-wrap: wrap;
        }
        .file-info {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
            min-width: 200px;
        }
        .file-details {
            display: flex;
            flex-direction: column;
        }
        .file-name {
            font-weight: 500;
            color: #1e40af;
        }
        .file-type {
            font-size: 12px;
            color: #64748b;
        }
        .download-btn {
            background: #3b82f6;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
            min-height: 44px;
            display: flex;
            align-items: center;
            white-space: nowrap;
        }
        .download-btn:hover {
            background: #2563eb;
        }
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #22c55e;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 1000;
        }
        .toast.show {
            transform: translateX(0);
        }
        @media (max-width: 480px) {
            .toast {
                right: 10px;
                left: 10px;
                transform: translateY(-100%);
            }
            .toast.show {
                transform: translateY(0);
            }
            .file-container {
                flex-direction: column;
                align-items: stretch;
                gap: 10px;
            }
            .file-info {
                min-width: auto;
            }
        }
        @media print {
            body { padding: 0; }
            .step { break-inside: avoid; }
            .copy-btn { display: none; }
            .download-btn { display: none; }
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    ${description ? `<div class="description">${description}</div>` : ''}
    <div class="steps">
        ${stepHTML}
    </div>
    <footer style="margin-top: 50px; text-align: center; color: #64748b; font-size: 14px;">
        <p>Создано с помощью Nott Instructions - продвинутый редактор пошаговых инструкций с поддержкой изображений, кода, HTML-контента и файлов</p>
    </footer>

    <script>
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
            if (existingToast) {
                existingToast.remove();
            }
            
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
</html>
  `.trim();
};

export const exportToMarkdown = (title: string, description: string, steps: Step[]): string => {
  const stepMarkdown = steps.map((step, index) => {
    const stepNumber = index + 1;
    const stepTitle = step.title ? `: ${step.title}` : '';
    
    switch (step.type) {
      case 'image':
        return `
## Шаг ${stepNumber}${stepTitle}

![${step.title || 'Изображение'}](${step.imageUrl})

${step.content || ''}
        `.trim();
      
      case 'code':
        return `
## Шаг ${stepNumber}${stepTitle}

\`\`\`${step.language || 'javascript'}
${step.content}
\`\`\`
        `.trim();

      case 'html':
        return `
## Шаг ${stepNumber}${stepTitle}

${step.content}
        `.trim();

      case 'file':
        return `
## Шаг ${stepNumber}${stepTitle}

📎 **Файл:** ${step.fileName} (${step.fileType})

${step.content || ''}
        `.trim();
      
      default:
        return `
## Шаг ${stepNumber}${stepTitle}

${step.content}
        `.trim();
    }
  }).join('\n\n');

  return `
# ${title}

${description ? `*${description}*\n` : ''}

${stepMarkdown}

---
*Создано с помощью Nott Instructions - продвинутый редактор пошаговых инструкций с поддержкой изображений, кода, HTML-контента и файлов*
  `.trim();
};

export const exportToJSON = (title: string, description: string, steps: Step[]): string => {
  const data = {
    title,
    description,
    steps: steps.map(step => ({
      id: step.id,
      type: step.type,
      title: step.title,
      content: step.content,
      language: step.language,
      imageUrl: step.imageUrl,
      annotations: step.annotations,
      fileData: step.fileData,
      fileName: step.fileName,
      fileType: step.fileType
    })),
    exportedAt: new Date().toISOString(),
    version: '2.0',
    features: [
      'Продвинутое редактирование изображений с аннотациями',
      'Поддержка HTML-контента',
      'Прикрепление файлов',
      'Адаптивный дизайн для мобильных устройств',
      'Экспорт в различные форматы'
    ]
  };
  
  return JSON.stringify(data, null, 2);
};

export const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
