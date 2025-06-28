
import { useState, useCallback } from 'react';
import { Step, StepGroup } from '../types/Step';

export const useStepGroups = () => {
  const [groups, setGroups] = useState<StepGroup[]>([]);
  const [ungroupedSteps, setUngroupedSteps] = useState<Step[]>([]);

  const createGroup = useCallback((title: string) => {
    const newGroup: StepGroup = {
      id: Date.now().toString(),
      title,
      isCollapsed: false,
      steps: []
    };
    setGroups(prev => [...prev, newGroup]);
    return newGroup;
  }, []);

  const updateGroup = useCallback((groupId: string, updates: Partial<StepGroup>) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, ...updates } : group
    ));
  }, []);

  const deleteGroup = useCallback((groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setUngroupedSteps(prev => [...prev, ...group.steps]);
      setGroups(prev => prev.filter(g => g.id !== groupId));
    }
  }, [groups]);

  const addStepToGroup = useCallback((step: Step, groupId?: string) => {
    if (groupId) {
      setGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, steps: [...group.steps, { ...step, groupId }] }
          : group
      ));
    } else {
      setUngroupedSteps(prev => [...prev, step]);
    }
  }, []);

  const moveStepBetweenGroups = useCallback((stepId: string, fromGroupId: string | null, toGroupId: string | null) => {
    // Remove from source
    if (fromGroupId) {
      setGroups(prev => prev.map(group => 
        group.id === fromGroupId 
          ? { ...group, steps: group.steps.filter(s => s.id !== stepId) }
          : group
      ));
    } else {
      setUngroupedSteps(prev => prev.filter(s => s.id !== stepId));
    }

    // Add to destination
    const step = fromGroupId 
      ? groups.find(g => g.id === fromGroupId)?.steps.find(s => s.id === stepId)
      : ungroupedSteps.find(s => s.id === stepId);

    if (step) {
      if (toGroupId) {
        setGroups(prev => prev.map(group => 
          group.id === toGroupId 
            ? { ...group, steps: [...group.steps, { ...step, groupId: toGroupId }] }
            : group
        ));
      } else {
        setUngroupedSteps(prev => [...prev, { ...step, groupId: undefined }]);
      }
    }
  }, [groups, ungroupedSteps]);

  const getAllSteps = useCallback(() => {
    const groupedSteps = groups.flatMap(group => group.steps);
    return [...ungroupedSteps, ...groupedSteps];
  }, [groups, ungroupedSteps]);

  return {
    groups,
    ungroupedSteps,
    setGroups,
    setUngroupedSteps,
    createGroup,
    updateGroup,
    deleteGroup,
    addStepToGroup,
    moveStepBetweenGroups,
    getAllSteps
  };
};
