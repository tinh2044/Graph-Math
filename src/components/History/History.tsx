import React from 'react';
import { List, Button, Empty, Typography, Space, Tag, Tooltip } from 'antd';
import { useHistory } from '../../context/HistoryContext';
import { useExpressions } from '../../context/ExpressionContext';
import { PlusOutlined, EyeOutlined, DeleteOutlined, ClearOutlined } from '@ant-design/icons';
import { InlineMath } from 'react-katex';
import type { HistoryItem } from '../../context/HistoryContext';

const { Text } = Typography;

const History: React.FC = () => {
  const { history, clearHistory, removeFromHistory } = useHistory();
  const { addExpression, expressions } = useExpressions();

  const isExpressionAdded = (equation: string) => {
    return expressions.some(expr => expr.equation === equation);
  };

  const handleAddExpression = (item: HistoryItem) => {
    if (!isExpressionAdded(item.expression.equation)) {
      addExpression({
        equation: item.expression.equation,
        latex: item.expression.latex,
        color: item.expression.color,
        isVisible: true,
      });
    }
  };

  const handleClearHistory = () => {
    clearHistory();
  };

  return (
    <div className="history-component">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 8 
      }}>
        <Text strong style={{ fontSize: '13px' }}>
          {history.length > 0 ? `${history.length} biểu thức` : 'Chưa có lịch sử'}
        </Text>
        {history.length > 0 && (
          <Tooltip title="Xóa tất cả">
            <Button 
              type="text" 
              size="small" 
              danger 
              icon={<ClearOutlined />} 
              onClick={handleClearHistory}
            />
          </Tooltip>
        )}
      </div>
      
      {history.length === 0 ? (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description="Chưa có biểu thức nào"
          style={{ margin: '16px 0', padding: '8px' }}
        />
      ) : (
        <List
          size="small"
          dataSource={history}
          className="history-list"
          renderItem={(item) => {
            const isAdded = isExpressionAdded(item.expression.equation);
            
            return (
              <List.Item
                key={item.id}
                style={{ 
                  padding: '4px 0',
                  borderBottom: '1px solid var(--border-color)'
                }}
                actions={[
                  <Space size={4} key="actions">
                    <Tooltip title={isAdded ? "Đã thêm vào đồ thị" : "Thêm vào đồ thị"}>
                      <Button
                        type="text"
                        size="small"
                        icon={isAdded ? <EyeOutlined /> : <PlusOutlined />}
                        disabled={isAdded}
                        onClick={() => handleAddExpression(item)}
                      />
                    </Tooltip>
                    <Tooltip title="Xóa khỏi lịch sử">
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeFromHistory(item.id)}
                      />
                    </Tooltip>
                  </Space>
                ]}
              >
                <Tooltip title={item.expression.equation}>
                  <Tag 
                    color={item.expression.color} 
                    style={{ 
                      maxWidth: '100%', 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      margin: 0
                    }}
                  >
                    <InlineMath math={item.expression.latex} />
                  </Tag>
                </Tooltip>
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );
};

export default History; 