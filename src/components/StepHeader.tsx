
import React from 'react';
import { Step } from '../types/Step';
import StepActions from './StepActions';

interface StepHeaderProps {
  step: Step;
  isEditing: boolean;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
  dragHandleProps?: any;
}

const StepHeader: React.FC<StepHeaderProps> = ({
  step,
  isEditing,
  onEdit,
  onCopy,
  onDelete,
  dragHandleProps
}) => {
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

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">{getStepIcon()}</span>
        <span className="text-xs sm:text-sm text-slate-400 capitalize">{step.type}</span>
      </div>
      
      <StepActions
        isEditing={isEditing}
        onEdit={onEdit}
        onCopy={onCopy}
        onDelete={onDelete}
        dragHandleProps={dragHandleProps}
      />
    </div>
  );
};

export default StepHeader;
