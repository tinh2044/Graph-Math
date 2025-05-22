import * as math from 'mathjs';

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
    const cleanExpr = expression.trim().replace(/^y\s*=\s*/, '');
    math.parse(cleanExpr);
    math.evaluate(cleanExpr, { x: 1 });
    return true;
  } catch (_) {
    return false;
  }
};


export const getLatexFromExpression = (expression: string): string => {
  try {
    const cleanExpr = expression.trim().replace(/^y\s*=\s*/, '');
    const node = math.parse(cleanExpr);
    return node.toTex({ parenthesis: 'keep', implicit: 'hide' });
  } catch (_) {
    return expression;
  }
};


export const calculatePoints = (
  expression: string, 
  xValues: number[]
): PlotData | CalculationError => {
  try {
    const cleanExpr = expression.trim().replace(/^y\s*=\s*/, '');
    const compiled = math.compile(cleanExpr);
    
    const yValues: number[] = xValues.map(x => {
      try {
        const result = compiled.evaluate({ x });
        return Number.isFinite(result) ? result : NaN;
      } catch {
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
      node: math.parse(cleanExpr),
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