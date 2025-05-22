import React, { useState, useRef } from 'react';
import { Card, Spin, Empty, Button, Tooltip, Space, Alert, Typography, Tag, Badge } from 'antd';
import { 
  DownloadOutlined, 
  FullscreenOutlined, 
  SettingOutlined, 
  QuestionCircleOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
import Plot from 'react-plotly.js';
import { useExpressions } from '../../context/ExpressionContext';
import { useTheme } from '../../context/ThemeContext';
import { calculatePoints, generateXValues } from '../../utils/math/mathHelpers';
import { exportToPNG } from '../../utils/export/exportUtils';
import GraphOptions from '../GraphOptions/GraphOptions';

const { Text } = Typography;

const Graph: React.FC = () => {
  const { expressions, toggleVisibility } = useExpressions();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [xRange, setXRange] = useState<[number, number]>([-10, 10]);
  const [yRange, setYRange] = useState<[number, number]>([-10, 10]);
  const [resolution, setResolution] = useState(500);
  const [showGrid, setShowGrid] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const graphRef = useRef<HTMLDivElement>(null);

  
  const calculateGraphData = () => {
    setLoading(true);

    try {
      const xValues = generateXValues(xRange[0], xRange[1], resolution);
      const visibleExpressions = expressions.filter(exp => exp.isVisible);

      if (visibleExpressions.length === 0) {
        setLoading(false);
        return [];
      }

      const traces = visibleExpressions.map(expression => {
        const result = calculatePoints(expression.equation, xValues);
        
        if ('error' in result) {
          return {
            x: [],
            y: [],
            type: 'scatter',
            mode: 'lines',
            name: `${expression.equation} (Error)`,
            line: { color: expression.color, width: 2 },
          };
        }
        
        return {
          x: result.x,
          y: result.y,
          type: 'scatter',
          mode: 'lines',
          name: expression.equation,
          line: { color: expression.color, width: 2 },
        };
      });

      setLoading(false);
      return traces;
    } catch (_) {
      setLoading(false);
      return [];
    }
  };

  
  const plotData = React.useMemo(() => {
    return calculateGraphData();
  }, [expressions, xRange, yRange, resolution]);

  
  const handleExport = async () => {
    if (graphRef.current) {
      try {
        await exportToPNG(graphRef.current, 'graph-math-export');
      } catch (error) {
        console.error('Error exporting graph:', error);
      }
    }
  };

  
  const handleFullScreen = () => {
    if (graphRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setFullScreen(false);
      } else {
        graphRef.current.requestFullscreen();
        setFullScreen(true);
      }
    }
  };

  
  const layout = {
    autosize: true,
    title: '',
    xaxis: {
      title: 'x',
      range: xRange,
      showgrid: showGrid,
      zeroline: true,
      zerolinecolor: theme === 'dark' ? '#555' : '#ddd',
      gridcolor: theme === 'dark' ? '#333' : '#eee',
    },
    yaxis: {
      title: 'y',
      range: yRange,
      showgrid: showGrid,
      zeroline: true,
      zerolinecolor: theme === 'dark' ? '#555' : '#ddd',
      gridcolor: theme === 'dark' ? '#333' : '#eee',
    },
    showlegend: true,
    legend: {
      x: 0,
      y: 1,
      bgcolor: theme === 'dark' ? 'rgba(50,50,50,0.7)' : 'rgba(255,255,255,0.7)',
      bordercolor: theme === 'dark' ? '#555' : '#ddd',
    },
    paper_bgcolor: theme === 'dark' ? '#1f1f1f' : '#fff',
    plot_bgcolor: theme === 'dark' ? '#141414' : '#fff',
    font: {
      color: theme === 'dark' ? '#fff' : '#333',
    },
    margin: { l: 50, r: 50, t: 30, b: 50 },
  };

  
  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: [
      'sendDataToCloud', 
      'autoScale2d', 
      'resetScale2d',
      'toggleSpikelines',
      'hoverClosestCartesian',
      'hoverCompareCartesian'
    ],
  };

  const activeExpressions = expressions.filter(e => e.isVisible).length;
  const totalExpressions = expressions.length;

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space>
            <span>Đồ thị hàm số</span>
            {totalExpressions > 0 && (
              <Badge count={`${activeExpressions}/${totalExpressions}`} color={activeExpressions > 0 ? "blue" : "gray"} />
            )}
          </Space>
          <Space>
            <Tooltip title="Tùy chọn đồ thị">
              <Button 
                icon={<SettingOutlined />} 
                onClick={() => setShowOptions(!showOptions)}
                type={showOptions ? "primary" : "default"}
              />
            </Tooltip>
            <Tooltip title="Xuất đồ thị">
              <Button 
                icon={<DownloadOutlined />} 
                onClick={handleExport}
                disabled={expressions.length === 0 || expressions.filter(e => e.isVisible).length === 0}
              />
            </Tooltip>
            <Tooltip title={fullScreen ? "Thoát toàn màn hình" : "Xem toàn màn hình"}>
              <Button 
                icon={<FullscreenOutlined />} 
                onClick={handleFullScreen}
              />
            </Tooltip>
          </Space>
        </div>
      } 
      className="graph-container mb-3"
    >
      {showOptions && (
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
      )}
      
      {totalExpressions > 0 && (
        <div className="mb-3">
          <Space wrap>
            {expressions.map(expr => (
              <Tag 
                key={expr.id} 
                color={expr.color}
                style={{ cursor: 'pointer' }}
                onClick={() => toggleVisibility(expr.id)}
                icon={expr.isVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              >
                {expr.equation}
              </Tag>
            ))}
          </Space>
        </div>
      )}
      
      <div 
        ref={graphRef} 
        style={{ 
          width: '100%', 
          height: fullScreen ? '100vh' : 400,
          transition: 'height 0.3s ease'
        }}
      >
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            flexDirection: 'column',
            gap: 16
          }}>
            <Spin size="large" />
            <Text>Đang tính toán đồ thị...</Text>
          </div>
        ) : plotData.length > 0 ? (
          <Plot
            data={plotData}
            layout={layout}
            config={config}
            style={{ width: '100%', height: '100%' }}
          />
        ) : expressions.length > 0 ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <Alert
              message="Không có biểu thức nào đang hiển thị"
              description="Hãy bật hiển thị ít nhất một biểu thức để xem đồ thị"
              type="warning"
              showIcon
              icon={<EyeInvisibleOutlined />}
              action={
                <Button 
                  type="primary" 
                  size="small" 
                  onClick={() => expressions.forEach(e => !e.isVisible && toggleVisibility(e.id))}
                >
                  Hiển thị tất cả
                </Button>
              }
            />
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            padding: '0 16px',
            textAlign: 'center'
          }}>
            <Empty 
              description={
                <Space direction="vertical">
                  <Text>Chưa có biểu thức nào để hiển thị</Text>
                  <Text type="secondary">
                    Nhập biểu thức toán học ở ô phía trên để bắt đầu vẽ đồ thị
                  </Text>
                </Space>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <Space style={{ marginTop: 16 }}>
              <QuestionCircleOutlined />
              <Text type="secondary">Gợi ý: Thử nhập <Text code>sin(x)</Text> hoặc <Text code>x^2 - 4</Text></Text>
            </Space>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Graph; 