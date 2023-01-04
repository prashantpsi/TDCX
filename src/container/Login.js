import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

const apiURL = process.env.REACT_APP_API_URL;
const Login = () => {
  const [name, setName] = useState(""),
    [password, setPassword] = useState(""),
    navigate = useNavigate(),
    [loginError, setLoginError] = useState(false);

  function validateForm() {
    return name.length > 0 && password.length > 0;
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${apiURL}/login`, {
        name: name,
        apiKey: password,
      })
      .then((resp) => {
        localStorage.setItem(
          "userData",
          JSON.stringify({
            image: `${apiURL}/${resp.data.image}`,
            token: resp.data.token,
          })
        );
        navigate("/");
      })
      .catch((error) => {
        setLoginError(true);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("userData")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className="border d-flex align-items-center justify-content-center bg-light vh-100">
      <div className="col-lg-3 p-3 shadow bg-white rounded">
        <h5 className="col-12 text-muted mb-4">Login</h5>
        <Form onSubmit={handleSubmit}>
          <Form.Group size="lg" controlId="name">
            <Form.Control
              autoFocus
              type="text"
              className="col-12 mt-2 mb-2"
              placeholder="Name"
              value={name}
              autoComplete="false"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group size="lg" controlId="password">
            <Form.Control
              type="password"
              value={password}
              className="col-12 mt-2 mb-2"
              placeholder="Password"
              autoComplete="false"
              onChange={(e) => setPassword(e.target.value)}
            />
            { loginError && <div className="row d-flex justify-content-center"><span className="alert text-danger alert-danger col-md-11 p-1 mb-2">Invalid Credentials !</span></div> }
          </Form.Group>
          <Button
            block="true"
            size="lg"
            className="col-12 mb-2"
            type="submit"
            disabled={!validateForm()}
          >
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
