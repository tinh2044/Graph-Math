import React from 'react';
import { useDispatch } from 'react-redux';
import { InlineMath } from 'react-katex';
import type { Expression } from '@/redux/slices/graphDataSlice';
import { toggleVisibility } from '@/redux/slices/graphDataSlice';
import type { AppDispatch } from '@/redux/store';
import type { ThemeMode } from '@/redux/slices/themeSlice'; // Use ThemeMode directly

interface CustomGraphLegendProps {
  expressions: Expression[];
  theme: ThemeMode; // Corrected type for theme prop
}

const CustomGraphLegend: React.FC<CustomGraphLegendProps> = ({ expressions, theme }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleToggleVisibility = (expressionId: string) => {
    dispatch(toggleVisibility(expressionId));
  };

  const visibleExpressions = expressions.filter(exp => exp.isVisible);

  if (visibleExpressions.length === 0) {
    return null; // Don't render legend if no expressions are visible
  }

  // Base classes for color swatch, border color will be conditional or dynamic if needed
  const colorSwatchBaseClasses = "w-[40px] h-[2px] mr-2";

  return (
    <div 
      className={`
        absolute top-[40px] left-[60px] z-10
        p-2 bg-transparent
        max-h-[200px] overflow-y-auto text-[13px]
      `}
    >
      {visibleExpressions.map((exp) => (
        <div 
          key={exp.id} 
          className="flex items-center mb-[5px]"
        //   onClick={() => handleToggleVisibility(exp.id)}
          title={`Click to ${exp.isVisible ? 'hide' : 'show'} ${exp.equation}`}
        >
          <span 
            className={`${colorSwatchBaseClasses} border-gray-600 dark:border-gray-300`}
            style={{ backgroundColor: exp.color }}
          ></span>
          <InlineMath math={exp.latex} />
        </div>
      ))}
    </div>
  );
};

export default CustomGraphLegend; 