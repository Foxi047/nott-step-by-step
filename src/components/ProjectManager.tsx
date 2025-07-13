
import React from 'react';
import { Step } from '../types/Step';
import { Theme } from '../hooks/useTheme';

interface ProjectManagerProps {
  onSave: () => void;
  onExport: (format: 'html' | 'markdown' | 'json') => void;
  onImportJSON: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenSettings: () => void;
  onOpenSavedProjects: () => void;
  onSaveWithTheme: (theme: Theme) => void;
  onNewProject: () => void;
  hasUnsavedChanges: boolean;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({
  onSave,
  onExport,
  onImportJSON,
  onOpenSettings,
  onOpenSavedProjects,
  onSaveWithTheme,
  onNewProject,
  hasUnsavedChanges
}) => {
  // This component would handle project management operations
  // For now, it's just a placeholder that passes through the props
  return null;
};

export default ProjectManager;
