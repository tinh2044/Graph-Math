import React from 'react';
import { Button, Space } from 'antd';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

// Define style types
const KEY_STYLE_CHAR = 'char';
const KEY_STYLE_ACTION = 'action';
const KEY_STYLE_NUMERIC = 'numeric';
const KEY_STYLE_OPERATOR = 'operator';
const KEY_STYLE_PRIMARY = 'primary';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  isMobile?: boolean;
}

const KEY_GROUPS: Array<Array<{ display: React.ReactNode; value: string; styleType: string }>> = [
  [
    { display: <InlineMath math="x" />, value: 'x', styleType: KEY_STYLE_CHAR },
    { display: <InlineMath math="y" />, value: 'y', styleType: KEY_STYLE_CHAR },
    { display: <InlineMath math="a^2" />, value: 'a^2', styleType: KEY_STYLE_CHAR },
    { display: <InlineMath math="a^b" />, value: 'a^b', styleType: KEY_STYLE_CHAR },
  ],
  [
    { display: '(', value: '(', styleType: KEY_STYLE_CHAR },
    { display: ')', value: ')', styleType: KEY_STYLE_CHAR },
    { display: '<', value: '<', styleType: KEY_STYLE_CHAR },
    { display: '>', value: '>', styleType: KEY_STYLE_CHAR },
  ],
  [
    { display: <InlineMath math="|a|" />, value: 'abs()', styleType: KEY_STYLE_CHAR },
    { display: ',', value: ',', styleType: KEY_STYLE_CHAR },
    { display: <InlineMath math="\le" />, value: '<=', styleType: KEY_STYLE_CHAR },
    { display: <InlineMath math="\ge" />, value: '>=' , styleType: KEY_STYLE_CHAR },
  ],
  [
    { display: 'ABC', value: 'TOGGLE_ALPHA', styleType: KEY_STYLE_ACTION },
    { display: '🔊', value: 'SPEECH_INPUT', styleType: KEY_STYLE_ACTION },
    { display: <InlineMath math="\sqrt{}" />, value: 'sqrt()', styleType: KEY_STYLE_ACTION },
    { display: <InlineMath math="\pi" />, value: 'pi', styleType: KEY_STYLE_ACTION },
  ],
];

const NUMPAD_KEYS_CONFIG: Array<Array<{ display: string | React.ReactNode; value: string; styleType: string }>> = [
  [
    { display: '7', value: '7', styleType: KEY_STYLE_NUMERIC }, { display: '8', value: '8', styleType: KEY_STYLE_NUMERIC }, { display: '9', value: '9', styleType: KEY_STYLE_NUMERIC }, { display: <InlineMath math="\div" />, value: '/', styleType: KEY_STYLE_OPERATOR },
  ],
  [
    { display: '4', value: '4', styleType: KEY_STYLE_NUMERIC }, { display: '5', value: '5', styleType: KEY_STYLE_NUMERIC }, { display: '6', value: '6', styleType: KEY_STYLE_NUMERIC }, { display: <InlineMath math="\times" />, value: '*', styleType: KEY_STYLE_OPERATOR },
  ],
  [
    { display: '1', value: '1', styleType: KEY_STYLE_NUMERIC }, { display: '2', value: '2', styleType: KEY_STYLE_NUMERIC }, { display: '3', value: '3', styleType: KEY_STYLE_NUMERIC }, { display: '-', value: '-', styleType: KEY_STYLE_OPERATOR },
  ],
  [
    { display: '0', value: '0', styleType: KEY_STYLE_NUMERIC }, { display: '.', value: '.', styleType: KEY_STYLE_NUMERIC }, { display: '=', value: '=', styleType: KEY_STYLE_OPERATOR }, { display: '+', value: '+', styleType: KEY_STYLE_OPERATOR },
  ],
];


const FUNCTION_KEYS: Array<{ display: React.ReactNode; value: string; styleType: string; isWide?: boolean }> = [
  { display: 'functions', value: 'FUNCTIONS_PANEL', styleType: KEY_STYLE_ACTION, isWide: true },
  { display: <InlineMath math="\leftarrow" />, value: 'CURSOR_LEFT', styleType: KEY_STYLE_ACTION },
  { display: <InlineMath math="\rightarrow" />, value: 'CURSOR_RIGHT', styleType: KEY_STYLE_ACTION },
  { display: <InlineMath math="\unicode{x232B}" />, value: 'BACKSPACE', styleType: KEY_STYLE_ACTION, isWide: true },
  { display: <InlineMath math="\unicode{x23CE}" />, value: 'ENTER', styleType: KEY_STYLE_PRIMARY, isWide: true },
];

