import React from 'react';
import { Typography } from 'antd';

const { Text, Title, Paragraph } = Typography;

const HelpContent: React.FC = () => (
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

export default HelpContent; 