
import { Step } from '../components/StepEditor';

export const exportToHTML = (title: string, description: string, steps: Step[]): string => {
  const stepHTML = steps.map((step, index) => {
    const stepNumber = index + 1;
    
    switch (step.type) {
      case 'image':
        return `
          <div class="step step-image">
            <h3>Шаг ${stepNumber}${step.title ? `: ${step.title}` : ''}</h3>
            <img src="${step.imageUrl}" alt="${step.title || 'Изображение'}" />
            ${step.content ? `<p>${step.content}</p>` : ''}
          </div>
        `;
      
      case 'code':
        return `
          <div class="step step-code">
            <h3>Шаг ${stepNumber}${step.title ? `: ${step.title}` : ''}</h3>
            <pre><code class="language-${step.language || 'javascript'}">${step.content}</code></pre>
          </div>
        `;
      
      default:
        return `
          <div class="step step-text">
            <h3>Шаг ${stepNumber}${step.title ? `: ${step.title}` : ''}</h3>
            <p>${step.content}</p>
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
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        h1 { 
            color: #2563eb; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 10px; 
        }
        .description { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid #2563eb;
        }
        .step { 
            margin: 30px 0; 
            padding: 20px; 
            border-radius: 8px; 
            border: 1px solid #e2e8f0;
        }
        .step h3 { 
            color: #1e40af; 
            margin-top: 0; 
        }
        .step-code { 
            background: #1e293b; 
            color: #e2e8f0; 
        }
        .step-code pre { 
            background: #0f172a; 
            padding: 15px; 
            border-radius: 6px; 
            overflow-x: auto; 
        }
        .step-code code { 
            color: #22c55e; 
            font-family: 'Monaco', 'Consolas', monospace; 
        }
        .step-image img { 
            max-width: 100%; 
            height: auto; 
            border-radius: 6px; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .step-text { 
            background: #fefefe; 
        }
        @media print {
            body { padding: 0; }
            .step { break-inside: avoid; }
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
        <p>Создано с помощью Nott Instructions</p>
    </footer>
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
*Создано с помощью Nott Instructions*
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
      annotations: step.annotations
    })),
    exportedAt: new Date().toISOString(),
    version: '1.0'
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
