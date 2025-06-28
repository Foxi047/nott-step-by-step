
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { StepGroup as StepGroupType, Step } from '../types/Step';
import StepEditor from './StepEditor';
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface StepGroupProps {
  group: StepGroupType;
  onUpdateGroup: (groupId: string, updates: Partial<StepGroupType>) => void;
  onDeleteGroup: (groupId: string) => void;
  onUpdateStep: (step: Step) => void;
  onDeleteStep: (stepId: string) => void;
  onCopyStep: (step: Step) => void;
  onEditImage?: (stepId: string) => void;
}

const StepGroupComponent: React.FC<StepGroupProps> = ({
  group,
  onUpdateGroup,
  onDeleteGroup,
  onUpdateStep,
  onDeleteStep,
  onCopyStep,
  onEditImage
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(group.title);

  const handleSaveTitle = () => {
    onUpdateGroup(group.id, { title: editTitle });
    setIsEditing(false);
  };

  const handleToggleCollapse = () => {
    onUpdateGroup(group.id, { isCollapsed: !group.isCollapsed });
  };

  return (
    <div className="bg-slate-700/50 rounded-lg p-4 mb-4 border-2 border-purple-600/30 shadow-lg">
      <Collapsible open={!group.isCollapsed}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CollapsibleTrigger onClick={handleToggleCollapse}>
              {group.isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-purple-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-purple-400" />
              )}
            </CollapsibleTrigger>
            
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-slate-600 border-slate-500 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveTitle()}
                />
                <Button size="sm" onClick={handleSaveTitle} className="bg-green-600 hover:bg-green-700">
                  Сохранить
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg">📁</span>
                <h3 className="text-lg font-semibold text-purple-200">{group.title}</h3>
                <span className="text-xs text-purple-300 bg-purple-800/30 px-2 py-1 rounded">
                  {group.steps.length} шагов
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-400 hover:text-blue-300"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDeleteGroup(group.id)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CollapsibleContent>
          <Droppable droppableId={`group-${group.id}`} type="step">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-4 transition-colors rounded-lg p-2 ${
                  snapshot.isDraggingOver ? 'bg-purple-900/20 border-2 border-dashed border-purple-500' : ''
                }`}
              >
                {group.steps.map((step, index) => (
                  <Draggable key={step.id} draggableId={step.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`transition-transform ${
                          snapshot.isDragging ? 'rotate-2 scale-105 z-50' : ''
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
                
                {group.steps.length === 0 && (
                  <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-600 rounded-lg">
                    <div className="text-2xl mb-2">📋</div>
                    <p>Перетащите шаги сюда</p>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default StepGroupComponent;
