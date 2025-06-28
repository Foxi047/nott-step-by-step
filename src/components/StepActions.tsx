
import React from 'react';
import { Copy, Trash2, Edit, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface StepActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
  dragHandleProps?: any;
}

const StepActions: React.FC<StepActionsProps> = ({
  isEditing,
  onEdit,
  onCopy,
  onDelete,
  dragHandleProps
}) => {
  const handleDelete = () => {
    onDelete();
    toast.success('Шаг удален');
  };

  return (
    <div className="flex items-center gap-2">
      <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing touch-manipulation">
        <GripVertical className="w-4 h-4 text-slate-400" />
      </div>
      
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="ghost"
          onClick={onEdit}
          className="text-blue-400 hover:text-blue-300 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onCopy}
          className="text-green-400 hover:text-green-300 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default StepActions;
