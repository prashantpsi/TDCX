import React from "react";

const TaskStatusCard = (props) => {
  return (
    <div
      className="card col-sm-12 col-md-12 col-lg-3 border-0 bg-transparent"
      style={{ height: "150px", margin: "5px 0px" }}
    >
      <div className="card-body shadow-sm rounded h-100 bg-white">
        <h5 className="card-title text-muted">Tasks Completed</h5>
        <p className="card-text text-primary">
          <span className="display-1">{props.task.tasksCompleted}</span>
          <span className="h4">/{props.task.totalTasks}</span>
        </p>
      </div>
    </div>
  );
};

TaskStatusCard.propTypes = {};

export default TaskStatusCard;