const getButtonClassName = (styleType: string | undefined, isMobile?: boolean, isWideButton?: boolean) => {
  let classNames = 'h-10 text-sm flex items-center justify-center rounded shadow-sm hover:shadow transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:ring-blue-400 dark:focus:ring-blue-500';

  switch (styleType) {
    case KEY_STYLE_CHAR:
      classNames += ' bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-650 border border-gray-300 dark:border-gray-600';
      break;
    case KEY_STYLE_ACTION:
      classNames += ' bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-50 hover:bg-gray-300 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500';
      break;
    case KEY_STYLE_NUMERIC:
      classNames += ' bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-50 hover:bg-gray-300 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500';
      break;
    case KEY_STYLE_OPERATOR:
      classNames += ' bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-650 border border-gray-300 dark:border-gray-600';
      break;
    case KEY_STYLE_PRIMARY:
      classNames += ' bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700 border border-blue-500 dark:border-blue-600';
      break;
    default:
      classNames += ' bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-50 hover:bg-gray-300 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500';
  }

  if (isMobile) {
    classNames += ' flex-1 min-w-[40px]';
  } else {
    // For desktop, isWideButton applies mainly to function keys. Other keys get w-12.
    // If isWideButton is true, it means it should span the full width of its column in the right panel.
    classNames += isWideButton ? ' w-full' : ' w-12'; 
  }
  return classNames;
};


const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onKeyPress, isMobile }) => {
  const handleButtonClick = (value: string) => {
    onKeyPress(value);
  };

  return (
    <div className={`p-2 bg-gray-100 dark:bg-gray-800 rounded-t-lg shadow-xl ${isMobile ? 'w-full' : 'w-auto'}`}>
      <Space direction="horizontal" align="start" wrap={isMobile} className={isMobile ? "gap-2" : "gap-3"}>
        {/* Left side: x, y, a^2, etc. */}
        <Space direction="vertical" className={isMobile ? 'w-full' : ''} size={isMobile ? 'small' : 'middle'}>
          {KEY_GROUPS.map((group, groupIndex) => (
            <Space key={groupIndex} className={isMobile ? 'w-full' : ''} size={isMobile ? 4 : 8}>
              {group.map((key) => (
                <Button
                  key={key.value}
                  onClick={() => handleButtonClick(key.value)}
                  className={getButtonClassName(key.styleType, isMobile)}
                >
                  {key.display}
                </Button>
              ))}
            </Space>
          ))}
        </Space>

        {/* Middle: Numpad */}
        <Space direction="vertical" className={isMobile ? 'w-full' : ''} size={isMobile ? 'small' : 'middle'}>
          {NUMPAD_KEYS_CONFIG.map((row, rowIndex) => (
            <Space key={rowIndex} className={isMobile ? 'w-full' : ''} size={isMobile ? 4 : 8}>
              {row.map((key) => (
                <Button
                  key={key.value}
                  onClick={() => handleButtonClick(key.value)}
                  className={getButtonClassName(key.styleType, isMobile)}
                >
                  {key.display}
                </Button>
              ))}
            </Space>
          ))}
        </Space>

        {/* Right side: functions, backspace, enter */}
        <div className={`flex flex-col ${isMobile ? 'w-full gap-1' : 'w-[calc(2*3rem+0.5rem)] gap-2'}`}>
          <Button
            key={FUNCTION_KEYS[0].value}
            onClick={() => handleButtonClick(FUNCTION_KEYS[0].value)}
            className={getButtonClassName(FUNCTION_KEYS[0].styleType, isMobile, !isMobile && FUNCTION_KEYS[0].isWide)}
          >
            {FUNCTION_KEYS[0].display}
          </Button>
          
          <Space className={`w-full ${isMobile ? 'gap-1' : 'gap-2'}`}>
            <Button
              key={FUNCTION_KEYS[1].value}
              onClick={() => handleButtonClick(FUNCTION_KEYS[1].value)}
              className={getButtonClassName(FUNCTION_KEYS[1].styleType, isMobile, false)} // Arrow keys are not "isWide" but flex within this Space
            >
              {FUNCTION_KEYS[1].display}
            </Button>
            <Button
              key={FUNCTION_KEYS[2].value}
              onClick={() => handleButtonClick(FUNCTION_KEYS[2].value)}
              className={getButtonClassName(FUNCTION_KEYS[2].styleType, isMobile, false)}
            >
              {FUNCTION_KEYS[2].display}
            </Button>
          </Space>

          <Button
            key={FUNCTION_KEYS[3].value}
            onClick={() => handleButtonClick(FUNCTION_KEYS[3].value)}
            className={getButtonClassName(FUNCTION_KEYS[3].styleType, isMobile, !isMobile && FUNCTION_KEYS[3].isWide)}
          >
            {FUNCTION_KEYS[3].display}
          </Button>
          <Button
            key={FUNCTION_KEYS[4].value}
            onClick={() => handleButtonClick(FUNCTION_KEYS[4].value)}
            className={getButtonClassName(FUNCTION_KEYS[4].styleType, isMobile, !isMobile && FUNCTION_KEYS[4].isWide)}
          >
            {FUNCTION_KEYS[4].display}
          </Button>
        </div>
      </Space>
    </div>
  );
};

export default VirtualKeyboard; 