import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

const login = (name, password) => {
  return axios
    .post(`${apiURL}/login`, {
      name: name,
      apiKey: password,
    })
    .then((response) => {
      localStorage.setItem(
        "userData",
        JSON.stringify({
          image: `${apiURL}/${response.data.image}`,
          token: response.data.token,
        })
      );
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("userData");
};

const authService = {
  login,
  logout,
};

export default authService;
