
import React from 'react';
import { EditIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Step } from '../types/Step';

interface ImageStepEditorProps {
  step: Step;
  onEditImage?: (stepId: string) => void;
}

const ImageStepEditor: React.FC<ImageStepEditorProps> = ({ step, onEditImage }) => {
  return (
    <div className="relative">
      <div className="inline-block max-w-full relative group">
        <img 
          src={step.imageUrl} 
          alt={step.title || 'Изображение'} 
          className="max-w-full h-auto object-contain rounded border border-slate-600 block"
          style={{ 
            objectFit: 'contain',
            maxHeight: '500px',
            width: 'auto'
          }}
        />
        {onEditImage && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              onClick={() => onEditImage(step.id)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <EditIcon className="w-4 h-4 mr-1" />
              Редактировать
            </Button>
          </div>
        )}
      </div>
      {step.content && (
        <p className="text-xs sm:text-sm text-slate-300 mt-2 break-words">{step.content}</p>
      )}
    </div>
  );
};

export default ImageStepEditor;
