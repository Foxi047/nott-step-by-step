
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import StepEditor, { Step } from './StepEditor';
import ImageEditor from './ImageEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';

interface MainAreaProps {
  steps: Step[];
  onStepsChange: (steps: Step[]) => void;
  instructionTitle: string;
  onTitleChange: (title: string) => void;
  instructionDescription: string;
  onDescriptionChange: (description: string) => void;
  onPreview: () => void;
  onImageUpload?: () => void;
}

const MainArea: React.FC<MainAreaProps> = ({
  steps,
  onStepsChange,
  instructionTitle,
  onTitleChange,
  instructionDescription,
  onDescriptionChange,
  onPreview,
  onImageUpload
}) => {
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editingImageStepId, setEditingImageStepId] = useState<string | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newSteps = Array.from(steps);
    const [reorderedItem] = newSteps.splice(result.source.index, 1);
    newSteps.splice(result.destination.index, 0, reorderedItem);

    onStepsChange(newSteps);
    toast.success('Порядок шагов изменен');
  };

  const updateStep = (updatedStep: Step) => {
    const newSteps = steps.map(step => 
      step.id === updatedStep.id ? updatedStep : step
    );
    onStepsChange(newSteps);
  };

  const deleteStep = (stepId: string) => {
    const newSteps = steps.filter(step => step.id !== stepId);
    onStepsChange(newSteps);
  };

  const copyStep = (step: Step) => {
    const newStep: Step = {
      ...step,
      id: Date.now().toString(),
      title: step.title ? `${step.title} (копия)` : undefined
    };
    onStepsChange([...steps, newStep]);
  };

  const handleImageSave = (imageUrl: string, stepId?: string) => {
    if (stepId) {
      const updatedSteps = steps.map(step => 
        step.id === stepId ? { ...step, imageUrl } : step
      );
      onStepsChange(updatedSteps);
    } else {
      const newStep: Step = {
        id: Date.now().toString(),
        type: 'image',
        content: '',
        imageUrl,
        title: 'Новое изображение'
      };
      onStepsChange([...steps, newStep]);
    }
    setShowImageEditor(false);
    setEditingImageStepId(null);
    toast.success('Изображение добавлено');
  };

  // Открытие редактора изображений для новых изображений
  React.useEffect(() => {
    if (onImageUpload) {
      setShowImageEditor(true);
    }
  }, []);

  return (
    <div className="flex-1 overflow-auto" style={{ background: 'var(--bg-primary)' }}>
      {showImageEditor && (
        <ImageEditor
          onSave={handleImageSave}
          onCancel={() => {
            setShowImageEditor(false);
            setEditingImageStepId(null);
          }}
          stepId={editingImageStepId}
        />
      )}
      
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Название инструкции"
              value={instructionTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="text-2xl font-bold bg-transparent border-none px-0 focus-visible:ring-0 flex-1 placeholder:opacity-60"
              style={{ 
                color: 'var(--text-primary)'
              }}
            />
            <Button
              onClick={onPreview}
              className="bg-green-600 hover:bg-green-700 ml-4"
            >
              <Eye className="w-4 h-4 mr-2" />
              Предпросмотр
            </Button>
          </div>
          
          <Textarea
            placeholder="Описание инструкции (необязательно)"
            value={instructionDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="resize-none placeholder:opacity-60"
            style={{ 
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            rows={2}
          />
        </div>

        {steps.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Начните создание инструкции
            </h3>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
              Добавьте первый шаг, используя панель слева
            </p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="steps">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {steps.map((step, index) => (
                    <Draggable key={step.id} draggableId={step.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`transition-transform ${
                            snapshot.isDragging ? 'rotate-2 scale-105' : ''
                          }`}
                        >
                          <StepEditor
                            step={step}
                            onUpdate={updateStep}
                            onDelete={deleteStep}
                            onCopy={copyStep}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {steps.length > 0 && (
          <div className="mt-8 text-center">
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Всего шагов: {steps.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainArea;
