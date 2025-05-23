import { type ReactNode, useEffect, useRef } from 'react';
import AppLayout from './Layout/AppLayout';
import { Row, Col, Divider } from "antd";
import EquationInput, { type EquationInputHandle } from "@/components/EquationInput";
import Graph from "@/components/Graph";
import ExpressionList from "@/components/ExpressionList";
import './index.css';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store';

function App(): ReactNode {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const equationInputRef = useRef<EquationInputHandle>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);


  return (
    <AppLayout>
      <Row gutter={[16, 16]} className="w-full min-h-full">
        <Col
          xs={{ span: 24, order: 2 }}
          md={24}
          lg={{ span: 8, order: 1 }}
          xl={6}
          xxl={6}
          className="!min-h-[50vh] p-1 sm:!min-h-full !flex flex-col border-none sm:border-r-[1px] border-black dark:border-white"
        >
          <div className="p-0 overflow-y-auto sm:p-2">
            <EquationInput ref={equationInputRef} />
            <Divider
              orientation="left"
              size="large"
              className="dark:border-white !my-2 sm:!my-4"
            ></Divider>
            <ExpressionList />
          </div>
        </Col>

        <Col
          xs={{ span: 24, order: 1 }}
          md={24}
          lg={{ span: 16, order: 2 }}
          xl={18}
          xxl={18}
          className="!min-h-[50vh] sm:!min-h-full !p-0"
        >
          <Graph />
        </Col>
      </Row>
    </AppLayout>
  );
}

export default App;
