
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Edit, Trash2, Copy, FileText, Eye } from 'lucide-react';
import { useInstructionStorage } from '../hooks/useInstructionStorage';
import { Step } from './StepEditor';
import { toast } from 'sonner';

interface SavedProjectsProps {
  onClose: () => void;
  onLoadProject: (title: string, description: string, steps: Step[]) => void;
  onPreviewProject: (title: string, description: string, steps: Step[]) => void;
}

const SavedProjects: React.FC<SavedProjectsProps> = ({ 
  onClose, 
  onLoadProject,
  onPreviewProject 
}) => {
  const { instructions, deleteInstruction } = useInstructionStorage();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const handleEdit = (instruction: any) => {
    onLoadProject(instruction.title, instruction.description, instruction.steps);
    onClose();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      deleteInstruction(id);
      toast.success('Проект удален');
    }
  };

  const handleCopyHTML = async (instruction: any) => {
    try {
      // Простая генерация HTML
      const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${instruction.title}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        .step { margin: 20px 0; padding: 15px; border-left: 4px solid #007bff; }
        .step-title { font-weight: bold; margin-bottom: 10px; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; }
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
    <h1>${instruction.title}</h1>
    ${instruction.description ? `<p>${instruction.description}</p>` : ''}
    ${instruction.steps.map((step: Step, index: number) => `
        <div class="step">
            <div class="step-title">Шаг ${index + 1}: ${step.title || ''}</div>
            ${step.type === 'code' ? `<pre><code>${step.content}</code></pre>` : 
              step.type === 'image' && step.imageUrl ? `<img src="${step.imageUrl}" alt="${step.title || ''}" />` :
              `<p>${step.content}</p>`}
        </div>
    `).join('')}
</body>
</html>`;
      
      await navigator.clipboard.writeText(html);
      toast.success('HTML код скопирован в буфер обмена');
    } catch (error) {
      toast.error('Ошибка копирования');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Сохранённые проекты</h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {instructions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">Нет сохранённых проектов</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {instructions.map((instruction) => (
              <div
                key={instruction.id}
                className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors"
              >
                <div className="mb-3">
                  <h3 className="font-medium text-white truncate">{instruction.title}</h3>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                    {instruction.description || 'Без описания'}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {instruction.steps.length} шагов
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(instruction.updatedAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                
                <div className="flex gap-1 flex-wrap">
                  <Button
                    size="sm"
                    onClick={() => handleEdit(instruction)}
                    className="bg-blue-600 hover:bg-blue-700 text-xs"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Редактировать
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => onPreviewProject(instruction.title, instruction.description, instruction.steps)}
                    className="bg-green-600 hover:bg-green-700 text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Просмотр
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => handleCopyHTML(instruction)}
                    className="bg-purple-600 hover:bg-purple-700 text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    HTML
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(instruction.id)}
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white text-xs"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProjects;
