
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import StepEditor, { Step } from './StepEditor';
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
  onEditImage?: (stepId: string) => void;
  onUpdateStep: (step: Step) => void;
  onDeleteStep: (stepId: string) => void;
  onCopyStep: (step: Step) => void;
}

const MainArea: React.FC<MainAreaProps> = ({
  steps,
  onStepsChange,
  instructionTitle,
  onTitleChange,
  instructionDescription,
  onDescriptionChange,
  onPreview,
  onEditImage,
  onUpdateStep,
  onDeleteStep,
  onCopyStep
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newSteps = Array.from(steps);
    const [reorderedItem] = newSteps.splice(result.source.index, 1);
    newSteps.splice(result.destination.index, 0, reorderedItem);

    onStepsChange(newSteps);
    toast.success('Порядок шагов изменен');
  };

  return (
    <div className="flex-1 overflow-auto px-4 pt-16 md:pt-0 md:px-0" style={{ background: 'var(--bg-primary)' }}>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <Input
              placeholder="Название инструкции"
              value={instructionTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="text-xl sm:text-2xl font-bold bg-transparent border-none px-0 focus-visible:ring-0 flex-1 placeholder:opacity-60"
              style={{ 
                color: 'var(--text-primary)'
              }}
            />
            <Button
              onClick={onPreview}
              className="bg-green-600 hover:bg-green-700 min-w-[44px] min-h-[44px] w-full sm:w-auto"
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
            <div className="text-4xl sm:text-6xl mb-4">📝</div>
            <h3 className="text-lg sm:text-xl font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Начните создание инструкции
            </h3>
            <p className="mb-4 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
              Добавьте первый шаг, используя панель слева или кнопку меню
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
                          className={`transition-transform w-full ${
                            snapshot.isDragging ? 'rotate-2 scale-105' : ''
                          }`}
                        >
                          <StepEditor
                            step={step}
                            onUpdate={onUpdateStep}
                            onDelete={onDeleteStep}
                            onCopy={onCopyStep}
                            onEditImage={onEditImage}
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
            <div className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              Всего шагов: {steps.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainArea;
