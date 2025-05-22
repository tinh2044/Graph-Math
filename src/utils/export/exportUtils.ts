export const exportToPNG = (
  graphElement: HTMLElement,
  fileName: string = 'graph',
  format: 'png' | 'svg' = 'png'
): Promise<void> => {
  if (!window.Plotly) {
    return Promise.reject(new Error('Plotly không được tìm thấy'));
  }

  return new Promise((resolve, reject) => {
    try {
      const plotly = window.Plotly;
      if (!plotly) {
        reject(new Error('Plotly không được tìm thấy'));
        return;
      }

      if (format === 'png') {
        plotly.toImage(graphElement, { format: 'png', width: 800, height: 600 })
          .then((dataUrl: string) => {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${fileName}.png`;
            link.click();
            resolve();
          })
          .catch((error: Error) => {
            reject(error);
          });
      } else if (format === 'svg') {
        plotly.toImage(graphElement, { format: 'svg', width: 800, height: 600 })
          .then((dataUrl: string) => {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${fileName}.svg`;
            link.click();
            resolve();
          })
          .catch((error: Error) => {
            reject(error);
          });
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const shareGraph = (expressionString: string): string => {
  try {
    const encodedExpression = encodeURIComponent(expressionString);
    const shareURL = `${window.location.origin}${window.location.pathname}?expr=${encodedExpression}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareURL)
        .catch(error => console.error('Không thể copy URL:', error));
    }
    
    return shareURL;
  } catch (error) {
    console.error('Error creating share URL:', error);
    return '';
  }
};

declare global {
  interface Window {
    Plotly?: {
      toImage: (
        graphElement: HTMLElement,
        options: { format: string; width: number; height: number }
      ) => Promise<string>;
    };
  }
} 