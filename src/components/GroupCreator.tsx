
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface GroupCreatorProps {
  onCreateGroup: (title: string) => void;
}

const GroupCreator: React.FC<GroupCreatorProps> = ({ onCreateGroup }) => {
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [showNewGroupInput, setShowNewGroupInput] = useState(false);

  const handleCreateGroup = () => {
    if (newGroupTitle.trim()) {
      onCreateGroup(newGroupTitle.trim());
      setNewGroupTitle('');
      setShowNewGroupInput(false);
      toast.success('Группа создана');
    }
  };

  return (
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
  );
};

export default GroupCreator;
