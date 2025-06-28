import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Step, StepGroup } from '../types/Step';
import StepEditor from './StepEditor';
import StepGroupComponent from './StepGroup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface MainAreaProps {
  steps: Step[];
  groups: StepGroup[];
  ungroupedSteps: Step[];
  onStepsChange: (steps: Step[]) => void;
  onCreateGroup: (title: string) => void;
  onUpdateGroup: (groupId: string, updates: Partial<StepGroup>) => void;
  onDeleteGroup: (groupId: string) => void;
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
  groups,
  ungroupedSteps,
  onStepsChange,
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
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
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [showNewGroupInput, setShowNewGroupInput] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    // Handle reordering within groups or ungrouped steps
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'ungrouped') {
        const newUngroupedSteps = Array.from(ungroupedSteps);
        const [reorderedItem] = newUngroupedSteps.splice(source.index, 1);
        newUngroupedSteps.splice(destination.index, 0, reorderedItem);
        
        // Update all steps array
        const allGroupedSteps = groups.flatMap(g => g.steps);
        onStepsChange([...allGroupedSteps, ...newUngroupedSteps]);
      } else {
        const groupId = source.droppableId.replace('group-', '');
        const group = groups.find(g => g.id === groupId);
        if (group) {
          const newSteps = Array.from(group.steps);
          const [reorderedItem] = newSteps.splice(source.index, 1);
          newSteps.splice(destination.index, 0, reorderedItem);
          onUpdateGroup(groupId, { steps: newSteps });
        }
      }
    } else {
      // Handle moving between groups or from ungrouped to group
      let sourceStep: Step | undefined;
      
      // Get the step being moved
      if (source.droppableId === 'ungrouped') {
        sourceStep = ungroupedSteps[source.index];
      } else {
        const sourceGroupId = source.droppableId.replace('group-', '');
        const sourceGroup = groups.find(g => g.id === sourceGroupId);
        sourceStep = sourceGroup?.steps[source.index];
      }
      
      if (!sourceStep) return;
      
      // Remove from source
      if (source.droppableId === 'ungrouped') {
        const newUngroupedSteps = ungroupedSteps.filter((_, index) => index !== source.index);
        const allGroupedSteps = groups.flatMap(g => g.steps);
        onStepsChange([...allGroupedSteps, ...newUngroupedSteps]);
      } else {
        const sourceGroupId = source.droppableId.replace('group-', '');
        const sourceGroup = groups.find(g => g.id === sourceGroupId);
        if (sourceGroup) {
          const newSteps = sourceGroup.steps.filter((_, index) => index !== source.index);
          onUpdateGroup(sourceGroupId, { steps: newSteps });
        }
      }
      
      // Add to destination
      if (destination.droppableId === 'ungrouped') {
        const newUngroupedSteps = Array.from(ungroupedSteps);
        newUngroupedSteps.splice(destination.index, 0, { ...sourceStep, groupId: undefined });
        const allGroupedSteps = groups.flatMap(g => g.steps);
        onStepsChange([...allGroupedSteps, ...newUngroupedSteps]);
      } else {
        const destGroupId = destination.droppableId.replace('group-', '');
        const destGroup = groups.find(g => g.id === destGroupId);
        if (destGroup) {
          const newSteps = Array.from(destGroup.steps);
          newSteps.splice(destination.index, 0, { ...sourceStep, groupId: destGroupId });
          onUpdateGroup(destGroupId, { steps: newSteps });
        }
      }
    }
    
    toast.success('Порядок шагов изменен');
  };

  const handleCreateGroup = () => {
    if (newGroupTitle.trim()) {
      onCreateGroup(newGroupTitle.trim());
      setNewGroupTitle('');
      setShowNewGroupInput(false);
      toast.success('Группа создана');
    }
  };

  const totalSteps = groups.reduce((sum, group) => sum + group.steps.length, 0) + ungroupedSteps.length;

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

        <div className="mb-6">
          <div className="flex gap-2 items-center">
            {!showNewGroupInput ? (
              <Button
                onClick={() => setShowNewGroupInput(true)}
                className="bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Создать группу
              </Button>
            ) : (
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Название группы"
                  value={newGroupTitle}
                  onChange={(e) => setNewGroupTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateGroup()}
                  className="w-48"
                />
                <Button onClick={handleCreateGroup} size="sm" className="bg-green-600 hover:bg-green-700">
                  Создать
                </Button>
                <Button onClick={() => setShowNewGroupInput(false)} size="sm" variant="outline">
                  Отмена
                </Button>
              </div>
            )}
          </div>
        </div>

        {totalSteps === 0 ? (
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
            <div className="space-y-6">
              {groups.map((group) => (
                <StepGroupComponent
                  key={group.id}
                  group={group}
                  onUpdateGroup={onUpdateGroup}
                  onDeleteGroup={onDeleteGroup}
                  onUpdateStep={onUpdateStep}
                  onDeleteStep={onDeleteStep}
                  onCopyStep={onCopyStep}
                  onEditImage={onEditImage}
                />
              ))}

              {ungroupedSteps.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-300">Без группы</h3>
                  <Droppable droppableId="ungrouped">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                      >
                        {ungroupedSteps.map((step, index) => (
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
                </div>
              )}
            </div>
          </DragDropContext>
        )}

        {totalSteps > 0 && (
          <div className="mt-8 text-center">
            <div className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
              Всего шагов: {totalSteps} {groups.length > 0 && `в ${groups.length} группах`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainArea;
