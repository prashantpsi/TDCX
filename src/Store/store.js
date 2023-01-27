import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/auth";
import messageReducer from "./Slices/message";
import taskReducer from "./Slices/task";

const reducer = {
  auth: authReducer,
  message: messageReducer,
  taskList: taskReducer,
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;
