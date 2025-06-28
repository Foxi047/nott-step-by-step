
import React from 'react';
import { Button } from '@/components/ui/button';
import { StepStyle } from '../types/Step';

interface StepStyleSelectorProps {
  currentStyle?: StepStyle;
  onStyleChange: (style: StepStyle) => void;
}

const stepStyles: Array<{ type: StepStyle['type'], label: string, icon: string, classes: string }> = [
  { type: 'default', label: 'Обычный', icon: '📝', classes: 'bg-slate-800 border-slate-700' },
  { type: 'info', label: 'Информация', icon: 'ℹ️', classes: 'bg-blue-900 border-blue-700' },
  { type: 'warning', label: 'Предупреждение', icon: '🛑', classes: 'bg-yellow-900 border-yellow-700' },
  { type: 'success', label: 'Успех', icon: '✅', classes: 'bg-green-900 border-green-700' },
  { type: 'error', label: 'Ошибка', icon: '❌', classes: 'bg-red-900 border-red-700' }
];

const StepStyleSelector: React.FC<StepStyleSelectorProps> = ({
  currentStyle,
  onStyleChange
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300">Стиль шага</label>
      <div className="flex flex-wrap gap-2">
        {stepStyles.map((style) => (
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

export default StepStyleSelector;
