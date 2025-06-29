
import { Step, StepGroup } from '../types/Step';

export const exportToHTML = (title: string, description: string, steps: Step[], groups?: StepGroup[]) => {
  const stepsByGroup = new Map<string, Step[]>();
  const ungroupedSteps: Step[] = [];
  
  // Группируем шаги
  steps.forEach(step => {
    if (step.groupId) {
      if (!stepsByGroup.has(step.groupId)) {
        stepsByGroup.set(step.groupId, []);
      }
      stepsByGroup.get(step.groupId)!.push(step);
    } else {
      ungroupedSteps.push(step);
    }
  });

  const getStepHTML = (step: Step) => {
    const getStepClasses = () => {
      const baseClasses = 'step border rounded-lg p-4 mb-4 transition-colors';
      
      if (!step.style?.type || step.style.type === 'default') {
        return `${baseClasses} step-default`;
      }
      
      switch (step.style.type) {
        case 'info':
          return `${baseClasses} step-info`;
        case 'warning':
          return `${baseClasses} step-warning`;
        case 'success':
          return `${baseClasses} step-success`;
        case 'error':
          return `${baseClasses} step-error`;
        default:
          return `${baseClasses} step-default`;
      }
    };

    const getStepIcon = () => {
      if (step.style?.icon) {
        return step.style.icon;
      }
      
      switch (step.type) {
        case 'text': return '📝';
        case 'code': return '💻';
        case 'image': return '🖼️';
        case 'html': return '🌐';
        case 'file': return '📎';
        default: return '📄';
      }
    };

    let content = '';
    
    switch (step.type) {
      case 'text':
        content = `<p>${step.content?.replace(/\n/g, '<br>') || ''}</p>`;
        break;
      case 'code':
        content = `
          <div class="code-wrapper">
            <div class="code-header">
              <span class="code-language">${step.language || 'javascript'}</span>
              <button class="copy-btn" onclick="copyToClipboard(this)" data-code="${step.content?.replace(/"/g, '&quot;') || ''}">📋</button>
            </div>
            <pre class="code-block"><code class="language-${step.language || 'javascript'}">${step.content || ''}</code></pre>
          </div>
        `;
        break;
      case 'html':
        content = step.content || '';
        break;
      case 'image':
        content = `<div class="image-container">
          ${step.imageUrl ? `<img src="${step.imageUrl}" alt="${step.title || 'Изображение'}" class="step-image">` : ''}
          ${step.content ? `<p class="image-caption">${step.content}</p>` : ''}
        </div>`;
        break;
      case 'file':
        content = `<div class="file-attachment">
          <span class="file-icon">📎</span>
          <span class="file-name">${step.title || 'Файл'}</span>
          ${step.content ? `<p class="file-description">${step.content}</p>` : ''}
        </div>`;
        break;
    }

    return `
      <div class="${getStepClasses()}">
        <div class="step-header">
          <span class="step-icon">${getStepIcon()}</span>
          <span class="step-type">${step.type}</span>
        </div>
        ${step.title ? `<h3 class="step-title">${step.title}</h3>` : ''}
        <div class="step-content">${content}</div>
      </div>
    `;
  };

  const getGroupHTML = (group: StepGroup) => {
    const groupSteps = stepsByGroup.get(group.id) || [];
    
    const getGroupClasses = () => {
      const baseClasses = 'group rounded-lg p-4 mb-4 border-2 shadow-lg';
      
      if (!group.style?.type || group.style.type === 'default') {
        return `${baseClasses} group-default`;
      }
      
      switch (group.style.type) {
        case 'info':
          return `${baseClasses} group-info`;
        case 'warning':
          return `${baseClasses} group-warning`;
        case 'success':
          return `${baseClasses} group-success`;
        case 'error':
          return `${baseClasses} group-error`;
        default:
          return `${baseClasses} group-default`;
      }
    };

    const getGroupIcon = () => {
      if (group.style?.icon) {
        return group.style.icon;
      }
      return '📁';
    };

    return `
      <div class="${getGroupClasses()}">
        <div class="group-header" onclick="toggleGroup('${group.id}')">
          <span class="group-toggle" id="toggle-${group.id}">▼</span>
          <span class="group-icon">${getGroupIcon()}</span>
          <h2 class="group-title">${group.title}</h2>
          <span class="group-count">${groupSteps.length} шагов</span>
        </div>
        <div class="group-steps" id="steps-${group.id}">
          ${groupSteps.map(step => getStepHTML(step)).join('')}
        </div>
      </div>
    `;
  };

  const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #f1f5f9;
            background: #0f172a;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #334155;
            padding-bottom: 20px;
        }
        .title {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 10px;
            color: #f1f5f9;
        }
        .description {
            font-size: 1.1rem;
            color: #94a3b8;
            margin-bottom: 0;
        }
        
        /* Step Styles */
        .step {
            margin-bottom: 20px;
        }
        .step-default {
            background: #1e293b;
            border-color: #334155;
        }
        .step-info {
            background: rgba(30, 58, 138, 0.3);
            border-color: rgba(29, 78, 216, 0.7);
        }
        .step-warning {
            background: rgba(133, 77, 14, 0.3);
            border-color: rgba(217, 119, 6, 0.7);
        }
        .step-success {
            background: rgba(20, 83, 45, 0.3);
            border-color: rgba(34, 197, 94, 0.7);
        }
        .step-error {
            background: rgba(127, 29, 29, 0.3);
            border-color: rgba(239, 68, 68, 0.7);
        }
        
        /* Group Styles */
        .group {
            background: rgba(71, 85, 105, 0.5);
            border-color: rgba(147, 51, 234, 0.3);
        }
        .group-default {
            background: rgba(71, 85, 105, 0.5);
            border-color: rgba(147, 51, 234, 0.3);
        }
        .group-info {
            background: rgba(30, 58, 138, 0.4);
            border-color: rgba(29, 78, 216, 0.5);
        }
        .group-warning {
            background: rgba(133, 77, 14, 0.4);
            border-color: rgba(217, 119, 6, 0.5);
        }
        .group-success {
            background: rgba(20, 83, 45, 0.4);
            border-color: rgba(34, 197, 94, 0.5);
        }
        .group-error {
            background: rgba(127, 29, 29, 0.4);
            border-color: rgba(239, 68, 68, 0.5);
        }
        
        .step-header, .group-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
        }
        .group-header {
            cursor: pointer;
            user-select: none;
        }
        .group-toggle {
            font-size: 1rem;
            transition: transform 0.2s;
        }
        .group-toggle.collapsed {
            transform: rotate(-90deg);
        }
        .step-icon, .group-icon {
            font-size: 1.2rem;
        }
        .step-type {
            font-size: 0.875rem;
            color: #94a3b8;
            text-transform: capitalize;
        }
        .group-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #c084fc;
            margin: 0;
        }
        .group-count {
            font-size: 0.75rem;
            color: #c084fc;
            background: rgba(147, 51, 234, 0.3);
            padding: 2px 8px;
            border-radius: 4px;
            margin-left: auto;
        }
        .step-title {
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0 0 10px 0;
            color: #f1f5f9;
        }
        .step-content {
            color: #e2e8f0;
        }
        .code-wrapper {
            margin: 10px 0;
        }
        .code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #0f172a;
            padding: 8px 12px;
            border-radius: 6px 6px 0 0;
            border: 1px solid #2d3748;
            border-bottom: none;
        }
        .code-language {
            font-size: 0.8rem;
            color: #94a3b8;
            text-transform: uppercase;
        }
        .copy-btn {
            background: none;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            font-size: 1rem;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        .copy-btn:hover {
            background: rgba(148, 163, 184, 0.1);
            color: #f1f5f9;
        }
        .code-block {
            background: #1a202c;
            border: 1px solid #2d3748;
            border-radius: 0 0 6px 6px;
            padding: 15px;
            overflow-x: auto;
            margin: 0;
        }
        .step-image {
            max-width: 100%;
            height: auto;
            border-radius: 6px;
            border: 1px solid #334155;
        }
        .image-container {
            text-align: center;
        }
        .image-caption {
            font-size: 0.9rem;
            color: #94a3b8;
            margin-top: 8px;
        }
        .file-attachment {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px;
            background: #1e293b;
            border-radius: 6px;
            border: 1px solid #334155;
        }
        .file-icon {
            font-size: 1.2rem;
        }
        .file-name {
            font-weight: 500;
            color: #f1f5f9;
        }
        .file-description {
            color: #94a3b8;
            margin: 0;
        }
        .group-steps {
            padding-left: 20px;
            transition: max-height 0.3s ease;
            overflow: hidden;
        }
        .group-steps.collapsed {
            max-height: 0;
            padding: 0 20px;
        }
        
        @media (max-width: 640px) {
            body {
                padding: 10px;
            }
            .title {
                font-size: 2rem;
            }
            .step {
                padding: 15px;
            }
            .group-steps {
                padding-left: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${title}</h1>
        ${description ? `<p class="description">${description}</p>` : ''}
    </div>
    
    <div class="content">
        ${groups ? groups.map(group => getGroupHTML(group)).join('') : ''}
        ${ungroupedSteps.length > 0 ? `
            <div class="ungrouped-steps">
                <h3 style="color: #94a3b8; margin-bottom: 20px;">📋 Шаги без группы</h3>
                ${ungroupedSteps.map(step => getStepHTML(step)).join('')}
            </div>
        ` : ''}
    </div>
    
    <script>
        function copyToClipboard(button) {
            const code = button.getAttribute('data-code');
            navigator.clipboard.writeText(code).then(() => {
                const originalText = button.textContent;
                button.textContent = '✅';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            }).catch(() => {
                button.textContent = '❌';
                setTimeout(() => {
                    button.textContent = '📋';
                }, 2000);
            });
        }
        
        function toggleGroup(groupId) {
            const toggle = document.getElementById('toggle-' + groupId);
            const steps = document.getElementById('steps-' + groupId);
            
            if (steps.classList.contains('collapsed')) {
                steps.classList.remove('collapsed');
                toggle.classList.remove('collapsed');
                toggle.textContent = '▼';
            } else {
                steps.classList.add('collapsed');
                toggle.classList.add('collapsed');
                toggle.textContent = '▶';
            }
        }
    </script>
</body>
</html>
  `;

  return html.trim();
};

export const exportToMarkdown = (title: string, description: string, steps: Step[]) => {
  let markdown = `# ${title}\n\n`;
  
  if (description) {
    markdown += `${description}\n\n`;
  }

  steps.forEach((step, index) => {
    const getStepIcon = () => {
      if (step.style?.icon) {
        return step.style.icon;
      }
      
      switch (step.type) {
        case 'text': return '📝';
        case 'code': return '💻';
        case 'image': return '🖼️';
        case 'html': return '🌐';
        case 'file': return '📎';
        default: return '📄';
      }
    };

    markdown += `## ${getStepIcon()} ${step.title || `Шаг ${index + 1}`}\n\n`;

    switch (step.type) {
      case 'text':
        markdown += `${step.content || ''}\n\n`;
        break;
      case 'code':
        markdown += `\`\`\`${step.language || 'javascript'}\n${step.content || ''}\n\`\`\`\n\n`;
        break;
      case 'html':
        markdown += `\`\`\`html\n${step.content || ''}\n\`\`\`\n\n`;
        break;
      case 'image':
        if (step.imageUrl) {
          markdown += `![${step.title || 'Изображение'}](${step.imageUrl})\n\n`;
        }
        if (step.content) {
          markdown += `${step.content}\n\n`;
        }
        break;
      case 'file':
        markdown += `📎 **Файл:** ${step.title || 'Прикрепленный файл'}\n\n`;
        if (step.content) {
          markdown += `${step.content}\n\n`;
        }
        break;
    }
  });

  return markdown;
};

export const exportToJSON = (title: string, description: string, steps: Step[]) => {
  return JSON.stringify({
    title,
    description,
    steps,
    exportedAt: new Date().toISOString()
  }, null, 2);
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
