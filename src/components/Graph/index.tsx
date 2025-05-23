import React, { useState, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "antd";
import {
  toggleVisibility as toggleExpressionVisibility,
  type Expression,
} from "@/redux/slices/graphDataSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import type { Data, Layout } from "plotly.js";
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { calculatePoints, generateXValues } from "@/utils/math/mathHelpers";
import { exportToPNG } from "@/utils/export/exportUtils";
import GraphPlot from "./GraphPlot";
import GraphToolbar from "./GraphToolbar";
import GraphOptions from "./GraphOptions";
import CustomGraphLegend from "./CustomGraphLegend";
import useResponsive from "@/hooks/useResponsive";

const Graph: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { expressions, previewExpression } = useSelector((state: RootState) => state.graphData);
  const { theme } = useSelector((state: RootState) => state.theme);
  const isMobile = useResponsive();

  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [xRange, setXRange] = useState<[number, number]>([-10, 10]);
  const [yRange, setYRange] = useState<[number, number]>([-10, 10]);
  const [resolution, setResolution] = useState(500);
  const [showGrid, setShowGrid] = useState(true);
  const graphRef = useRef<HTMLDivElement>(null);

  const handleResetView = () => {
    const currentXSpan = xRange[1] - xRange[0];
    const currentYSpan = yRange[1] - yRange[0];
    setXRange([-currentXSpan / 2, currentXSpan / 2]);
    setYRange([-currentYSpan / 2, currentYSpan / 2]);
  };

  const calculateGraphData = (): Partial<Data>[] => {
    setLoading(true);
    try {
      const xValues = generateXValues(xRange[0], xRange[1], resolution);
      const visibleExpressions = expressions.filter(
        (exp: Expression) => exp.isVisible
      );

      // Create traces array with visible expressions
      const traces: Partial<Data>[] = visibleExpressions.map(
        (expression: Expression) => {
          const result = calculatePoints(expression.equation, xValues);
          let traceName = expression.equation;
          try {
            traceName = katex.renderToString(expression.latex, {
              throwOnError: false,
              displayMode: false,
              output: 'html',
            });
          } catch (e) {
            console.error("Katex rendering error for legend:", e);
          }

          if ("error" in result) {
            return {
              x: [],
              y: [],
              type: "scatter",
              mode: "lines",
              name: `${traceName} (Error)`,
              line: { color: expression.color, width: 2 },
            };
          }
          return {
            x: result.x,
            y: result.y,
            type: "scatter",
            mode: "lines",
            name: traceName,
            line: { color: expression.color, width: 2 },
          };
        }
      );

      // Add preview expression if it exists
      if (previewExpression) {
        const previewResult = calculatePoints(previewExpression.equation, xValues);
        if (!("error" in previewResult)) {
          let previewTraceName = previewExpression.equation;
          try {
            previewTraceName = katex.renderToString(previewExpression.latex, {
              throwOnError: false,
              displayMode: false,
              output: 'html',
            });
          } catch (e) {
            console.error("Katex rendering error for preview legend:", e);
          }

          traces.push({
            x: previewResult.x,
            y: previewResult.y,
            type: "scatter",
            mode: "lines",
            name: `${previewTraceName} (Preview)`,
            line: { 
              color: previewExpression.color, 
              width: 2,
              dash: 'dot',
            } as { color: string; width: number; dash: string },
            opacity: 0.7,
          });
        }
      }

      setLoading(false);
      return traces;
    } catch (_) {
      setLoading(false);
      return [];
    }
  };

  const plotData = useMemo(
    () => calculateGraphData(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expressions, previewExpression, xRange, yRange, resolution]
  );

  const handleExport = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      await exportToPNG({ data: plotData, layout: layout }, "graph-math-export");

    } catch (error) {
      console.error("Error exporting graph:", error);
    }
  };

  const layout: Partial<Layout> = useMemo(
    () => ({
      autosize: true,
      title: "",
      dragmode: "pan",
      xaxis: {
        title: "x",
        range: xRange,
        showgrid: showGrid,
        zeroline: true,
        zerolinecolor: theme === "dark" ? "#888" : "#666",
        zerolinewidth: 1.5,
        gridcolor: theme === "dark" ? "#333" : "#eee",
        showspikes: false,
        spikethickness: 1,
        spikedash: "solid",
        spikecolor: theme === "dark" ? "#888" : "#aaa",
        spikemode: "across",
        spikesnap: "cursor",
        showline: false,
        mirror: false,
        position: 0,
        anchor: "free",
        
      },
      yaxis: {
        title: "y",
        range: yRange,
        showgrid: showGrid,
        zeroline: true,
        zerolinecolor: theme === "dark" ? "#888" : "#666",
        zerolinewidth: 1.5,
        gridcolor: theme === "dark" ? "#333" : "#eee",
        showspikes: false,
        spikethickness: 1,
        spikedash: "solid",
        spikecolor: theme === "dark" ? "#888" : "#aaa",
        spikemode: "across",
        spikesnap: "cursor",
        showline: false,
        mirror: false,
        position: 0,
        anchor: "free",
      },
      showlegend: false,
      legend: {
        x: 0,
        y: 1,
        bgcolor:
          theme === "dark" ? "rgba(50,50,50,0.7)" : "rgba(255,255,255,0.7)",
        bordercolor: theme === "dark" ? "#555" : "#ddd",
      },
      paper_bgcolor: theme === "dark" ? "#1f1f1f" : "#fff",
      plot_bgcolor: theme === "dark" ? "#141414" : "#fff",
      font: { color: theme === "dark" ? "#fff" : "#333" },
      margin: { l: 50, r: 50, t: 30, b: 50 },
       
    }),
    [xRange, yRange, showGrid, theme]
  );

  const config = {
    responsive: true,
    displayModeBar: false,
    displaylogo: false,
    scrollZoom: true,
    modeBarButtonsToRemove: [
      "sendDataToCloud",
      "autoScale2d",
      "resetScale2d",
      "toggleSpikelines",
      "hoverClosestCartesian",
      "hoverCompareCartesian",
    ],
  };

  const handleShowAllExpressions = () => {
    expressions.forEach(
      (e: Expression) =>
        !e.isVisible && dispatch(toggleExpressionVisibility(e.id))
    );
  };

  const activeExpressionsCount = expressions.filter(
    (e: Expression) => e.isVisible
  ).length;
  const canExportGraph = expressions.length > 0 && activeExpressionsCount > 0;

  return (
    <div className="relative h-full">
      <GraphToolbar
        isOptionsShown={showOptions}
        isMobile={isMobile}
        canExport={canExportGraph}
        onToggleOptions={(visible) => setShowOptions(visible === undefined ? !showOptions : visible)}
        onExport={handleExport}
        onResetView={handleResetView}
        xRange={xRange}
        yRange={yRange}
        resolution={resolution}
        showGrid={showGrid}
        onXRangeChange={setXRange}
        onYRangeChange={setYRange}
        onResolutionChange={setResolution}
        onShowGridChange={setShowGrid}
      />

      {isMobile && (
        <Modal
          title="Tùy chọn đồ thị"
          open={showOptions}
          footer={null}
          onCancel={() => setShowOptions(false)}
          destroyOnClose
        >
          <GraphOptions
            xRange={xRange}
            yRange={yRange}
            resolution={resolution}
            showGrid={showGrid}
            onXRangeChange={setXRange}
            onYRangeChange={setYRange}
            onResolutionChange={setResolution}
            onShowGridChange={setShowGrid}
            onClose={() => setShowOptions(false)}
          />
        </Modal>
      )}
      
      <CustomGraphLegend expressions={expressions} />
      <GraphPlot
        plotData={plotData}
        layout={layout}
        config={config}
        loading={loading}
        expressions={expressions}
        graphRef={graphRef}
        onShowAll={handleShowAllExpressions}
      />
    </div>
  );
};

export default Graph;
