import React from 'react';
import { Button, Tooltip, Space, Popover } from 'antd';
import { 
  DownloadOutlined, 
  SettingOutlined,
  HomeOutlined
} from '@ant-design/icons';
import GraphOptions, { type GraphOptionsProps as GraphOptionsPropsType } from './GraphOptions';

interface GraphToolbarProps extends Omit<GraphOptionsPropsType, 'onClose'> {
  isOptionsShown: boolean;
  canExport: boolean;
  onToggleOptions: (visible?: boolean) => void;
  onExport: () => void;
  onResetView: () => void;
  isMobile: boolean;
}

const GraphToolbar: React.FC<GraphToolbarProps> = ({
  isOptionsShown,
  canExport,
  onToggleOptions,
  onExport,
  onResetView,
  isMobile,
  xRange,
  yRange,
  resolution,
  showGrid,
  onXRangeChange,
  onYRangeChange,
  onResolutionChange,
  onShowGridChange,
}) => {
  
  const graphOptionsContent = (
    <GraphOptions
      xRange={xRange}
      yRange={yRange}
      resolution={resolution}
      showGrid={showGrid}
      onXRangeChange={onXRangeChange}
      onYRangeChange={onYRangeChange}
      onResolutionChange={onResolutionChange}
      onShowGridChange={onShowGridChange}
      onClose={() => onToggleOptions(false)}
    />
  );

  return (
    <Space direction="vertical" className='absolute top-0 z-10 right-6'>
      <Popover
        content={graphOptionsContent}
        title="Tùy chọn đồ thị"
        trigger="click"
        open={isOptionsShown && !isMobile}
        onOpenChange={onToggleOptions}
        placement="leftTop"
      >
        <Tooltip title="Tùy chọn đồ thị">
          <Button
            icon={<SettingOutlined />}
            onClick={() => onToggleOptions()}
          />
        </Tooltip>
      </Popover>
      <Tooltip title="Xuất đồ thị">
        <Button
          icon={<DownloadOutlined />}
          onClick={onExport}
          disabled={!canExport}
        />
      </Tooltip>
      <Tooltip title="Reset về (0,0)">
        <Button icon={<HomeOutlined />} onClick={onResetView} />
      </Tooltip>
    </Space>
  );
};

export default GraphToolbar; 