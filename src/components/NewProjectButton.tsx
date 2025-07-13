
import React from 'react';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import { toast } from 'sonner';

interface NewProjectButtonProps {
  onNewProject: () => void;
  hasUnsavedChanges: boolean;
}

const NewProjectButton: React.FC<NewProjectButtonProps> = ({ 
  onNewProject, 
  hasUnsavedChanges 
}) => {
  const handleNewProject = () => {
    if (hasUnsavedChanges) {
      const shouldContinue = window.confirm(
        'У вас есть несохранённые изменения. Создать новый проект? Текущий проект будет автоматически сохранён.'
      );
      if (shouldContinue) {
        onNewProject();
      }
    } else {
      onNewProject();
    }
  };

  return (
    <Button
      onClick={handleNewProject}
      className="bg-green-600 hover:bg-green-700 text-white w-full mb-2"
    >
      <FilePlus className="w-4 h-4 mr-2" />
      Новый проект
    </Button>
  );
};

export default NewProjectButton;
