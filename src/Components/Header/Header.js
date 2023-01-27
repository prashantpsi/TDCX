import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./../../Store/Slices/auth";
import { Layout, Menu, Avatar, Typography, Button } from "antd";
import "./header.css";

const Header = () => {
  const { Header } = Layout,
    dispatch = useDispatch(),
    { Title } = Typography,
    user = JSON.parse(localStorage.getItem("userData"));

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <div className="header-wrapper">
      <Header className="header">
        <div className="logo">
          <Avatar size={55} src={user.image} />
          <Title level={4}>{user.token.name}</Title>
        </div>
        <Menu
          className="nav-item"
          theme="light"
          level={3}
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={[
            {
              label: (
                <Button
                  className="nav-button"
                  onClick={logOut}
                  type="text"
                  block
                >
                  Logout
                </Button>
              ),
            },
          ]}
        />
      </Header>
    </div>
  );
};

export default Header;
