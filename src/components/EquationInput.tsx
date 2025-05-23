import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Input, Button, Alert, Typography, Popover, Tooltip, ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { InputRef } from 'antd';
import { SendOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { isValidExpression, getLatexFromExpression } from '../utils/math/mathHelpers';
import { useDispatch, useSelector } from 'react-redux';
import { addExpression, type Expression } from '@/redux/slices/graphDataSlice';
import type { RootState, AppDispatch } from '@/redux/store';
import HelpContent from './MathHelp';
import VirtualKeyboard from './VirtualKeyboard';
import { FaKeyboard } from 'react-icons/fa';
import useResponsive from '../hooks/useResponsive';

const { Text } = Typography;

const FUNCTION_COLORS_PRESETS = [
  '#1677ff', '#52c41a', '#faad14', '#f5222d', 
  '#722ed1', '#eb2f96', '#fa8c16', '#13c2c2',
];

// Helper function to generate a random hex color
const generateRandomHexColor = (): string => {
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += Math.floor(Math.random() * 16).toString(16);
  }
  return color;
};

// Define the handle type that will be exposed via ref
export interface EquationInputHandle {
  handleKeyPress: (key: string) => void;
}

// Using a more concrete, albeit general, props type to satisfy linter with forwardRef
const EquationInput = forwardRef<EquationInputHandle, React.ComponentPropsWithoutRef<'div'>>((props, ref) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [latex, setLatex] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(generateRandomHexColor());
  
  const { isMobile } = useResponsive();
  const [showKeyboardDesktop, setShowKeyboardDesktop] = useState<boolean>(false);
  
  const inputRef = useRef<InputRef>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const { activeExpression, expressions } = useSelector((state: RootState) => state.graphData);

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
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);
  
  const handleSubmit = () => {
    if (!inputValue.trim() || error) return;

    try {
      if (isValidExpression(inputValue)) {
        const newExpressionData = {
          equation: inputValue,
          latex: getLatexFromExpression(inputValue),
          color: selectedColor,
          isVisible: true,
        };

        dispatch(addExpression(newExpressionData));
        
        setSuccess(`Đã thêm "${inputValue}"`);
        setInputValue('');
        setLatex('');
        setError(null);

        // Select next random color, try to avoid immediate collision
        const usedColors = expressions.map((exp: Expression) => exp.color);
        let nextColor = generateRandomHexColor();
        let attempts = 0;
        while (usedColors.includes(nextColor) && attempts < 10) {
          nextColor = generateRandomHexColor();
          attempts++;
        }
        setSelectedColor(nextColor);

      } else {
        setError('Biểu thức không hợp lệ');
      }
    } catch (_) {
      setError('Lỗi khi thêm biểu thức');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  // This function will be exposed via ref
  const handleKeyPress = (key: string) => {
    if (key === 'BACKSPACE') {
      setInputValue((prev) => prev.slice(0, -1));
    } else if (key === 'DELETE') {
      setInputValue('');
    } else if (key === 'ENTER') {
      handleSubmit();
    } else if (key === 'FUNCTIONS_PANEL' || key === 'SPEECH_INPUT' || key === 'TOGGLE_ALPHA' || key === 'CURSOR_LEFT' || key === 'CURSOR_RIGHT') {
      // Placeholder for special function keys - can be implemented later
      console.log('Special key pressed:', key);
    } else {
      setInputValue((prev) => prev + key);
    }
    inputRef.current?.focus();
  };

  // Expose handleKeyPress via ref
  useImperativeHandle(ref, () => ({
    handleKeyPress,
  }));

  const handleToggleKeyboardDesktop = () => {
    setShowKeyboardDesktop(prev => !prev);
  };

  return (
    <>
      {/* Keyboard Toggle Button - DESKTOP ONLY */}
      {!isMobile && (
        <Button
          icon={<FaKeyboard size={24} />}
          onClick={handleToggleKeyboardDesktop}
          className="!fixed !bottom-4 !left-4 !z-30 !w-12 !h-12 !rounded-full !p-0 flex items-center justify-center shadow-lg"
          type={showKeyboardDesktop ? "primary" : "default"}
          title={showKeyboardDesktop ? "Ẩn bàn phím" : "Hiện bàn phím"}
        />
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1 text-xs">
          <span>Nhập biểu thức</span>
          <div className="flex items-center gap-1">
            <ColorPicker
              value={selectedColor}
              onChange={(color: Color) => setSelectedColor(color.toHexString())}
              presets={[
                { label: "Màu gợi ý", colors: FUNCTION_COLORS_PRESETS },
              ]}
              size="small"
              trigger="click"
            />
            <Popover
              content={<HelpContent />}
              trigger="click"
              placement="right"
            >
              <Button
                type="text"
                size="small"
                icon={<QuestionCircleOutlined />}
                className="!p-1"
              />
            </Popover>
          </div>
        </div>

        <Input
          ref={inputRef}
          placeholder="x^2 + 1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="!py-1 !text-xs"
          suffix={
            <>
              {inputValue && (
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => setInputValue("")}
                  className="!p-0"
                />
              )}
              <Button
                type="primary"
                size="small"
                icon={<SendOutlined />}
                onClick={handleSubmit}
                disabled={!inputValue.trim() || !!error}
                className="!px-2 !py-0 ml-1"
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
            className="!text-xs !py-0 !px-2"
          />
        )}

        {success && (
          <Alert
            message={success}
            type="success"
            showIcon
            closable
            className="!text-xs !py-0 !px-2"
          />
        )}

        {latex && !error && (
          <Tooltip title={inputValue}>
            <div
              className="text-xs text-center equation-display"
              style={{ color: selectedColor }}
            >
              <InlineMath math={latex} />
            </div>
          </Tooltip>
        )}

        {activeExpression && (
          <Tooltip title="Biểu thức đang chọn">
            <div className="text-xs text-center equation-display">
              <InlineMath math={activeExpression.latex} />
            </div>
          </Tooltip>
        )}

        {!inputValue && !activeExpression && !latex && (
          <Text type="secondary" className="text-xs">
            Nhập biểu thức toán học (ví dụ: x^2 + 1)
          </Text>
        )}
      </div>

      {/* VIRTUAL KEYBOARD FOR DESKTOP - Fixed, if toggled. isMobile is always false here */}
      {!isMobile && showKeyboardDesktop && (
        <div className="!fixed !bottom-0 !left-0 !right-0 !z-20 md:!bottom-4 md:!left-4 md:!right-auto md:max-w-md">
          <VirtualKeyboard onKeyPress={handleKeyPress} isMobile={false} />
        </div>
      )}
    </>
  );
});

export default EquationInput; 