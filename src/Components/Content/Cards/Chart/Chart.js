import React from "react";
import { Card } from "antd";
import { Pie } from "@ant-design/plots";
import "./chart.css";

const Chart = (props) => {
  const data = [
    {
      type: "Completed",
      value: props.tasksCompleted,
    },
    {
      type: "Pending",
      value: (props.totalTasks - props.tasksCompleted),
    },
  ];
  const cfg = {
    data,
    angleField: "value",
    colorField: "type",
    color: ["#5285EC", "#E8ECEC"],
    radius: 0.75,
    legend: false,
    label: {
      type: "spider",
      content: "{name}",
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
  };
  const config = cfg;
  return (
    <Card bordered={false}>
      <Pie {...config} />
    </Card>
  );
};

export default Chart;
