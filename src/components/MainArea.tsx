
import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Step, StepGroup } from '../types/Step';
import StepEditor from './StepEditor';
import StepGroupComponent from './StepGroup';
import InstructionHeader from './InstructionHeader';
import GroupCreator from './GroupCreator';
import EmptyState from './EmptyState';
import FileEditor from './FileEditor';
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
  onAddStepToGroup?: (groupId: string, type: 'text' | 'image' | 'code' | 'html' | 'file') => void;
  onAddHtmlWithTemplate?: (groupId?: string) => void;
  onLoadImage?: (groupId?: string) => void;
  onAddFileToGroup?: (groupId: string) => void;
  onReorderGroups?: (newGroups: StepGroup[]) => void;
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
  onCopyStep,
  onAddStepToGroup,
  onAddHtmlWithTemplate,
  onLoadImage,
  onAddFileToGroup,
  onReorderGroups
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    // Handle group reordering
    if (result.type === 'group') {
      const newGroups = Array.from(groups);
      const [reorderedGroup] = newGroups.splice(source.index, 1);
      newGroups.splice(destination.index, 0, reorderedGroup);
      
      if (onReorderGroups) {
        onReorderGroups(newGroups);
      }
      toast.success('Порядок групп изменен');
      return;
    }
    
    // Handle step reordering within same droppable
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
      // Handle moving between different droppables
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
        const newUngroupedSteps = Array.from(ungroupedSteps.filter(s => s.id !== sourceStep.id));
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

  const handleDeleteStep = (stepId: string) => {
    // Remove from all groups first
    groups.forEach(group => {
      if (group.steps.some(step => step.id === stepId)) {
        const newSteps = group.steps.filter(step => step.id !== stepId);
        onUpdateGroup(group.id, { steps: newSteps });
      }
    });
    
    // Remove from ungrouped steps
    const newUngroupedSteps = ungroupedSteps.filter(step => step.id !== stepId);
    const allGroupedSteps = groups.flatMap(g => g.steps.filter(step => step.id !== stepId));
    onStepsChange([...allGroupedSteps, ...newUngroupedSteps]);
    
    // Call the parent delete handler
    onDeleteStep(stepId);
  };

  const handleCopyStep = (step: Step) => {
    // Create a copy of the step
    const newStep: Step = {
      ...step,
      id: Date.now().toString(),
      title: step.title ? `${step.title} (копия)` : undefined
    };

    // Add to the same location as the original step
    if (step.groupId) {
      // Find the group and add the copy there
      const group = groups.find(g => g.id === step.groupId);
      if (group) {
        const stepIndex = group.steps.findIndex(s => s.id === step.id);
        const newSteps = [...group.steps];
        newSteps.splice(stepIndex + 1, 0, newStep);
        onUpdateGroup(step.groupId, { steps: newSteps });
        onStepsChange([...steps, newStep]);
      }
    } else {
      // Add to ungrouped steps
      const stepIndex = ungroupedSteps.findIndex(s => s.id === step.id);
      const newUngroupedSteps = [...ungroupedSteps];
      newUngroupedSteps.splice(stepIndex + 1, 0, newStep);
      const allGroupedSteps = groups.flatMap(g => g.steps);
      onStepsChange([...allGroupedSteps, ...newUngroupedSteps]);
    }
    
    onCopyStep(newStep);
  };

  const totalSteps = groups.reduce((sum, group) => sum + group.steps.length, 0) + ungroupedSteps.length;

  return (
    <div className="flex-1 overflow-auto px-4 pt-16 md:pt-0 md:px-0" style={{ background: 'var(--bg-primary)' }}>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <InstructionHeader
          title={instructionTitle}
          description={instructionDescription}
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
          onPreview={onPreview}
        />

        <GroupCreator onCreateGroup={onCreateGroup} />

        {totalSteps === 0 ? (
          <EmptyState />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="space-y-6">
              <Droppable droppableId="groups" type="group">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                    {groups.map((group, index) => (
                      <Draggable key={group.id} draggableId={`group-${group.id}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <StepGroupComponent
                              group={group}
                              onUpdateGroup={onUpdateGroup}
                              onDeleteGroup={onDeleteGroup}
                              onUpdateStep={onUpdateStep}
                              onDeleteStep={handleDeleteStep}
                              onCopyStep={handleCopyStep}
                              onEditImage={onEditImage}
                              onAddStepToGroup={onAddStepToGroup}
                              onAddHtmlWithTemplate={onAddHtmlWithTemplate}
                              onLoadImageToGroup={onLoadImage}
                              onAddFileToGroup={onAddFileToGroup}
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

              {ungroupedSteps.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                    <span>📋</span>
                    Шаги без группы
                  </h3>
                  <Droppable droppableId="ungrouped" type="step">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`space-y-4 transition-colors rounded-lg p-4 min-h-[100px] ${
                          snapshot.isDraggingOver ? 'bg-slate-800/50 border-2 border-dashed border-slate-600' : 'border-2 border-dashed border-slate-700/50'
                        }`}
                      >
                        {ungroupedSteps.map((step, index) => (
                          <Draggable key={step.id} draggableId={step.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`transition-transform w-full ${
                                  snapshot.isDragging ? 'rotate-2 scale-105 z-50' : ''
                                }`}
                              >
                                <StepEditor
                                  step={step}
                                  onUpdate={onUpdateStep}
                                  onDelete={handleDeleteStep}
                                  onCopy={handleCopyStep}
                                  onEditImage={onEditImage}
                                  dragHandleProps={provided.dragHandleProps}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {ungroupedSteps.length === 0 && (
                          <div className="text-center py-8 text-slate-400">
                            <div className="text-2xl mb-2">📋</div>
                            <p>Перетащите шаги сюда</p>
                          </div>
                        )}
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
