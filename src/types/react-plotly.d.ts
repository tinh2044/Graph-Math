declare module 'react-plotly.js' {
  import * as Plotly from 'plotly.js';
  import * as React from 'react';

  interface PlotParams {
    data: Array<Plotly.Data>;
    layout?: Partial<Plotly.Layout>;
    config?: Partial<Plotly.Config>;
    frames?: Plotly.Frame[];
    style?: React.CSSProperties;
    className?: string;
    useResizeHandler?: boolean;
    debug?: boolean;
    onInitialized?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onUpdate?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onPurge?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void;
    onError?: (err: Error) => void;
    divId?: string;
  }

  export interface PlotlyProps extends PlotParams {}
  
  export default class Plot extends React.Component<PlotlyProps> {}
}

declare module 'plotly.js' {
  export interface Data {
    type?: string;
    mode?: string;
    name?: string;
    x?: Array<number | string | Date>;
    y?: Array<number | string | Date>;
    line?: Partial<{
      color: string;
      width: number;
    }>;
    [key: string]: any;
  }

  export interface Layout {
    title?: string | Partial<{
      text: string;
    }>;
    xaxis?: Partial<{
      title: string;
      range: [number, number];
      showgrid: boolean;
      zeroline: boolean;
      zerolinecolor: string;
      gridcolor: string;
    }>;
    yaxis?: Partial<{
      title: string;
      range: [number, number];
      showgrid: boolean;
      zeroline: boolean;
      zerolinecolor: string;
      gridcolor: string;
    }>;
    showlegend?: boolean;
    legend?: Partial<{
      x: number;
      y: number;
      bgcolor: string;
      bordercolor: string;
    }>;
    paper_bgcolor?: string;
    plot_bgcolor?: string;
    font?: Partial<{
      color: string;
    }>;
    margin?: Partial<{
      l: number;
      r: number;
      t: number;
      b: number;
    }>;
    autosize?: boolean;
    [key: string]: any;
  }

  export interface Config {
    responsive?: boolean;
    displayModeBar?: boolean;
    displaylogo?: boolean;
    modeBarButtonsToRemove?: string[];
    [key: string]: any;
  }

  export type Frame = any;
  export type Figure = any;
} 