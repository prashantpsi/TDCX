import axios from "axios";
import authHeader from "./auth-header";

const apiURL = process.env.REACT_APP_API_URL;

const getDashboardData = () => {
  return axios
    .get(`${apiURL}/dashboard`, { headers: authHeader() })
    .then((response) => {
      return response.data;
    });
};

const getAllTask = () => {
  return axios
    .get(`${apiURL}/tasks`, { headers: authHeader() })
    .then((response) => {
      return response.data;
    });
};

const addTask = (req) => {
    return axios
      .post(`${apiURL}/tasks`, req, { headers: authHeader() })
      .then((response) => {
        return response.data;
      });
  };

const updateTask = (id, req) => {
  return axios
    .put(`${apiURL}/tasks/${id}`, req, { headers: authHeader() })
    .then((response) => {
      return response.data;
    });
};

const deleteTask = (id) => {
  return axios
    .delete(`${apiURL}/tasks/${id}`, { headers: authHeader() })
    .then((response) => {
      return response.data;
    });
};

const taskService = {
  getAllTask,
  addTask,
  updateTask,
  deleteTask,
  getDashboardData,
};

export default taskService;
