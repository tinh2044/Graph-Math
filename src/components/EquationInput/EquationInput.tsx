import React, { useState, useEffect } from 'react';
import { Input, Button, Card, Alert, Typography, Space, Popover, Tooltip } from 'antd';
import { SendOutlined, DeleteOutlined, QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { isValidExpression, getLatexFromExpression } from '../../utils/math/mathHelpers';
import { useExpressions } from '../../context/ExpressionContext';
import { useHistory } from '../../context/HistoryContext';

const { Text, Title, Paragraph } = Typography;

const HelpContent = () => (
  <div style={{ maxWidth: 300 }}>
    <Title level={5}>Cách nhập biểu thức</Title>
    <Paragraph>
      <ul style={{ paddingLeft: 16 }}>
        <li>Sử dụng <Text code>x</Text> làm biến độc lập</li>
        <li>Phép cộng: <Text code>x + 1</Text></li>
        <li>Phép trừ: <Text code>x - 1</Text></li>
        <li>Phép nhân: <Text code>x * 2</Text> hoặc <Text code>2x</Text></li>
        <li>Phép chia: <Text code>x / 2</Text></li>
        <li>Lũy thừa: <Text code>x^2</Text> hoặc <Text code>x**2</Text></li>
        <li>Căn bậc 2: <Text code>sqrt(x)</Text></li>
        <li>Hàm mũ: <Text code>exp(x)</Text></li>
        <li>Logarit: <Text code>log(x)</Text> (cơ số e) hoặc <Text code>log10(x)</Text></li>
        <li>Sin/Cos: <Text code>sin(x)</Text>, <Text code>cos(x)</Text></li>
      </ul>
    </Paragraph>
    <Paragraph>
      <Text strong>Ví dụ:</Text> <Text code>y = 2*x^2 + 3*x - 4</Text>
    </Paragraph>
  </div>
);

const EquationInput: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [latex, setLatex] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { addExpression, activeExpression } = useExpressions();
  const { addToHistory } = useHistory();
  
  const getRandomColor = () => {
    const colors = [
      '#1677ff', 
      '#52c41a', 
      '#faad14', 
      '#f5222d', 
      '#722ed1', 
      '#eb2f96', 
      '#fa8c16', 
      '#13c2c2', 
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  useEffect(() => {
    if (!inputValue.trim()) {
      setLatex('');
      setError(null);
      return;
    }

    try {
      
      if (isValidExpression(inputValue)) {
        setLatex(getLatexFromExpression(inputValue));
        setError(null);
      } else {
        setError('Biểu thức không hợp lệ');
      }
    } catch (_) {
      setError('Lỗi phân tích biểu thức');
    }
  }, [inputValue]);

  
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  
  const handleSubmit = () => {
    if (!inputValue.trim() || error) return;

    try {
      
      if (isValidExpression(inputValue)) {
        
        const newExpression = {
          equation: inputValue,
          latex: getLatexFromExpression(inputValue),
          color: getRandomColor(),
          isVisible: true,
        };

        
        addExpression(newExpression);
        
        
        addToHistory({
          id: Date.now().toString(),
          equation: inputValue,
          latex: getLatexFromExpression(inputValue),
          color: newExpression.color,
          isVisible: true,
        });

        
        setSuccess(`Đã thêm "${inputValue}"`);

        
        setInputValue('');
        setLatex('');
        setError(null);
      } else {
        setError('Biểu thức không hợp lệ');
      }
    } catch (_) {
      setError('Lỗi khi thêm biểu thức');
    }
  };

  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Nhập biểu thức</span>
          <Popover 
            content={<HelpContent />} 
            title="Hướng dẫn nhập biểu thức" 
            trigger="click"
            placement="right"
          >
            <Button type="text" size="small" icon={<QuestionCircleOutlined />} />
          </Popover>
        </div>
      } 
      className="mb-3"
      size="small"
      bodyStyle={{ padding: '12px 8px' }}
    >
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Input
          placeholder="y = f(x)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          prefix={
            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
          }
          suffix={
            <>
              {inputValue && (
                <Button 
                  type="text" 
                  size="small"
                  icon={<DeleteOutlined />} 
                  onClick={() => setInputValue('')}
                />
              )}
              <Button 
                type="primary" 
                size="small"
                icon={<SendOutlined />} 
                onClick={handleSubmit}
                disabled={!inputValue.trim() || !!error}
              />
            </>
          }
          status={error ? "error" : ""}
          size="small"
        />
        
        {error && (
          <Alert 
            message={error} 
            type="error" 
            showIcon 
            closable 
            style={{ padding: '2px 8px', fontSize: '12px' }}
          />
        )}
        
        {success && (
          <Alert 
            message={success} 
            type="success" 
            showIcon 
            closable 
            style={{ padding: '2px 8px', fontSize: '12px' }}
          />
        )}
        
        {latex && !error && (
          <Tooltip title={inputValue}>
            <div className="equation-display text-center" style={{ padding: '8px 4px' }}>
              <InlineMath math={latex} />
            </div>
          </Tooltip>
        )}
        
        {activeExpression && (
          <Tooltip title="Biểu thức đang chọn">
            <div 
              className="equation-display text-center" 
              style={{ 
                padding: '8px 4px', 
                borderLeft: `4px solid ${activeExpression.color}` 
              }}
            >
              <InlineMath math={activeExpression.latex} />
            </div>
          </Tooltip>
        )}
        
        {!inputValue && !activeExpression && !latex && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Nhập biểu thức toán học (ví dụ: x^2 + 1)
          </Text>
        )}
      </Space>
    </Card>
  );
};

export default EquationInput; 