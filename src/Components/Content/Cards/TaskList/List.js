import React from "react";
import { Card, Typography } from "antd";

const List = (props) => {
    const {Text} = Typography;
    const list = [];
    if((props.latestTasks).length > 0) {
      props.latestTasks.map((task,i) => 
        list.push(
          <li key={i}><Text ellipsis delete={task.completed}>{task.name}</Text></li>
        )
      )
    }
  return (
    <Card title="Latest Created Tasks" bordered={false}>
      <ul>
      {list}
      </ul>
    </Card>
  );
};

export default List;
