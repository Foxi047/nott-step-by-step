
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Eye } from 'lucide-react';

interface InstructionHeaderProps {
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onPreview: () => void;
}

const InstructionHeader: React.FC<InstructionHeaderProps> = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onPreview
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <Input
          placeholder="Название инструкции"
          value={title}
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
        value={description}
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
  );
};

export default InstructionHeader;
