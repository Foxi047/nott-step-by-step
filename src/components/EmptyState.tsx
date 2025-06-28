
import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="text-4xl sm:text-6xl mb-4">📝</div>
      <h3 className="text-lg sm:text-xl font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
        Начните создание инструкции
      </h3>
      <p className="mb-4 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
        Добавьте первый шаг, используя панель слева или кнопку меню
      </p>
    </div>
  );
};

export default EmptyState;
