import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import TaskService from "../Services/task.service";

export const getDashboardData = createAsyncThunk(
  "task/getDashboardData",
  async () => {
    const data = await TaskService.getDashboardData();
    return { dashboardData: data };
  }
);

export const getAllTask = createAsyncThunk("task/getAllTask", async () => {
  const data = await TaskService.getAllTask();
  return { taskList: data };
});

export const addTask = createAsyncThunk(
  "task/addTask",
  async ({ req }, thunkAPI) => {
    try {
      const data = await TaskService.addTask(req);
      const message =
        (data.response && data.response.data && data.response.data.msg) ||
        data.msg ||
        data.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.fulfillWithValue({ task: data });
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async ({ id, req }, thunkAPI) => {
    try {
      const data = await TaskService.updateTask(id, req);
      const message =
        (data.response && data.response.data && data.response.data.msg) ||
        data.msg ||
        data.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.fulfillWithValue({ task: data });
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const updateTaskName = createAsyncThunk(
  "task/updateTaskName",
  async ({ id, req }, thunkAPI) => {
    try {
      const data = await TaskService.updateTask(id, req);
      const message =
        (data.response && data.response.data && data.response.data.msg) ||
        data.msg ||
        data.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.fulfillWithValue({ task: data });
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async ({ id }, thunkAPI) => {
    try {
      const data = await TaskService.deleteTask(id);
      const message =
        (data.response && data.response.data && data.response.data.msg) ||
        data.msg ||
        data.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.fulfillWithValue({ task: data });
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  }
);

const initialState = { dashboardData: [], taskList: [], initLoading: true };

const taskSlice = createSlice({
  name: "task",
  initialState,
  extraReducers: {
    [getAllTask.fulfilled]: (state, action) => {
      state.taskList = action.payload.taskList;
      state.initLoading = false;
    },
    [getAllTask.rejected]: (state, action) => {
      state.taskList = null;
      state.initLoading = false;
    },
    [getDashboardData.fulfilled]: (state, action) => {
      state.dashboardData = action.payload.dashboardData;
    },
    [getDashboardData.rejected]: (state, action) => {
      state.dashboardData = null;
    },
    [addTask.fulfilled]: (state, action) => {
      state.taskList.tasks.push(action.payload.task.task);
      state.dashboardData.totalTasks += 1;
    },
    [updateTask.fulfilled]: (state, action) => {
      state.taskList.tasks = state.taskList.tasks.map((taskObj) =>
        taskObj._id === action.payload.task.task._id
          ? { ...state.taskList.tasks, ...action.payload.task.task }
          : taskObj
      );
      if (action.payload.task.task.completed) {
        state.dashboardData.tasksCompleted += 1;
      } else {
        state.dashboardData.tasksCompleted -= 1;
      }
    },
    [updateTaskName.fulfilled]: (state, action) => {
      state.taskList.tasks = state.taskList.tasks.map((taskObj) =>
        taskObj._id === action.payload.task.task._id
          ? { ...state.taskList.tasks, ...action.payload.task.task }
          : taskObj
      );
    },
    [deleteTask.fulfilled]: (state, action) => {
      state.taskList.tasks = state.taskList.tasks.filter(
        (taskObj) => taskObj._id !== action.payload.task.task._id
      );
      state.dashboardData.totalTasks = state.taskList.tasks.length;
      const tasksCompleted = state.taskList.tasks.filter(
        (taskObj) => taskObj.completed
      );
      state.dashboardData.tasksCompleted = tasksCompleted.length;
    },
  },
});

const { reducer } = taskSlice;
export default reducer;
