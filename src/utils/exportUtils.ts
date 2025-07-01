import { Step, StepGroup } from '../types/Step';

export const exportToHTML = (
  title: string, 
  description: string, 
  steps: Step[], 
  groups: StepGroup[] = [], 
  password?: string,
  selectedTheme: 'light' | 'gray' | 'dark' = 'dark'
): string => {
  const getThemeStyles = (theme: 'light' | 'gray' | 'dark') => {
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

  const themeStyles = getThemeStyles(selectedTheme);

  const generateMainContent = () => `
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
                      <pre><code>${step.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
                    </div>
                  ` : step.type === 'image' && step.imageUrl ? `
                    <img src="${step.imageUrl}" alt="${step.title || ''}" />
                    ${step.content ? `<div class="step-text">${step.content}</div>` : ''}
                  ` : step.type === 'html' ? `
                    <div class="html-content">${step.content}</div>
                  ` : step.type === 'file' && step.fileData ? `
                    <div class="file-content">
                      <a href="${step.fileData}" download="${step.fileName || 'file'}" class="file-link">
                        📎 ${step.fileName || 'Скачать файл'}
                      </a>
                      ${step.content ? `<div class="step-text">${step.content}</div>` : ''}
                    </div>
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
                <pre><code>${step.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
              </div>
            ` : step.type === 'image' && step.imageUrl ? `
              <img src="${step.imageUrl}" alt="${step.title || ''}" />
              ${step.content ? `<div class="step-text">${step.content}</div>` : ''}
            ` : step.type === 'html' ? `
              <div class="html-content">${step.content}</div>
            ` : step.type === 'file' && step.fileData ? `
              <div class="file-content">
                <a href="${step.fileData}" download="${step.fileName || 'file'}" class="file-link">
                  📎 ${step.fileName || 'Скачать файл'}
                </a>
                ${step.content ? `<div class="step-text">${step.content}</div>` : ''}
              </div>
            ` : `
              <div class="step-text">${step.content}</div>
            `}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  const html = `<!DOCTYPE html>
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
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: ${themeStyles.cardBg}; 
            padding: 40px; 
            border-radius: 12px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
        }
        h1 { 
            color: ${themeStyles.text}; 
            margin-bottom: 10px; 
            font-size: 2rem; 
        }
        .description { 
            color: ${themeStyles.secondary}; 
            margin-bottom: 30px; 
            font-size: 1.1rem; 
        }
        
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
            overflow: visible;
        }
        .group-content.collapsed { 
            max-height: 0; 
            overflow: hidden;
        }
        .group-content.expanded { 
            max-height: none;
            overflow: visible;
        }
        
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
        .html-content {
            border: 1px solid ${themeStyles.border};
            border-radius: 6px;
            padding: 15px;
            background: ${themeStyles.cardBg};
        }
        .file-content {
            border: 1px solid ${themeStyles.border};
            border-radius: 6px;
            padding: 15px;
            background: ${themeStyles.cardBg};
        }
        .file-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
            padding: 8px 12px;
            border: 1px solid #3b82f6;
            border-radius: 6px;
            transition: all 0.2s;
        }
        .file-link:hover {
            background: #3b82f6;
            color: white;
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
    ${password ? `
    <div id="password-modal" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    ">
        <div style="
            background: ${themeStyles.cardBg};
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        ">
            <h2 style="color: ${themeStyles.text}; margin-bottom: 20px;">🔒 Защищённая инструкция</h2>
            <p style="color: ${themeStyles.secondary}; margin-bottom: 20px;">Введите пароль для просмотра содержимого</p>
            <input
                type="password"
                id="password-input"
                placeholder="Пароль"
                style="
                    width: 100%;
                    padding: 12px;
                    border: 2px solid ${themeStyles.border};
                    border-radius: 6px;
                    font-size: 16px;
                    margin-bottom: 20px;
                    background: ${themeStyles.bg};
                    color: ${themeStyles.text};
                "
            />
            <button
                onclick="checkPassword()"
                style="
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-size: 16px;
                    cursor: pointer;
                    width: 100%;
                    transition: background-color 0.2s;
                "
                onmouseover="this.style.background='#2563eb'"
                onmouseout="this.style.background='#3b82f6'"
            >
                Войти
            </button>
            <p id="password-error" style="color: #ef4444; margin-top: 10px; display: none;">Неверный пароль</p>
        </div>
    </div>
    <div id="main-content" style="display: none;">
        ${generateMainContent()}
    </div>
    ` : generateMainContent()}
    
    <script>
        ${password ? `
        function checkPassword() {
            const input = document.getElementById('password-input');
            const error = document.getElementById('password-error');
            
            if (input.value === '${password}') {
                document.getElementById('password-modal').style.display = 'none';
                document.getElementById('main-content').style.display = 'block';
            } else {
                error.style.display = 'block';
                input.value = '';
                input.focus();
            }
        }
        
        document.getElementById('password-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
        
        // Фокус на поле ввода при загрузке
        document.getElementById('password-input').focus();
        ` : ''}
        
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

  return html;
};

export const exportToMarkdown = (title: string, description: string, steps: Step[]): string => {
  let markdown = `# ${title}\n\n`;
  
  if (description) {
    markdown += `${description}\n\n`;
  }
  
  let stepNumber = 1;
  
  steps.forEach((step) => {
    markdown += `## ${stepNumber}. ${step.title || 'Шаг'}\n\n`;
    
    if (step.type === 'code') {
      const lang = step.language || '';
      markdown += `\`\`\`${lang}\n${step.content}\n\`\`\`\n\n`;
    } else if (step.type === 'image' && step.imageUrl) {
      markdown += `![${step.title || 'Изображение'}](${step.imageUrl})\n\n`;
      if (step.content) {
        markdown += `${step.content}\n\n`;
      }
    } else if (step.type === 'html') {
      markdown += `\`\`\`html\n${step.content}\n\`\`\`\n\n`;
    } else if (step.type === 'file' && step.fileName) {
      markdown += `📎 [${step.fileName}](${step.fileData || '#'})\n\n`;
      if (step.content) {
        markdown += `${step.content}\n\n`;
      }
    } else {
      markdown += `${step.content}\n\n`;
    }
    
    stepNumber++;
  });
  
  return markdown;
};

export const exportToJSON = (title: string, description: string, steps: Step[], groups: StepGroup[] = []): string => {
  const data = {
    title,
    description,
    steps,
    groups,
    exportedAt: new Date().toISOString(),
    version: '2.1.0'
  };
  
  return JSON.stringify(data, null, 2);
};

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
