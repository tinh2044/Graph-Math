import React from "react";
import { List, Empty } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveExpression, // Only this action is needed here now
  type Expression, // Expression type for dataSource
} from "@/redux/slices/graphDataSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import ExpressionListItem from "./ExpressionListItem";

const ExpressionList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { expressions, activeExpression } = useSelector(
    (state: RootState) => state.graphData
  );

  const handleSetActiveExpression = (expressionId: string) => {
    dispatch(setActiveExpression(expressionId));
  };

  if (expressions.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Chưa có biểu thức nào"
        className="mt-4"
      />
    );
  }

  return (
    <div className="px-2 py-1 expression-list-container">
      <List
        size="small"
        dataSource={expressions}
        itemLayout="horizontal"
        renderItem={(item: Expression) => (
          <ExpressionListItem
            key={item.id}
            item={item}
            isActive={activeExpression?.id === item.id}
            onSetActive={handleSetActiveExpression}
          />
        )}
      />
    </div>
  );
};

export default ExpressionList;
