import React from 'react';
import { List, Button, Space, Tag, Tooltip, ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { useDispatch } from 'react-redux';
import {
  updateExpression,
  removeExpression,
  toggleVisibility,
  type Expression
} from '@/redux/slices/graphDataSlice';
import { EyeOutlined, EyeInvisibleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { InlineMath } from 'react-katex';
import type { AppDispatch } from '@/redux/store';


const FUNCTION_COLORS = [
  '#1677ff', '#52c41a', '#faad14', '#f5222d', 
  '#722ed1', '#eb2f96', '#fa8c16', '#13c2c2',
];

interface ExpressionListItemProps {
  item: Expression;
  isActive: boolean;
  onSetActive: (id: string) => void;
}

const ExpressionListItem: React.FC<ExpressionListItemProps> = ({ item, isActive, onSetActive }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleColorChange = (expressionId: string, color: Color) => {
    const hexColor = color.toHexString();
    dispatch(updateExpression({ id: expressionId, updates: { color: hexColor } }));
  };

  const handleToggleVisibility = (expressionId: string) => {
    dispatch(toggleVisibility(expressionId));
  };

  const handleRemoveExpression = (expressionId: string) => {
    dispatch(removeExpression(expressionId));
  };

  return (
    <List.Item
      key={item.id}
      className={`expression-item ${isActive ? 'active-expression' : ''}`}
      style={{ 
        padding: '6px 2px',
        borderBottom: '1px solid var(--border-color)', 
        cursor: 'pointer' 
      }}
      onClick={() => onSetActive(item.id)}
      actions={[
        <Space size={0} key="actions" className="expression-actions">
          <Tooltip title={item.isVisible ? "Ẩn biểu thức" : "Hiện biểu thức"}>
            <Button
              type="text"
              size="small"
              icon={item.isVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              onClick={(e) => { e.stopPropagation(); handleToggleVisibility(item.id); }}
            />
          </Tooltip>
          <div onClick={(e) => { e.stopPropagation(); }} style={{display: 'flex', alignItems: 'center'}}>
            <Tooltip title="Chọn màu">
              <ColorPicker
                value={item.color}
                onChange={(color) => handleColorChange(item.id, color)}
                size="small"
                trigger="click"
                presets={[{
                  label: 'Màu đồ thị',
                  colors: FUNCTION_COLORS,
                }]}
                destroyTooltipOnHide
              />
            </Tooltip>
          </div>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => { 
                e.stopPropagation(); 
                onSetActive(item.id);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa biểu thức">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => { e.stopPropagation(); handleRemoveExpression(item.id); }}
            />
          </Tooltip>
        </Space>
      ]}
    >
      <List.Item.Meta
        avatar={null}
        title={
          <Tooltip title={<InlineMath>{item.equation}</InlineMath>}>
              <Tag 
                  color={item.isVisible ? item.color : 'default'} 
                 
              className={`!m-0 overflow-hidden border-none 
                ${item.isVisible ? 'no-underline' : '!line-through !text-gray-300 dark:!text-gray-500'}
                expression-tag max-w-[200px] text-ellipsis whitespace-nowrap`}
              >
                  <InlineMath math={item.latex}  />
              </Tag>
          </Tooltip>
        }
      />
    </List.Item>
  );
};

export default ExpressionListItem; 