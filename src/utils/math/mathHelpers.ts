import { ComputeEngine } from '@cortex-js/compute-engine';
const ce = new ComputeEngine();
interface PlotData {
  x: number[];
  y: number[];
}

interface CalculationError {
  error: string;
}


export const generateXValues = (start: number, end: number, steps: number): number[] => {
  const step = (end - start) / steps;
  const values: number[] = [];
  
  for (let i = 0; i <= steps; i++) {
    values.push(start + step * i);
  }
  
  return values;
};


export const isValidExpression = (expression: string): boolean => {
  try {
    const expr = ce.parse(expression);
    return expr.isValid
  } catch (_) {
    return false;
  }
};


export const getLatexFromExpression = (expression: string): string => {
  try {
    const cleanExpr = expression.trim().replace(/^y\s*=\s*/, '');
    const node = ce.parse(cleanExpr);
    return node.toLatex();
  } catch (_) {
    return expression;
  }
};


export const calculatePoints = (
  expression: string, 
  xValues: number[]
): PlotData | CalculationError => {
  try {
    const expr = ce.parse(expression);
    const yValues: number[] = xValues.map(x => {
      try {
        ce.pushScope();
        ce.assign('x', ce.number(x));
        const result = Number(expr.evaluate().value);
        ce.popScope();
        return Number.isFinite(result) ? result : NaN;
      } catch {
        ce.popScope();
        return NaN;
      }
    });
    
    const validPoints = xValues.reduce<PlotData>(
      (acc, x, index) => {
        if (!Number.isNaN(yValues[index])) {
          acc.x.push(x);
          acc.y.push(yValues[index]);
        }
        return acc;
      }, 
      { x: [], y: [] }
    );
    
    return validPoints;
  } catch (error) {
    return { error: (error as Error).message };
  }
};


export const parseExpression = (expression: string) => {
  try {
    const cleanExpr = expression.trim().replace(/^y\s*=\s*/, '');
    return {
      valid: true,
      node: ce.parse(cleanExpr),
      latex: getLatexFromExpression(expression),
      expression: cleanExpr
    };
  } catch (error) {
    return {
      valid: false,
      error: (error as Error).message
    };
  }
};