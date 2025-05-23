import React from 'react';
import { Alert, Typography } from 'antd';

const { Text } = Typography;

interface ErrorDisplayProps {
  error: string | null;
  description?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, description }) => {
  if (!error) return null;

  return (
    <Alert
      message="Lỗi"
      description={
        <>
          <Text strong>{error}</Text>
          {description && <div>{description}</div>}
        </>
      }
      type="error"
      showIcon
      closable
    />
  );
};

export default ErrorDisplay; 