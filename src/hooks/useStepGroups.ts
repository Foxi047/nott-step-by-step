
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
      // Перемещаем шаги из группы в неформированные
      setUngroupedSteps(prev => [...prev, ...group.steps.map(step => ({ ...step, groupId: undefined }))]);
      setGroups(prev => prev.filter(g => g.id !== groupId));
    }
  }, [groups]);

  const addStepToGroup = useCallback((step: Step, groupId?: string) => {
    const stepWithGroup = { ...step, groupId };
    
    if (groupId) {
      setGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, steps: [...group.steps, stepWithGroup] }
          : group
      ));
      // Remove from ungrouped steps if it was there
      setUngroupedSteps(prev => prev.filter(s => s.id !== step.id));
    } else {
      setUngroupedSteps(prev => [...prev.filter(s => s.id !== step.id), stepWithGroup]);
    }
  }, []);

  const moveStepBetweenGroups = useCallback((stepId: string, fromGroupId: string | null, toGroupId: string | null) => {
    let step: Step | undefined;
    
    // Найти и удалить шаг из исходного места
    if (fromGroupId) {
      setGroups(prev => prev.map(group => {
        if (group.id === fromGroupId) {
          const stepToMove = group.steps.find(s => s.id === stepId);
          if (stepToMove) step = stepToMove;
          return { ...group, steps: group.steps.filter(s => s.id !== stepId) };
        }
        return group;
      }));
    } else {
      setUngroupedSteps(prev => {
        const stepToMove = prev.find(s => s.id === stepId);
        if (stepToMove) step = stepToMove;
        return prev.filter(s => s.id !== stepId);
      });
    }

    // Добавить шаг в новое место
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
  }, []);

  const removeStepFromEverywhere = useCallback((stepId: string) => {
    // Удаляем из неформированных шагов
    setUngroupedSteps(prev => prev.filter(s => s.id !== stepId));
    
    // Удаляем из всех групп
    setGroups(prev => prev.map(group => ({
      ...group,
      steps: group.steps.filter(s => s.id !== stepId)
    })));
  }, []);

  const getAllSteps = useCallback(() => {
    const groupedSteps = groups.flatMap(group => group.steps);
    return [...groupedSteps, ...ungroupedSteps];
  }, [groups, ungroupedSteps]);

  const getStepById = useCallback((stepId: string) => {
    // Search in ungrouped steps first
    const ungroupedStep = ungroupedSteps.find(s => s.id === stepId);
    if (ungroupedStep) return ungroupedStep;
    
    // Search in groups
    for (const group of groups) {
      const step = group.steps.find(s => s.id === stepId);
      if (step) return step;
    }
    
    return null;
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
    removeStepFromEverywhere,
    getAllSteps,
    getStepById
  };
};
