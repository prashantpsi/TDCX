import React from "react";
import PieChart from "../components/Pie";

const PieChartCard = (props) => {
  return (
    <div
      className="card col-sm-12 col-md-12 col-lg-3 border-0 bg-transparent"
      style={{ height: "150px", margin: "5px 0px" }}
    >
      <div className="card-body shadow-sm rounded h-100 bg-white">
        <PieChart
          incompleted={props.task.totalTasks - props.task.tasksCompleted}
          completed={props.task.tasksCompleted}
        />
      </div>
    </div>
  );
};

PieChartCard.propTypes = {};

export default PieChartCard;
