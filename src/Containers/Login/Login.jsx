import React, { useState, useEffect } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Col, Button, Typography, Form, Input, Row, Alert } from "antd";
import "./login.css";

import { login } from "./../../Store/Slices/auth";
import { clearMessage } from "./../../Store/Slices/message";

const Login = () => {
  const { Title } = Typography,
    [name, setName] = useState(""),
    [password, setPassword] = useState(""),
    // [error, setError] = useState(""),
    [loading, setLoading] = useState(false),
    navigate = useNavigate(),
    { isLoggedIn } = useSelector((state) => state.auth),
    { message } = useSelector((state) => state.message),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const onFinish = () => {
    setLoading(true);
    dispatch(login({ name, password }))
      .unwrap()
      .then(() => {
        navigate("/dashboard");
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  const onFinishFailed = () => {
    console.log("innnnnn");
  };

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <Row justify="space-around" align="middle" className="vh-100">
      <Col xs={18} sm={10} md={8} lg={6} xl={5}>
        <div className="login-box">
          <Form
            name="login"
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item>
              <Title className="title" level={3}>
                Login
              </Title>
            </Form.Item>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                size="large"
                placeholder="Username"
                onChange={(e) => {
                  setName(e.target.value);
                  dispatch(clearMessage());
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  dispatch(clearMessage());
                }}
              />
            </Form.Item>

            {message && (
              <Form.Item>
                <Alert message={message} type="error" showIcon />
              </Form.Item>
            )}
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
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Login;
