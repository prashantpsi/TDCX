import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ErrorMessage, Input, Skeleton, Title } from "../style/style";
import { Controller, useForm } from "react-hook-form";
import Highlighter from "react-highlight-words";
import _ from "lodash";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import Modal from "../components/Modal";

import TaskStatusCard from "../components/taskStatusCard";
import TaskListCard from "../components/taskListCard";
import PieChartCard from "../components/pieChartCard";

const apiURL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const [taskLoading, setTaskLoading] = useState(true);
  const [latestLoading, setLatestLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [task, setTask] = useState({
    tasksCompleted: 0,
    totalTasks: 0,
    latestTasks: [],
    listing: [],
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      id: 0,
      name: "",
      completed: false,
    },
  });

  const axiosRef = useRef(null);

  const openModal = (value) => {
    document.body.style.overflowY = "hidden";

    setShow(true);
    reset({
      id: value ? value._id : 0,
      name: value ? value.name : "",
      completed: value ? value.completed : false,
    });
  };

  const closeModal = () => {
    document.body.style.overflowY = "auto";
    setShow(false);
  };

  const remove = (id) => {
    var r = window.confirm("Are you sure want to delete this task ?");
    if (r) {
      const taskListing = task.listing.filter((t) => t._id !== id);
      axiosRef.current
        .delete(`${apiURL}/tasks/${id}`)
        .then(() => {
          setTask({
            totalTasks: taskListing.length,
            tasksCompleted: taskListing.filter((t) => t.completed === true)
              .length,
            latestTasks: _.orderBy(taskListing, ["createdAt"], ["desc"]).filter(
              (t, k) => t._id !== id && k < 3
            ),
            listing: taskListing,
          });
        })
        .catch((error) => {
          toast.error(error, {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: "foo-bar",
          });
        });
    }
  };

  const store = async (value) => {
    let resp = null;
    try {
      if (value.id !== 0) {
        //update
        let data = { name: value.name, completed: value.completed };
        resp = await axiosRef.current.put(`${apiURL}/tasks/${value.id}`, data);

        let tasksCompleted = task.tasksCompleted;
        if (
          task.listing.find((t) => t._id === value.id).completed !==
          value.completed
        ) {
          if (value.completed) tasksCompleted += 1;
          else tasksCompleted -= 1;
        }

        setTask({
          ...task,
          tasksCompleted: tasksCompleted,
          latestTasks: task.latestTasks.map((t) =>
            t._id === value.id ? resp.data.task : t
          ),
          listing: task.listing.map((t) =>
            t._id === value.id ? resp.data.task : t
          ),
        });
        toast.success(resp.data.msg, {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "foo-bar",
        });
      } else {
        //create
        resp = await axiosRef.current.post(`${apiURL}/tasks`, {
          name: value.name,
        });

        const taskListing = [resp.data.task, ...task.listing];
        setTask({
          ...task,
          totalTasks: task.totalTasks + 1,
          latestTasks: _.orderBy(taskListing, ["createdAt"], ["desc"]).filter(
            (t, k) => k < 3
          ),
          listing: taskListing,
        });
        toast.success(resp.data.msg, {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "foo-bar",
        });
      }
      closeModal();
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "foo-bar",
      });
    }
  };

  const handleFilter = useMemo(() => {
    return task.listing.filter((t) =>
      t.name.toLowerCase().includes(String(search).toLowerCase())
    );
  }, [task.listing, search]);

  useEffect(() => {
    if (localStorage.getItem("userData")) {
      const fromSession = JSON.parse(localStorage.getItem("userData"));

      axiosRef.current = axios.create({
        headers: { Authorization: `Bearer ${fromSession.token.token}` },
      });

      setUser(fromSession);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    setTaskLoading(true);
    setTimeout(() => {
      setTaskLoading(false);
    }, 1000);
  }, [search]);

  useEffect(() => {
    if (user) {
      setLatestLoading(true);
      axios
        .all([
          axiosRef.current.get(`${apiURL}/dashboard`),
          axiosRef.current.get(`${apiURL}/tasks`),
        ])
        .then((resp) => {
          setTimeout(() => {
            setLatestLoading(false);
          }, 1000);

          setTask({
            ...resp[0].data,
            listing: resp[1].data.tasks,
          });
        })
        .catch((error) => {
          toast.error(error, {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: "foo-bar",
          });
        });
    }
  }, [user]);

  return (
    <div className="vh-100 bg-light">
      <Header navigate={navigate} user={user} />
      {!latestLoading && task.totalTasks === 0 ? (
        <div className="border d-flex align-items-center justify-content-center bg-light vh-100">
          <div className="d-flex flex-column align-items-center col-sm-4 p-3 shadow bg-white rounded">
            <h5 className="col-12 text-muted text-center mb-4">
              You have no task to do.
            </h5>
            <button className="btn btn-primary" onClick={() => openModal(null)}>
              + New Task
            </button>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column v-100 mt-20" style={{ gap: "30px" }}>
          <div className="row d-flex align-items-center justify-content-center">
            <TaskStatusCard task={task} />
            <TaskListCard latestLoading={latestLoading} task={task} />
            <PieChartCard task={task} />
          </div>
          <div className="row d-flex align-items-center justify-content-center">
            <div className="container col-sm-9">
              <div className="table-wrapper">
                <div className="table-title mb-2">
                  <div className="row">
                    <div className="col-sm-12 col-md-2">
                      <span className="h4 text-muted">Tasks</span>
                    </div>
                    <div className="col-sm-12 col-md-10">
                      <div className="d-flex flex-row justify-content-end">
                        <div className="d-flex flex-row align-items-start search">
                          <div className="input-group">
                            <div className="input-group-prepend rounded-0">
                              <span
                                className="input-group-text border-0 bg-secondary bg-opacity-25"
                                style={{
                                  borderRadius: "7px 0px 0px 7px",
                                  padding: "2px 0px",
                                }}
                              >
                                <img
                                  className="p-2"
                                  src="./icons/search-solid.svg"
                                  alt="search"
                                />
                              </span>
                            </div>
                            <input
                              className="form-control border-0 shadow-none bg-secondary bg-opacity-25"
                              style={{
                                marginLeft: "0rem",
                                paddingLeft: "0rem",
                              }}
                              placeholder="Search by task name"
                              onChange={(e) => setSearch(e.target.value)}
                            />
                          </div>

                          <button
                            className="btn btn-primary w-50"
                            style={{ marginLeft: "5px" }}
                            onClick={() => openModal(null)}
                          >
                            + New Task
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" bg-white p-3 shadow-sm rounded">
                  <table className="table m-0">
                    <tbody>
                      {taskLoading ? (
                        <tr style={{ padding: "24px" }}>
                          <td colSpan="2">
                            <Skeleton height="24px" width="100%" />
                            <Skeleton height="24px" width="90%" />
                            <Skeleton height="24px" width="80%" />
                          </td>
                        </tr>
                      ) : handleFilter.length > 0 ? (
                        _.orderBy(handleFilter, ["createdAt"], ["desc"]).map(
                          (value, key) => (
                            <tr key={key}>
                              <td className="col-md-10">
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    checked={value.completed}
                                    style={{ marginRight: "5px" }}
                                    onChange={() =>
                                      store({
                                        id: value._id,
                                        name: value.name,
                                        completed: !value.completed,
                                      })
                                    }
                                  />
                                  <label
                                    className={
                                      value.completed
                                        ? "text-decoration-line-through"
                                        : ""
                                    }
                                    onClick={() =>
                                      store({
                                        id: value._id,
                                        name: value.name,
                                        completed: !value.completed,
                                      })
                                    }
                                    htmlFor={value._id}
                                  >
                                    <Highlighter
                                      searchWords={[search]}
                                      autoEscape={true}
                                      textToHighlight={value.name}
                                    />
                                  </label>
                                </div>
                              </td>

                              <td className="col-md-2">
                                <div className="d-flex justify-content-evenly">
                                  <img
                                    className="cursor-pointer "
                                    onClick={() => openModal(value)}
                                    src="./icons/pen-solid.svg"
                                    style={{ marginRight: "16px" }}
                                    alt="pen"
                                  />
                                  <img
                                    className="cursor-pointer "
                                    onClick={() => remove(value._id)}
                                    src="./icons/trash-solid.svg"
                                    alt="trash"
                                  />
                                </div>
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <span className="h4 text-muted">No task found</span>
                        </div>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal show={show} onClose={closeModal}>
        <Title style={{ paddingBottom: "12px" }}>
          {getValues("id") === 0 ? (
            "+ New"
          ) : (
            <>
              <img src="./icons/pen-solid.svg" alt="pen" /> Edit
            </>
          )}{" "}
          Task
        </Title>
        <form id="taskForm" onSubmit={handleSubmit(store)}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input {...field} placeholder="Task Name" type="text" />
            )}
            rules={{ required: true }}
          />
        </form>
        {errors.name && <ErrorMessage>Name is required</ErrorMessage>}
        <button className="btn btn-primary" type="submit" form="taskForm">
          {getValues("id") === 0 ? "+ New" : "Update"} Task
        </button>
      </Modal>
    </div>
  );
};

export default Dashboard;
