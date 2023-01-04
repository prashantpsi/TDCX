import React from "react";
import {Skeleton} from "../style/style";

const TaskListCard = (props) => {
  return (
    <div
      className="card col-sm-12 col-md-12 col-lg-3 border-0 bg-transparent"
      style={{ height: "150px", margin: "5px 0px" }}
    >
      <div className="card-body shadow-sm rounded h-100 bg-white">
        <h5 className="card-title text-muted">Latest Created Tasks</h5>
        <ul className="card-text text-black-50" style={{ paddingLeft: "18px" }}>
          {props.latestLoading ? (
            <div>
              <Skeleton height="14px" width="100%" />
              <Skeleton height="14px" width="90%" />
              <Skeleton height="14px" width="80%" />
            </div>
          ) : (
            props.task.latestTasks.map((value, key) => (
              <li
                className={
                  value.completed ? "text-decoration-line-through" : ""
                }
                key={key}
              >
                {value.name}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

TaskListCard.propTypes = {};

export default TaskListCard;
