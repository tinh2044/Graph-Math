import React, { useState } from 'react';
import { Typography, Card, List, Button, Modal, Form, Input, Empty, Tooltip, Row, Col } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useSavedGraphs } from '../../context/SavedGraphsContext';
import { useExpressions } from '../../context/ExpressionContext';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const { Title, Text } = Typography;
const { TextArea } = Input;

const SavedGraphs: React.FC = () => {
  const { savedGraphs, updateGraph, deleteGraph } = useSavedGraphs();
  const { addExpression } = useExpressions();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentGraph, setCurrentGraph] = useState<string | null>(null);
  const [form] = Form.useForm();

  const handleViewGraph = (graphId: string) => {
    const graph = savedGraphs.find(g => g.id === graphId);
    if (!graph) return;

    graph.expressions.forEach(expr => {
      addExpression({
        equation: expr.equation,
        latex: expr.latex,
        color: expr.color,
        isVisible: expr.isVisible,
      });
    });
  };

  const handleEditGraph = (graphId: string) => {
    const graph = savedGraphs.find(g => g.id === graphId);
    if (!graph) return;

    setCurrentGraph(graphId);
    form.setFieldsValue({
      name: graph.name,
      description: graph.description,
    });
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    form.validateFields().then(values => {
      if (currentGraph) {
        updateGraph(currentGraph, {
          name: values.name,
          description: values.description,
        });
      }
      setEditModalVisible(false);
      setCurrentGraph(null);
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div>
      <Title level={2}>Đồ thị đã lưu</Title>
      
      {savedGraphs.length === 0 ? (
        <Card>
          <Empty description="Chưa có đồ thị nào được lưu" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {savedGraphs.map(graph => (
            <Col xs={24} sm={12} lg={8} key={graph.id}>
              <Card
                title={graph.name}
                extra={
                  <div>
                    <Tooltip title="Xem đồ thị">
                      <Button 
                        type="text" 
                        icon={<EyeOutlined />} 
                        onClick={() => handleViewGraph(graph.id)} 
                        style={{ marginRight: 8 }}
                      />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                      <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => handleEditGraph(graph.id)} 
                        style={{ marginRight: 8 }}
                      />
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => deleteGraph(graph.id)} 
                      />
                    </Tooltip>
                  </div>
                }
              >
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary">{formatTime(graph.timestamp)}</Text>
                </div>
                
                {graph.description && (
                  <div style={{ marginBottom: 16 }}>
                    <Text>{graph.description}</Text>
                  </div>
                )}
                
                <List
                  size="small"
                  header={<Text strong>Biểu thức</Text>}
                  dataSource={graph.expressions}
                  renderItem={expr => (
                    <List.Item>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div 
                          style={{ 
                            width: 10, 
                            height: 10, 
                            borderRadius: '50%', 
                            backgroundColor: expr.color,
                            marginRight: 8 
                          }} 
                        />
                        <div>
                          <div>{expr.equation}</div>
                          <div>
                            <InlineMath math={expr.latex} />
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="Chỉnh sửa đồ thị"
        open={editModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => {
          setEditModalVisible(false);
          setCurrentGraph(null);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên đồ thị"
            rules={[{ required: true, message: 'Vui lòng nhập tên đồ thị' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SavedGraphs; 