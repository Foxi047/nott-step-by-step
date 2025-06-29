
import React from 'react';
import { Button } from '@/components/ui/button';
import { StepStyle } from '../types/Step';

interface StepGroupStyleSelectorProps {
  currentStyle?: StepStyle;
  onStyleChange: (style: StepStyle) => void;
}

const groupStyles: Array<{ type: StepStyle['type'], label: string, icon: string, classes: string }> = [
  { type: 'default', label: 'Обычная', icon: '📁', classes: 'bg-slate-700 border-purple-600' },
  { type: 'info', label: 'Информация', icon: 'ℹ️', classes: 'bg-blue-900 border-blue-700' },
  { type: 'warning', label: 'Предупреждение', icon: '⚠️', classes: 'bg-yellow-900 border-yellow-700' },
  { type: 'success', label: 'Успех', icon: '✅', classes: 'bg-green-900 border-green-700' },
  { type: 'error', label: 'Ошибка', icon: '❌', classes: 'bg-red-900 border-red-700' }
];

const StepGroupStyleSelector: React.FC<StepGroupStyleSelectorProps> = ({
  currentStyle,
  onStyleChange
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">Стиль группы</label>
      <div className="flex flex-wrap gap-2">
        {groupStyles.map((style) => (
          <Button
            key={style.type}
            size="sm"
            variant={currentStyle?.type === style.type ? 'default' : 'outline'}
            onClick={() => onStyleChange({ type: style.type, icon: style.icon })}
            className={`text-xs ${style.classes}`}
          >
            <span className="mr-1">{style.icon}</span>
            {style.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default StepGroupStyleSelector;
