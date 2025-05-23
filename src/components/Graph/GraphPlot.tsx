import React from 'react';
import { Spin, Empty, Button, Alert, Typography, Space } from 'antd';
import { EyeInvisibleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Plot from 'react-plotly.js';
import { type Data, type Layout } from 'plotly.js';
import type { Expression } from '@/redux/slices/graphDataSlice';

const { Text } = Typography;

interface GraphPlotProps {
  plotData: Partial<Data>[];
  layout: Partial<Layout>;
  config: object; // Plotly config can be complex, using object for now
  loading: boolean;
  expressions: Expression[];
  graphRef: React.Ref<HTMLDivElement>;
  fullScreen: boolean;
  onShowAll: () => void;
}

const GraphPlot: React.FC<GraphPlotProps> = ({
  plotData,
  layout,
  config,
  loading,
  expressions,
  graphRef,
  fullScreen,
  onShowAll,
}) => {
  const totalExpressions = expressions.length;

  return (
    <div
      ref={graphRef}
      style={{
        width: "100%",
        height: fullScreen ? "100vh" : "100%",
        transition: "height 0.3s ease",
      }}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <Spin size="large" />
          <Text>Đang tính toán đồ thị...</Text>
        </div>
      ) : plotData.length > 0 ? (
        <Plot
          data={plotData}
          layout={layout}
          config={config}
          style={{ width: "100%", height: "100%" }}
        />
      ) : totalExpressions > 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
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
                onClick={onShowAll}
              >
                Hiển thị tất cả
              </Button>
            }
          />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            padding: "0 16px",
            textAlign: "center",
          }}
        >
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
            <Text type="secondary">
              Gợi ý: Thử nhập <Text code>sin(x)</Text> hoặc{" "}
              <Text code>x^2 - 4</Text>
            </Text>
          </Space>
        </div>
      )}
    </div>
  );
};

export default GraphPlot; 