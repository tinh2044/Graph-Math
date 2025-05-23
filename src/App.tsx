import { type ReactNode, useEffect, useRef } from 'react';
import AppLayout from './Layout/AppLayout';
import { Row, Col, Divider } from "antd";
import EquationInput, { type EquationInputHandle } from "@/components/EquationInput";
import Graph from "@/components/Graph";
import ExpressionList from "@/components/ExpressionList";
import VirtualKeyboard from "@/components/VirtualKeyboard";
import useResponsive from '@/hooks/useResponsive';
import './index.css';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';

function App(): ReactNode {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const { isMobile } = useResponsive();
  const equationInputRef = useRef<EquationInputHandle>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleVirtualKeyPress = (key: string) => {
    equationInputRef.current?.handleKeyPress(key);
  };

  return (
      <AppLayout>
        <Row gutter={[16, 16]} className="w-full min-h-screen">
          <Col
            xs={{ span: 24, order: 2 }}
            md={24}
            lg={{ span: 8, order: 1 }}
            xl={6}
            xxl={6}
            className="h-[40vh] lg:h-full flex flex-col border-none sm:border-r-[1px] border-black dark:border-white"
          >
            <div className="flex-grow p-2 overflow-y-auto">
              <EquationInput ref={equationInputRef} />
              <Divider orientation="left" size='large' className='dark:border-white'></Divider>
              <ExpressionList />
            </div>

            {isMobile && (
              <div className="pt-2">
                <VirtualKeyboard onKeyPress={handleVirtualKeyPress} isMobile={true} />
              </div>
            )}
          </Col>

          <Col 
            xs={{ span: 24, order: 1 }}
            md={24} 
            lg={{ span: 16, order: 2 }}
            xl={18} 
            xxl={18}
            className="h-[60vh] lg:h-full"
          >
            <Graph />
          </Col>
        </Row>
      </AppLayout>
  );
}

export default App;
