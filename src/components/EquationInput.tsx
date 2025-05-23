/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Button, Alert, Typography, ColorPicker } from 'antd';
import type { Color } from 'antd/es/color-picker';
import { SendOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import 'mathlive';
import type { MathfieldElement } from 'mathlive';
import { isValidExpression } from '../utils/math/mathHelpers';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addExpression, 
  updateExpression, 
  setActiveExpression,
  setPreviewExpression
} from '@/redux/slices/graphDataSlice';
import type { RootState, AppDispatch } from '@/redux/store';
import { InlineMath } from 'react-katex';
import debounce from 'lodash/debounce';

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
const EquationInput = forwardRef<EquationInputHandle, React.ComponentPropsWithoutRef<'div'>>(() => {
  const [latexValue, setLatexValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(generateRandomHexColor());
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const mathFieldRef = useRef<MathfieldElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { activeExpression } = useSelector((state: RootState) => state.graphData);

  // Debounced function to update preview
  const debouncedPreviewUpdate = debounce((value: string, color: string) => {
    if (value && isValidExpression(value)) {
      dispatch(setPreviewExpression({
        equation: value,
        latex: value,
        color: color,
        isVisible: true,
        id: 'preview'
      }));
    } else {
      dispatch(setPreviewExpression(null));
    }
  }, 300);

  // Effect to handle input changes for preview
  useEffect(() => {
    if (latexValue) {
      debouncedPreviewUpdate(latexValue, selectedColor);
    } else {
      dispatch(setPreviewExpression(null));
    }
    return () => {
      debouncedPreviewUpdate.cancel();
    };
  }, [latexValue, selectedColor]);

  // Clear preview when component unmounts
  useEffect(() => {
    return () => {
      dispatch(setPreviewExpression(null));
    };
  }, []);

  // Effect to handle active expression changes
  useEffect(() => {
    if (activeExpression) {
      setLatexValue(activeExpression.latex);
      setSelectedColor(activeExpression.color);
      setIsEditMode(true);
      if (mathFieldRef.current) {
        mathFieldRef.current.value = activeExpression.latex;
      }
    } else {
      resetForm();
    }
  }, [activeExpression]);

  const resetForm = () => {
    setLatexValue('');
    setIsEditMode(false);
    setError(null);
    setSelectedColor(generateRandomHexColor());
    if (mathFieldRef.current) {
      mathFieldRef.current.value = '';
    }
    dispatch(setPreviewExpression(null));
  };

  useEffect(() => {
    const mathField = mathFieldRef.current;
    if (mathField) {
      const handleInput = (evt: Event) => {
        const target = evt.target as MathfieldElement;
        const currentLatex = target.value;
        setLatexValue(currentLatex);

        if (!currentLatex.trim()) {
          setError(null);
          dispatch(setPreviewExpression(null));
          return;
        }
        if (isValidExpression(currentLatex)) {
          setError(null);
        } else {
          setError('Biểu thức không hợp lệ');
          dispatch(setPreviewExpression(null));
        }
      };

      mathField.addEventListener('input', handleInput);
      return () => {
        mathField.removeEventListener('input', handleInput);
      };
    }
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = () => {
    if (!latexValue.trim() || error) return;

    try {
      if (isValidExpression(latexValue)) {
        if (isEditMode && activeExpression) {
          // Update existing expression
          dispatch(updateExpression({
            id: activeExpression.id,
            updates: {
              equation: latexValue,
              latex: latexValue,
              color: selectedColor,
            }
          }));
          setSuccess(`Đã cập nhật "${latexValue}"`);
          dispatch(setActiveExpression(null)); // Clear active expression
        } else {
          // Add new expression
          const newExpressionData = {
            equation: latexValue,
            latex: latexValue,
            color: selectedColor,
            isVisible: true,
          };
          dispatch(addExpression(newExpressionData));
          setSuccess(`Đã thêm "${latexValue}"`);
        }
        
        resetForm();
      } else {
        setError('Biểu thức không hợp lệ');
      }
    } catch (_) {
      setError('Lỗi khi thêm biểu thức');
    }
  };

  const handleCancel = () => {
    dispatch(setActiveExpression(null));
    resetForm();
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-1 text-xs">
          <span className='text-lg'>{isEditMode ? 'Chỉnh sửa biểu thức' : 'Nhập biểu thức'}</span>
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
          </div>
        </div>

        <div className="flex items-center gap-2">
          {React.createElement(
            "math-field",
            {
              ref: mathFieldRef,
              menu: false,
              "virtual-keyboard-mode": "manual",
              "virtual-keyboard-toggle": "true",
              style: {
                flexGrow: 1,
                border: error ? "1px solid red" : "1px solid #d9d9d9",
                borderRadius: "6px",
                padding: "4px 8px",
                fontSize: "14px",
              },
            },
            latexValue
          )}
          {latexValue && (
            <Button
              type="text"
              size="middle"
              color='red'
              icon={<DeleteOutlined className="!text-lg !text-red-500"  />}
              onClick={() => {
                setLatexValue("");
                if (mathFieldRef.current) mathFieldRef.current.value = "";
                setError(null);
                mathFieldRef.current?.focus();
              }}
              className="!p-0"
              title="Xóa"
            />
          )}
          <Button
            type="primary"
            size="small"
            icon={isEditMode ? <EditOutlined /> : <SendOutlined />}
            onClick={handleSubmit}
            disabled={!latexValue.trim() || !!error}
            className="!px-2 !py-0"
            title={isEditMode ? "Cập nhật" : "Thêm"}
          />
          {isEditMode && (
            <Button
              type="default"
              size="small"
              onClick={handleCancel}
              className="!px-2 !py-0"
            >
              Hủy
            </Button>
          )}
        </div>

        {error && (
          <Alert
            message={<div>
              <span>{error} : </span>
              <InlineMath>{latexValue}</InlineMath>
            </div>}
            type="error"
            className="!text-xs sm:!text-md !py-1 !px-2 !rounded-md"
          />
        )}

        {!latexValue && !activeExpression && (
          <Text type="secondary" className="text-xs">
            Nhập biểu thức toán học (ví dụ: <InlineMath>x^2 + 1</InlineMath>)
          </Text>
        )}
      </div>
    </>
  );
});

export default EquationInput; 