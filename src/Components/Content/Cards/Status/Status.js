import React from "react";
import { Card } from "antd";
import "./status.css";
const Status = (props) => {
  return (
    <Card title="Tasks Completed" bordered={false}>
      <span className="large">{props.tasksCompleted}</span>
      <span className="small">/{props.totalTasks}</span>
    </Card>
  );
};

export default Status;
