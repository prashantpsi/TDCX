import React, { useEffect, useMemo } from "react";
import {
  Row,
  Table,
  Col,
  Button,
  Popconfirm,
  Modal,
  Input,
  Typography,
  Checkbox,
  Spin,
  Form,
  Skeleton,
  message as reqMessage,
} from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import {
  // getAllTask,
  addTask,
  updateTask,
  updateTaskName,
  deleteTask,
} from "./../../../Store/Slices/task";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { clearMessage } from "./../../../Store/Slices/message";
import "./taskList.css";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    width: "70%",
  },
  {
    title: "Actions",
    dataIndex: "actions",
    align: "right",
    width: "30%",
  },
];

const TaskList = (props) => {
  const { Title, Text } = Typography,
    dispatch = useDispatch(),
    // { taskList } = useSelector((state) => state.taskList),
    [modalOpen, setModalOpen] = useState(false),
    [loading, setLoading] = useState(false),
    { message } = useSelector((state) => state.message),
    // [messageApi, contextHolder] = reqMessage.useMessage(),
    [search, setSearch] = useState(""),
    [taskName, setTaskName] = useState(""),
    [modalMode, setModalMode] = useState("add"),
    [updateData, setUpdateData] = useState({}),
    // [initLoading, setInitLoading] = useState(false),
    [formError, setFormError] = useState(false),
    { initLoading } = useSelector((state) => state.taskList);

  useEffect(() => {
    // setInitLoading(true);
    dispatch(clearMessage());
    // dispatch(getAllTask());
  }, [dispatch]);

  const addNewTask = () => {
    if (formValidation()) {
      setLoading(true);
      const data = { name: taskName };
      dispatch(addTask({ req: data }))
        .unwrap()
        .then(() => {
          // messageApi.open({
          //   type: "success",
          //   content: message || "Task was created successfully.",
          // });
          reqMessage.success(message || "Task was created successfully.");
          dispatch(clearMessage());
          setModalOpen(false);
          setTaskName("");
          setLoading(false);
        })
        .catch(() => {
          // messageApi.open({
          //   type: "error",
          //   content:
          //     message || "There's something wrong please try again later",
          // });
          reqMessage.error(message || "There's something wrong please try again later.");
          setLoading(false);
        });
    }
  };

  const handleEditBtn = (id, name, completed) => {
    setModalOpen(true);
    setTaskName(name);
    setFormError(false);
    setModalMode("edit");
    const data = { id: id, req: { name: name, completed: completed } };
    setUpdateData(data);
  };

  const formValidation = () => {
    if (taskName.trim() === "") {
      setFormError(true);
      return false;
    }
    return true;
  };

  const editTask = () => {
    if (formValidation()) {
      setLoading(true);
      const data = {
        id: updateData.id,
        req: { name: taskName, completed: updateData.completed },
      };
      dispatch(updateTaskName(data))
        .unwrap()
        .then(() => {
          // messageApi.open({
          //   type: "success",
          //   content: message || "Task was updated Successfully",
          // });
          reqMessage.success(message || "Task was updated Successfully.");
          dispatch(clearMessage());
          setModalOpen(false);
          setTaskName("");
          setLoading(false);
        })
        .catch((error) => {
          // messageApi.open({
          //   type: "error",
          //   content:
          //     message || "There's something wrong please try again later",
          // });
          reqMessage.error(message || "There's something wrong please try again later.");
          setLoading(false);
        });
    }
  };

  const completeTask = (e, name) => {
    setLoading(true);
    const data = { name: name, completed: e.target.checked },
      id = e.target.id;
    dispatch(updateTask({ id: id, req: data }))
      .unwrap()
      .then(() => {
        // messageApi.open({
        //   type: "success",
        //   content: message || "Task was updated Successfully",
        // });
        reqMessage.success(message || "Task was updated Successfully.");
        dispatch(clearMessage());
        setLoading(false);
      })
      .catch((error) => {
        // messageApi.open({
        //   type: "error",
        //   content: message || "There's something wrong please try again later",
        // });
        reqMessage.error(message || "There's something wrong please try again later.");
        setLoading(false);
      });
  };

  const removeTask = (id) => {
    setLoading(true);
    dispatch(deleteTask({ id: id }))
      .unwrap()
      .then(() => {
        // messageApi.open({
        //   type: "success",
        //   content: message || "Category was deleted successfully",
        // });
        reqMessage.success(message || "Category was deleted successfully.");
        dispatch(clearMessage());
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const handleFilter = useMemo(() => {
    // setInitLoading(false);
    return (props.taskList.tasks || []).filter((t) =>
      t.name.toLowerCase().includes(String(search).toLowerCase())
    );
  }, [props.taskList.tasks, search]);

  const data = [];
  if (handleFilter) {
    (_.orderBy(handleFilter, ["createdAt"], ["desc"]) || []).map((task, i) => {
      let taskName = "";
      if (task.completed) {
        taskName = <Text delete>{task.name}</Text>;
      } else {
        taskName = <Text>{task.name}</Text>;
      }

      return data.push({
        key: task._id,
        name: (
          <Checkbox
            id={task._id}
            checked={task.completed}
            onChange={(e) => {
              completeTask(e, task.name);
            }}
          >
            {taskName}
          </Checkbox>
        ),
        actions: (
          <div>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={(e) =>
                handleEditBtn(task._id, task.name, task.completed)
              }
            />
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={() => {
                removeTask(task._id);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        ),
      });
    });
  }

  const tableProps = {
    showHeader: false,
    footer: false,
    pagination: false,
  };

  let componentReturn;
  if ((props.taskList.tasks || []).length > 0 || initLoading)
    componentReturn = (
      <Col className="table-wrapper" xs={24} xl={17} lg={17}>
        <div className="table-header">
          <Col xs={24} lg={2}>
            <Title level={3}>Tasks</Title>
          </Col>
          <Col xs={24} lg={14} className="search-input">
            <Col xs={24} lg={17}>
              <Input
                placeholder="Search by task name"
                onChange={(e) => setSearch(e.target.value)}
                prefix={<SearchOutlined className="site-form-item-icon" />}
              />
            </Col>
            <Col xs={24} lg={6}>
              <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => {
                  setModalOpen(true);
                  setTaskName("");
                  setModalMode("add");
                  setFormError(false);
                }}
              >
                New Task
              </Button>
            </Col>
          </Col>
        </div>
        {/* {contextHolder} */}
        <Skeleton className="skeletonBox" loading={initLoading} active avatar>
          <Spin tip="Loading..." spinning={loading && !initLoading}>
            <Table {...tableProps} columns={columns} dataSource={data} />
          </Spin>
        </Skeleton>
      </Col>
    );
  else
    componentReturn = (
      <Row justify="space-around" align="middle" className="vh-90 w-100">
        <Col xs={18} sm={10} md={10} lg={8} xl={6}>
          <div className="no-task-box">
            <Title level={3}>You have no task.</Title>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => {
                setModalOpen(true);
                setTaskName("");
                setModalMode("add");
                setFormError(false);
              }}
            >
              New Task
            </Button>
          </div>
        </Col>
      </Row>
    );
  return (
    <>
      {componentReturn}
      <Modal
        title={
          modalMode === "add" ? (
            <>
              <PlusOutlined /> New Task
            </>
          ) : (
            <>
              <EditOutlined /> Edit Task
            </>
          )
        }
        centered
        open={modalOpen}
        closable={true}
        width={300}
        footer={null}
        onCancel={() => setModalOpen(false)}
      >
        <Form
          name="update"
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={() => (modalMode === "add" ? addNewTask() : editTask())}
          autoComplete="off"
        >
          <Form.Item
            // name={`taskName_${taskName}`}
            // defaultValue={taskName}
            validateStatus={formError ? "error" : ""}
            help={formError ? "Please enter the task Name!" : ""}
          >
            <Input
              value={taskName}
              // status="error"
              onChange={(e) => {
                setTaskName(e.target.value);
              }}
              placeholder="Task Name"
            />
          </Form.Item>
          <Form.Item
            className="login-button"
            wrapperCol={{
              offset: 0,
              span: 24,
            }}
          >
            <Button
              size="large"
              className="w-100"
              type="primary"
              loading={loading}
              htmlType="submit"
            >
              {modalMode === "add" ? "Add Task" : "Update Task "}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TaskList;
