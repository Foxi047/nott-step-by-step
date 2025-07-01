
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';

interface TextFormattingToolbarProps {
  onInsertFormat: (format: string) => void;
}

const TextFormattingToolbar: React.FC<TextFormattingToolbarProps> = ({ onInsertFormat }) => {
  const handleFormatClick = (format: string) => {
    onInsertFormat(format);
  };

  return (
    <div className="flex gap-1 mb-2 p-2 bg-slate-600 rounded-md">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleFormatClick('**текст**')}
        className="text-white hover:bg-slate-500 px-2"
        title="Жирный текст"
      >
        <Bold className="w-4 h-4" />
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleFormatClick('*текст*')}
        className="text-white hover:bg-slate-500 px-2"
        title="Курсив"
      >
        <Italic className="w-4 h-4" />
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleFormatClick('_текст_')}
        className="text-white hover:bg-slate-500 px-2"
        title="Подчеркнутый текст"
      >
        <Underline className="w-4 h-4" />
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleFormatClick('• Элемент списка\n• Элемент списка\n• Элемент списка')}
        className="text-white hover:bg-slate-500 px-2"
        title="Маркированный список"
      >
        <List className="w-4 h-4" />
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleFormatClick('1. Элемент списка\n2. Элемент списка\n3. Элемент списка')}
        className="text-white hover:bg-slate-500 px-2"
        title="Нумерованный список"
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default TextFormattingToolbar;
