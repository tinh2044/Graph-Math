import React from 'react';
import { Row, Col, Typography, Divider } from 'antd';
import EquationInput from '../../components/EquationInput/EquationInput';
import Graph from '../../components/Graph/Graph';
import History from '../../components/History/History';


const Home: React.FC = () => {
  return (
    <div>
      {/* <Title level={2} style={{ margin: 0, marginBottom: 16 }}>Trực quan hóa đồ thị toán học</Title> */}

      <Row gutter={[16, 16]} >
        <Col xs={24} md={24} lg={8} xl={8} xxl={8}>
          <EquationInput />
          <Divider orientation="left">Lịch sử</Divider>
          <div className="history-container">
            <History />
          </div>
        </Col>
        
        <Col xs={24} md={24} lg={16} xl={16} xxl={16}>
          <Graph />
        </Col>
      </Row>
    </div>
  );
};

export default Home; 