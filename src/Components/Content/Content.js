import React, { useEffect } from "react";
import { Layout } from "antd";
import CardContainer from "./Cards/CardContainer";
import TaskList from "./TaskList/TaskList";
import "./content.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllTask } from "./../../Store/Slices/task";

const Content = () => {
  const dispatch = useDispatch(),
    { initLoading,taskList } = useSelector((state) => state.taskList);
  const { Content } = Layout;
  useEffect(() => {
    dispatch(getAllTask());
  }, [dispatch]);
  if(((taskList.tasks || []).length) > 0 || initLoading)
  return (
    <Content className="wrapper">
      <CardContainer />
      <TaskList taskList={taskList} />
    </Content>
  );
  else 
  return (
    <Content className="wrapper">
      <TaskList taskList={taskList} />
    </Content>
  );
};

export default Content;
