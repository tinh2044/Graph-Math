import React from 'react';
import { Form, InputNumber, Slider, Switch, Button, Row, Col, Space } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

export interface GraphOptionsProps {
  xRange: [number, number];
  yRange: [number, number];
  resolution: number;
  showGrid: boolean;
  onXRangeChange: (range: [number, number]) => void;
  onYRangeChange: (range: [number, number]) => void;
  onResolutionChange: (resolution: number) => void;
  onShowGridChange: (show: boolean) => void;
  onClose: () => void;
}

const GraphOptions: React.FC<GraphOptionsProps> = ({
  xRange,
  yRange,
  resolution,
  showGrid,
  onXRangeChange,
  onYRangeChange,
  onResolutionChange,
  onShowGridChange,
  onClose,
}) => {
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then(values => {
      onXRangeChange([values.xMin, values.xMax]);
      onYRangeChange([values.yMin, values.yMax]);
      onResolutionChange(values.resolution);
      onShowGridChange(values.showGrid);
      onClose();
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      style={{ width: 'auto', minWidth: 280, maxWidth: '90vw' }}
      initialValues={{
        xMin: xRange[0],
        xMax: xRange[1],
        yMin: yRange[0],
        yMax: yRange[1],
        resolution,
        showGrid,
      }}
    >
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Giá trị X nhỏ nhất"
            name="xMin"
            rules={[
              { required: true, message: 'Vui lòng nhập giá trị' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value >= getFieldValue('xMax')) {
                    return Promise.reject(new Error('Phải nhỏ hơn giá trị lớn nhất'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Giá trị X lớn nhất"
            name="xMax"
            rules={[
              { required: true, message: 'Vui lòng nhập giá trị' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value <= getFieldValue('xMin')) {
                    return Promise.reject(new Error('Phải lớn hơn giá trị nhỏ nhất'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Giá trị Y nhỏ nhất"
            name="yMin"
            rules={[
              { required: true, message: 'Vui lòng nhập giá trị' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value >= getFieldValue('yMax')) {
                    return Promise.reject(new Error('Phải nhỏ hơn giá trị lớn nhất'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Giá trị Y lớn nhất"
            name="yMax"
            rules={[
              { required: true, message: 'Vui lòng nhập giá trị' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value <= getFieldValue('yMin')) {
                    return Promise.reject(new Error('Phải lớn hơn giá trị nhỏ nhất'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Độ phân giải (số điểm)"
        name="resolution"
        rules={[{ required: true, message: 'Vui lòng nhập độ phân giải' }]}
      >
        <Slider
          min={100}
          max={10000}
          step={100}
          marks={{
            100: '100',
            1000: '1000',
            5000: '5000',
            10000: '10000',
            20000: '20000',
            50000: '50000',
            100000: '100000',
          }}
        />
      </Form.Item>

      <Form.Item
        label="Hiển thị lưới"
        name="showGrid"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSave}
          >
            Áp dụng
          </Button>
          <Button onClick={onClose}>Hủy</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default GraphOptions; 