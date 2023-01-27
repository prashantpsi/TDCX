import React, { useEffect } from "react";
import { Col } from "antd";
import Status from "./Status/Status";
import List from "./TaskList/List";
import Chart from "./Chart/Chart";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "./../../../Store/Slices/task";
import "./cardContainer.css";
import _ from "lodash";

const CardContainer = () => {
  const dispatch = useDispatch(),
    { taskList } = useSelector((state) => state);
  useEffect(() => {
    dispatch(getDashboardData());
  }, [dispatch]);
  return (
    <Col className="w-100" xs={24} xl={17} lg={17}>
      <div className="site-card-wrapper">
        <Col xs={24} lg={8}>
          <Status
            tasksCompleted={taskList.dashboardData.tasksCompleted || 0}
            totalTasks={taskList.dashboardData.totalTasks || 0}
          />
        </Col>
        <Col xs={24} lg={8}>
          <List
            latestTasks={
              _.orderBy(
                taskList.taskList.tasks,
                ["createdAt"],
                ["desc"]
              ).filter((t, i) => i < 3) || []
            }
          />
        </Col>
        <Col xs={24} lg={8}>
          <Chart
            tasksCompleted={taskList.dashboardData.tasksCompleted || 0}
            totalTasks={taskList.dashboardData.totalTasks || 0}
          />
        </Col>
      </div>
    </Col>
  );
};

export default CardContainer;
