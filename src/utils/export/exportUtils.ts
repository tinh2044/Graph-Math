export const exportToPNG = (
  graphDataForExport: HTMLElement | { data: unknown[]; layout: unknown; },
  fileName: string = 'graph',
  format: 'png' | 'svg' = 'png'
): Promise<void> => {
  if (!window.Plotly || !window.Plotly.downloadImage) {
    return Promise.reject(new Error('Plotly or Plotly.downloadImage không được tìm thấy'));
  }

  return new Promise((resolve, reject) => {
    try {
      const plotly = window.Plotly;
      const options = {
        format: format,
        width: 800,
        height: 600,
        filename: fileName
      };

      plotly.downloadImage(graphDataForExport, options)
        .then(() => {
          resolve();
        })
        .catch((error: Error) => {
          console.error('Plotly.downloadImage error:', error);
          reject(error);
        });
    } catch (error) {
      console.error('Error in exportToPNG wrapper:', error);
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
      downloadImage: (
        graphElement: HTMLElement | { data: unknown[]; layout: unknown; },
        options: { 
          format: string; 
          width: number; 
          height: number; 
          filename: string 
        }
      ) => Promise<string>;
    };
  }
} 